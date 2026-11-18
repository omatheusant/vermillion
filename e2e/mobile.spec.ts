import { test, expect, type Page } from "@playwright/test";
import { createE2eUser, deleteE2eUser, loginAs, signInClient, getDefaultChronicleId, type E2eUser } from "./helpers";

/**
 * Checagens mobile (Fase F, item 2): sem overflow horizontal nas
 * telas centrais, e a troca de aba Formulário/Prévia do wizard (ver o
 * bug de ids duplicados corrigido em wizard-shell.tsx) realmente
 * alterna qual painel fica visível — não só no desktop.
 */
async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("Mobile (Pixel 7)", () => {
  let player: E2eUser;
  let draftCharacterId: string;

  test.beforeAll(async () => {
    player = await createE2eUser("e2e-mobile-player");
    const client = await signInClient(player);
    const chronicleId = await getDefaultChronicleId(client);
    const { data, error } = await client.rpc("create_character_draft", {
      p_chronicle_id: chronicleId,
      p_name: "Rascunho mobile",
    });
    if (error || !data) throw new Error(`create_character_draft: ${error?.message}`);
    draftCharacterId = data.id;
  });

  test.afterAll(async () => {
    await deleteE2eUser(player.id);
  });

  test("landing sem overflow horizontal", async ({ page }) => {
    await page.goto("/");
    await expectNoHorizontalOverflow(page);
  });

  test("galeria pública sem overflow horizontal", async ({ page }) => {
    await page.goto("/personagens");
    await expectNoHorizontalOverflow(page);
  });

  test("wizard: aba Prévia alterna o painel visível sem duplicar o formulário", async ({ page }) => {
    await loginAs(page, player);
    await page.goto(`/app/personagens/${draftCharacterId}/editar/1`);
    await expectNoHorizontalOverflow(page);

    const nameInput = page.getByLabel("Nome completo");
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveCount(1);

    await page.getByRole("tab", { name: "Prévia do dossiê" }).click();
    await expect(nameInput).toBeHidden();
    await expect(page.getByRole("heading", { name: "Rascunho mobile" })).toBeVisible();

    await page.getByRole("tab", { name: "Formulário" }).click();
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Rascunho mobile editado");
    await expect(nameInput).toHaveValue("Rascunho mobile editado");
  });
});
