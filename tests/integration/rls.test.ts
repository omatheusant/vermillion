import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  anonClient,
  createTestUser,
  deleteTestUser,
  getDefaultChronicleId,
  promoteToStoryteller,
  type TestUser,
} from "../helpers/clients";

/**
 * docs/DATA_MODEL.md §5.7 — quatro cenários: jogador A (dono), jogador B
 * (outro dono), narrador (staff da crônica) e visitante (anônimo).
 */
describe("RLS — characters e character_details", () => {
  let playerA: TestUser;
  let playerB: TestUser;
  let storyteller: TestUser;
  let chronicleId: string;
  let characterId: string;

  beforeAll(async () => {
    [playerA, playerB, storyteller] = await Promise.all([
      createTestUser("rls-player-a"),
      createTestUser("rls-player-b"),
      createTestUser("rls-storyteller"),
    ]);

    chronicleId = await getDefaultChronicleId();
    await promoteToStoryteller(storyteller.id, chronicleId);

    const { data, error } = await playerA.client.rpc("create_character_draft", {
      p_chronicle_id: chronicleId,
      p_name: "Dossiê de Teste",
    });
    if (error || !data) throw new Error(`Falha ao preparar personagem de teste: ${error?.message}`);
    characterId = data.id;

    await playerA.client
      .from("character_details")
      .update({ private_notes: "segredo só do dono" })
      .eq("character_id", characterId);
  });

  afterAll(async () => {
    await Promise.all([deleteTestUser(playerA.id), deleteTestUser(playerB.id), deleteTestUser(storyteller.id)]);
  });

  it("dono vê o próprio personagem (draft, privado)", async () => {
    const { data } = await playerA.client.from("characters").select("id").eq("id", characterId).maybeSingle();
    expect(data?.id).toBe(characterId);
  });

  it("outro jogador não vê o personagem (draft, privado) de A", async () => {
    const { data } = await playerB.client.from("characters").select("id").eq("id", characterId).maybeSingle();
    expect(data).toBeNull();
  });

  it("outro jogador não consegue atualizar o personagem de A", async () => {
    const { data } = await playerB.client
      .from("characters")
      .update({ name: "Sequestrado" })
      .eq("id", characterId)
      .select();
    expect(data).toEqual([]);
  });

  it("outro jogador não vê os dados privados de character_details de A", async () => {
    const { data } = await playerB.client
      .from("character_details")
      .select("private_notes")
      .eq("character_id", characterId)
      .maybeSingle();
    expect(data).toBeNull();
  });

  it("narrador (staff) vê o personagem de A mesmo sendo draft/privado", async () => {
    const { data } = await storyteller.client
      .from("characters")
      .select("id")
      .eq("id", characterId)
      .maybeSingle();
    expect(data?.id).toBe(characterId);
  });

  it("narrador vê character_details de A (inclusive campos privados, para revisão)", async () => {
    const { data } = await storyteller.client
      .from("character_details")
      .select("private_notes")
      .eq("character_id", characterId)
      .maybeSingle();
    expect(data?.private_notes).toBe("segredo só do dono");
  });

  it("visitante anônimo não vê o personagem privado de A", async () => {
    const { data } = await anonClient().from("characters").select("id").eq("id", characterId).maybeSingle();
    expect(data).toBeNull();
  });

  it("jogador não pode forjar transição de status direto (sem RPC)", async () => {
    const { error } = await playerA.client
      .from("characters")
      .update({ status: "approved" })
      .eq("id", characterId);
    expect(error).not.toBeNull();
  });

  it("jogador não-staff não pode chamar approve_character", async () => {
    const { error } = await playerA.client.rpc("approve_character", { p_character_id: characterId });
    expect(error).not.toBeNull();
  });

  it("fluxo legítimo: dono submete, narrador aprova e publica; aí sim vira público", async () => {
    const submit = await playerA.client.rpc("submit_character_for_review", { p_character_id: characterId });
    expect(submit.error).toBeNull();

    const approve = await storyteller.client.rpc("approve_character", { p_character_id: characterId });
    expect(approve.error).toBeNull();
    expect(approve.data?.status).toBe("approved");

    const publish = await playerA.client.rpc("publish_character", { p_character_id: characterId });
    expect(publish.error).toBeNull();
    expect(publish.data?.status).toBe("published");
    expect(publish.data?.visibility).toBe("public");

    const visitorView = await anonClient()
      .from("public_characters")
      .select("id, concept")
      .eq("id", characterId)
      .maybeSingle();
    expect(visitorView.data?.id).toBe(characterId);

    const visitorRawDetails = await anonClient()
      .from("character_details")
      .select("private_notes")
      .eq("character_id", characterId)
      .maybeSingle();
    expect(visitorRawDetails.data).toBeNull();
  });
});
