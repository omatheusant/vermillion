import { test, expect } from "@playwright/test";
import { createE2eUser, deleteE2eUser, loginAs, signInClient, getDefaultChronicleId, type E2eUser } from "./helpers";

test.describe("Teto de 3 slots e isolamento entre contas (Fase F, item 1)", () => {
  let playerA: E2eUser;
  let playerB: E2eUser;
  let activeCharacterId: string;

  test.beforeAll(async () => {
    playerA = await createE2eUser("e2e-slots-a");
    playerB = await createE2eUser("e2e-slots-b");

    const client = await signInClient(playerA);
    const chronicleId = await getDefaultChronicleId(client);

    // Ocupa os 3 slots de playerA via API (o que importa aqui é o
    // bloqueio, não repetir o wizard inteiro 3 vezes).
    let lastId = "";
    for (let i = 0; i < 3; i++) {
      const { data, error } = await client.rpc("create_character_draft", {
        p_chronicle_id: chronicleId,
        p_name: `Rascunho ${i + 1}`,
      });
      if (error) throw error;
      lastId = data!.id;
    }
    activeCharacterId = lastId;
  });

  test.afterAll(async () => {
    await Promise.all([deleteE2eUser(playerA.id), deleteE2eUser(playerB.id)]);
  });

  test("com os 3 slots ocupados, a Etapa 0 mostra o bloqueio e não deixa criar o 4º", async ({ page }) => {
    await loginAs(page, playerA);
    await page.goto("/app/personagens/novo");

    await expect(page.getByText("Seus 3 slots já estão ocupados.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Começar meu Abraço" })).toHaveCount(0);
  });

  test("outro jogador não acessa a etapa de edição do personagem de playerA (404)", async ({ page }) => {
    await loginAs(page, playerB);
    const response = await page.goto(`/app/personagens/${activeCharacterId}/editar/1`);
    expect(response?.status()).toBe(404);
  });

  test("outro jogador não acessa a Ficha Viva do personagem privado de playerA (404)", async ({ page }) => {
    await loginAs(page, playerB);
    const response = await page.goto(`/app/personagens/${activeCharacterId}`);
    expect(response?.status()).toBe(404);
  });

  test("visitante anônimo é redirecionado ao tentar acessar /app diretamente", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/app");
    await page.waitForURL(/\/entrar/);
  });
});

test.describe("Arquivar personagem (ADR 0006 — transição terminal)", () => {
  let player: E2eUser;
  let characterId: string;

  test.beforeAll(async () => {
    player = await createE2eUser("e2e-archive");
    const client = await signInClient(player);
    const chronicleId = await getDefaultChronicleId(client);
    const { data, error } = await client.rpc("create_character_draft", { p_chronicle_id: chronicleId, p_name: "Para arquivar" });
    if (error || !data) throw new Error(`create_character_draft: ${error?.message}`);
    characterId = data.id;
  });

  test.afterAll(async () => {
    await deleteE2eUser(player.id);
  });

  test("arquivar pede confirmação, remove do Grimório e libera o slot", async ({ page }) => {
    await loginAs(page, player);
    await page.goto(`/app/personagens/${characterId}`);

    await page.getByRole("button", { name: "Arquivar" }).click();
    await expect(page.getByText("É definitivo")).toBeVisible();

    await page.getByRole("button", { name: "Arquivar definitivamente" }).click();
    await expect(page.getByRole("button", { name: "Arquivar" })).toHaveCount(0);

    await page.goto("/app/personagens");
    await expect(page.getByText("Para arquivar")).toHaveCount(0);

    // Slot liberado: dá para criar outro rascunho sem bater no teto de 3.
    await page.goto("/app/personagens/novo");
    await expect(page.getByRole("button", { name: "Começar meu Abraço" })).toBeVisible();
  });
});
