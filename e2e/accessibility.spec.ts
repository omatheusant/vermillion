import { test, expect, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  createE2eUser,
  deleteE2eUser,
  promoteToStoryteller,
  loginAs,
  signInClient,
  getDefaultChronicleId,
  seedPublishedCharacter,
  type E2eUser,
} from "./helpers";

/**
 * Auditoria WCAG 2.1 AA (Fase F, item 2) via axe-core nas telas
 * centrais do produto — públicas, do jogador e do Conselho. Falhas
 * "incomplete" do axe não quebram o teste (frequentemente falsos
 * positivos de contraste em gradientes); só "violations" reais.
 */
async function assertNoViolations(page: Page, testInfo: TestInfo) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await testInfo.attach("axe-results", { body: JSON.stringify(results.violations, null, 2), contentType: "application/json" });
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test.describe("Acessibilidade (WCAG 2.1 AA)", () => {
  let player: E2eUser;
  let narrator: E2eUser;
  let slug: string;
  let publishedCharacterId: string;
  let draftCharacterId: string;

  test.beforeAll(async () => {
    player = await createE2eUser("e2e-a11y-player");
    narrator = await createE2eUser("e2e-a11y-narrator");
    await promoteToStoryteller(narrator.id);

    const playerClient = await signInClient(player);
    const narratorClient = await signInClient(narrator);
    const chronicleId = await getDefaultChronicleId(playerClient);

    const seeded = await seedPublishedCharacter(playerClient, narratorClient, chronicleId, "Orfeu das Sombras");
    publishedCharacterId = seeded.characterId;
    slug = seeded.slug;

    const { data: draft, error } = await playerClient.rpc("create_character_draft", {
      p_chronicle_id: chronicleId,
      p_name: "Rascunho para auditoria",
    });
    if (error || !draft) throw new Error(`create_character_draft: ${error?.message}`);
    draftCharacterId = draft.id;
  });

  test.afterAll(async () => {
    await Promise.all([deleteE2eUser(player.id), deleteE2eUser(narrator.id)]);
  });

  test("landing", async ({ page }, testInfo) => {
    await page.goto("/");
    await assertNoViolations(page, testInfo);
  });

  test("entrar", async ({ page }, testInfo) => {
    await page.goto("/entrar");
    await assertNoViolations(page, testInfo);
  });

  test("cadastro", async ({ page }, testInfo) => {
    await page.goto("/cadastro");
    await assertNoViolations(page, testInfo);
  });

  test("recuperar-senha", async ({ page }, testInfo) => {
    await page.goto("/recuperar-senha");
    await assertNoViolations(page, testInfo);
  });

  test("codice", async ({ page }, testInfo) => {
    await page.goto("/codice");
    await assertNoViolations(page, testInfo);
  });

  test("galeria pública", async ({ page }, testInfo) => {
    await page.goto("/personagens");
    await expect(page.getByText("Orfeu das Sombras")).toBeVisible();
    await assertNoViolations(page, testInfo);
  });

  test("ficha viva pública", async ({ page }, testInfo) => {
    await page.goto(`/personagens/${slug}`);
    await assertNoViolations(page, testInfo);
  });

  test("perfil público do jogador", async ({ page }, testInfo) => {
    await page.goto(`/u/${player.username}`);
    await assertNoViolations(page, testInfo);
  });

  test("lista de personagens (jogador)", async ({ page }, testInfo) => {
    await loginAs(page, player);
    await page.goto("/app/personagens");
    await assertNoViolations(page, testInfo);
  });

  test("etapa 1 do wizard (Identidade)", async ({ page }, testInfo) => {
    await loginAs(page, player);
    await page.goto(`/app/personagens/${draftCharacterId}/editar/1`);
    await assertNoViolations(page, testInfo);
  });

  test("ficha viva do dono (publicada)", async ({ page }, testInfo) => {
    await loginAs(page, player);
    await page.goto(`/app/personagens/${publishedCharacterId}`);
    await assertNoViolations(page, testInfo);
  });

  test("fila do conselho (narrador)", async ({ page }, testInfo) => {
    await loginAs(page, narrator);
    await page.goto("/app/conselho");
    await assertNoViolations(page, testInfo);
  });

  test("revisão de personagem (narrador)", async ({ page }, testInfo) => {
    await loginAs(page, narrator);
    await page.goto(`/app/conselho/${publishedCharacterId}`);
    await assertNoViolations(page, testInfo);
  });
});
