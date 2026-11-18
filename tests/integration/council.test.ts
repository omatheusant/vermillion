import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  adminClient,
  anonClient,
  createTestUser,
  deleteTestUser,
  getDefaultChronicleId,
  promoteToStoryteller,
  type TestUser,
} from "../helpers/clients";

/**
 * Fase E — infraestrutura nova do Conselho: concessão pontual de poder
 * (ADR 0008), config de crônica restrita a staff (ADR 0002 — nunca
 * "max_active_characters"), e a view pública com owner_id continua sem
 * vazar nada privado.
 */
describe("Conselho — ADR 0008 e config de crônica", () => {
  let playerA: TestUser;
  let storyteller: TestUser;
  let chronicleId: string;
  let characterId: string;
  let originalSettings: unknown;

  beforeAll(async () => {
    [playerA, storyteller] = await Promise.all([createTestUser("council-player"), createTestUser("council-storyteller")]);
    chronicleId = await getDefaultChronicleId();
    await promoteToStoryteller(storyteller.id, chronicleId);

    const { data: chronicle } = await adminClient.from("chronicles").select("settings").eq("id", chronicleId).single();
    originalSettings = chronicle?.settings;

    const { data } = await playerA.client.rpc("create_character_draft", {
      p_chronicle_id: chronicleId,
      p_name: "Personagem do Conselho",
    });
    characterId = data!.id;
  });

  afterAll(async () => {
    // Restaura a config real da crônica compartilhada — este teste a
    // sobrescreve de propósito para validar a trigger de guarda.
    await adminClient
      .from("chronicles")
      .update({ settings: originalSettings as NonNullable<import("@/lib/supabase/database.types").Json> })
      .eq("id", chronicleId);
    await Promise.all([deleteTestUser(playerA.id), deleteTestUser(storyteller.id)]);
  });

  it("grant_narrator_power rejeita quem não é staff", async () => {
    const { error } = await playerA.client.rpc("grant_narrator_power", {
      p_character_id: characterId,
      p_discipline_id: "oblivion",
      p_custom_name: "Poder Forjado",
      p_custom_level: 3,
      p_custom_summary: "tentativa de forjar poder",
      p_source_reference: "inventado",
    });
    expect(error).not.toBeNull();
  });

  it("grant_narrator_power rejeita antes de o personagem ser enviado para avaliação (ainda draft)", async () => {
    const { error } = await storyteller.client.rpc("grant_narrator_power", {
      p_character_id: characterId,
      p_discipline_id: "oblivion",
      p_custom_name: "Poder Cedo Demais",
      p_custom_level: 2,
      p_custom_summary: "",
      p_source_reference: "p. 1",
    });
    expect(error).not.toBeNull();
  });

  it("staff concede poder não verificado depois do envio, com fonte registrada", async () => {
    await playerA.client.rpc("submit_character_for_review", { p_character_id: characterId });

    const { data, error } = await storyteller.client.rpc("grant_narrator_power", {
      p_character_id: characterId,
      p_discipline_id: "oblivion",
      p_custom_name: "Sussurro do Abismo",
      p_custom_level: 3,
      p_custom_summary: "poder concedido manualmente para este personagem",
      p_source_reference: "Vampire: The Masquerade corebook, p. 200",
    });
    expect(error).toBeNull();
    expect(data?.granted_by_narrator_id).toBe(storyteller.id);
  });

  it("grant_narrator_power exige fonte (ADR 0008) — rejeita sem source_reference", async () => {
    const { error } = await storyteller.client.rpc("grant_narrator_power", {
      p_character_id: characterId,
      p_discipline_id: "oblivion",
      p_custom_name: "Poder Sem Fonte",
      p_custom_level: 1,
      p_custom_summary: "",
      p_source_reference: "",
    });
    expect(error).not.toBeNull();
  });

  it("depois de approved, grant_narrator_power não vale mais (ADR 0008)", async () => {
    await storyteller.client.rpc("approve_character", { p_character_id: characterId });

    const { error } = await storyteller.client.rpc("grant_narrator_power", {
      p_character_id: characterId,
      p_discipline_id: "oblivion",
      p_custom_name: "Poder Tarde Demais",
      p_custom_level: 1,
      p_custom_summary: "",
      p_source_reference: "p. 1",
    });
    expect(error).not.toBeNull();
  });

  it("jogador comum não consegue editar settings da crônica", async () => {
    const { data } = await playerA.client
      .from("chronicles")
      .update({ settings: { sects_enabled: [] } })
      .eq("id", chronicleId)
      .select();
    expect(data).toEqual([]);
  });

  it("staff edita settings da crônica, mas a trigger recusa a chave proibida max_active_characters", async () => {
    const ok = await storyteller.client
      .from("chronicles")
      .update({ settings: { sects_enabled: ["camarilla"], starting_budget: { merits: 7, flaws: 2, humanity: 7 } } })
      .eq("id", chronicleId);
    expect(ok.error).toBeNull();

    const forbidden = await storyteller.client
      .from("chronicles")
      .update({ settings: { max_active_characters: 5 } })
      .eq("id", chronicleId);
    expect(forbidden.error).not.toBeNull();
  });

  it("export_character_json só funciona para dono/staff, nunca para outro jogador", async () => {
    const outsider = await createTestUser("council-outsider");
    const { error } = await outsider.client.rpc("export_character_json", { p_character_id: characterId });
    expect(error).not.toBeNull();
    await deleteTestUser(outsider.id);

    const { data, error: ownerError } = await playerA.client.rpc("export_character_json", { p_character_id: characterId });
    expect(ownerError).toBeNull();
    expect(data).toBeTruthy();
  });

  it("fluxo completo até publicado: personagem aparece em public_characters com owner_id, sem campos privados", async () => {
    await playerA.client.rpc("publish_character", { p_character_id: characterId });

    const visitor = anonClient();
    const { data, error } = await visitor.from("public_characters").select("*").eq("id", characterId).maybeSingle();

    expect(error).toBeNull();
    expect(data?.owner_id).toBe(playerA.id);
    expect(data).not.toHaveProperty("private_notes");
    expect(data).not.toHaveProperty("real_name");
  });
});
