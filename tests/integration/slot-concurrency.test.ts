import { describe, it, expect, afterAll } from "vitest";
import { createTestUser, deleteTestUser, getDefaultChronicleId, type TestUser } from "../helpers/clients";

/**
 * ADR 0002 — teto de 3 personagens ativos por usuário+crônica, garantido
 * atomicamente no banco via advisory lock de transação, não por
 * contagem no client. N inserts paralelos devem resultar em exatamente
 * 3 sucessos.
 */
describe("limite de 3 slots sob concorrência", () => {
  let player: TestUser;

  afterAll(async () => {
    if (player) await deleteTestUser(player.id);
  });

  it("permite no máximo 3 personagens ativos mesmo com 5 criações simultâneas", async () => {
    player = await createTestUser("slot-race");
    const chronicleId = await getDefaultChronicleId();

    const attempts = await Promise.allSettled(
      Array.from({ length: 5 }, (_, i) =>
        player.client.rpc("create_character_draft", {
          p_chronicle_id: chronicleId,
          p_name: `Personagem ${i}`,
        }),
      ),
    );

    const succeeded = attempts.filter(
      (result) => result.status === "fulfilled" && !result.value.error,
    ) as PromiseFulfilledResult<{ data: { slot_number: number | null } | null; error: unknown }>[];
    const failed = attempts.filter(
      (result) => result.status === "rejected" || (result.status === "fulfilled" && result.value.error),
    );

    expect(succeeded).toHaveLength(3);
    expect(failed).toHaveLength(2);

    const slots = succeeded.map((r) => r.value.data?.slot_number).sort();
    expect(slots).toEqual([1, 2, 3]);
  });

  it("libera o slot ao arquivar e permite criar um novo personagem", async () => {
    const chronicleId = await getDefaultChronicleId();
    const { data: characters } = await player.client
      .from("characters")
      .select("id")
      .eq("owner_id", player.id)
      .neq("status", "archived")
      .limit(1);

    const characterId = characters?.[0]?.id;
    if (!characterId) throw new Error("Nenhum personagem ativo encontrado para arquivar.");

    const { error: archiveError } = await player.client.rpc("archive_character", {
      p_character_id: characterId,
    });
    expect(archiveError).toBeNull();

    const { data: newDraft, error: createError } = await player.client.rpc("create_character_draft", {
      p_chronicle_id: chronicleId,
      p_name: "Personagem pós-arquivamento",
    });

    expect(createError).toBeNull();
    expect(newDraft?.slot_number).not.toBeNull();
  });
});
