import { test, expect, type Page } from "@playwright/test";
import { createE2eUser, promoteToStoryteller, deleteE2eUser, loginAs, type E2eUser } from "./helpers";

/**
 * Jornada crítica completa (Fase F, item 1): criar → preencher as
 * etapas mecânicas → submeter → aprovar (narrador) → publicar (dono) →
 * aparecer na galeria pública para um visitante anônimo.
 */
async function fillDots(page: Page, label: string, times: number) {
  const slider = page.getByRole("slider", { name: label, exact: true });
  await slider.focus();
  for (let i = 0; i < times; i++) {
    await slider.press("ArrowRight");
  }
}

async function startEmbrace(page: Page) {
  await page.goto("/app/personagens/novo");
  await page.getByRole("button", { name: "Começar meu Abraço" }).click();
  await page.waitForURL(/\/editar\/1$/);
}

async function completeIdentity(page: Page, name: string, concept: string) {
  await page.getByLabel("Nome completo").fill(name);
  await page.getByLabel("Conceito", { exact: false }).fill(concept);
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.waitForURL(/\/editar\/2$/);
}

async function completeLineage(page: Page, clanName: string) {
  await page.locator("button", { hasText: clanName }).first().click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.waitForURL(/\/editar\/3$/);
}

async function completeAttributes(page: Page) {
  // 1x4, 3x3, 4x2, 1x1 — todos partem de 1, então somamos os deltas.
  await fillDots(page, "Vigor", 3); // 1 -> 4
  await fillDots(page, "Destreza", 2); // 1 -> 3
  await fillDots(page, "Carisma", 2); // 1 -> 3
  await fillDots(page, "Compostura", 2); // 1 -> 3
  await fillDots(page, "Força", 1); // 1 -> 2
  await fillDots(page, "Manipulação", 1); // 1 -> 2
  await fillDots(page, "Inteligência", 1); // 1 -> 2
  await fillDots(page, "Raciocínio", 1); // 1 -> 2
  // Determinação fica em 1.
  await expect(page.getByText("Distribuição válida.")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.waitForURL(/\/editar\/4$/);
}

async function completeSkills(page: Page) {
  // Preset Generalista (padrão) — 1x3, 8x2, 10x1, todos partem de 0.
  await fillDots(page, "Atletismo", 3);
  for (const skill of ["Briga", "Ofício", "Condução", "Armas de Fogo", "Roubo", "Luta Armada", "Furtividade", "Sobrevivência"]) {
    await fillDots(page, skill, 2);
  }
  for (const skill of [
    "Trato com Animais",
    "Etiqueta",
    "Percepção",
    "Intimidação",
    "Liderança",
    "Performance",
    "Persuasão",
    "Manha de Rua",
    "Subterfúgio",
    "Acadêmicos",
  ]) {
    await fillDots(page, skill, 1);
  }
  await page.getByRole("button", { name: "Adicionar especialização" }).click();
  await page.locator('input[placeholder="Ex.: Combate corpo a corpo"]').fill("Arte vampírica");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.waitForURL(/\/editar\/5$/);
}

async function completeDisciplines(page: Page, disciplineLabels: [string, string]) {
  await fillDots(page, disciplineLabels[0], 2);
  await fillDots(page, disciplineLabels[1], 1);
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.waitForURL(/\/editar\/6$/);
}

async function completeAdvantages(page: Page) {
  // Sem Vantagens/Defeitos (0/0) fica dentro do orçamento — válido.
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.waitForURL(/\/editar\/7$/);
}

async function completeHumanity(page: Page) {
  await page.getByRole("button", { name: "Adicionar Convicção" }).click();
  await page.getByLabel("Convicção 1").fill("Nunca machucar inocentes");
  await page.getByLabel("Pilar (nome)").fill("Sua irmã mortal");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.waitForURL(/\/editar\/8$/);
}

async function completeStory(page: Page) {
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.waitForURL(/\/editar\/9$/);
}

test.describe("Jornadas críticas", () => {
  let player: E2eUser;
  let narrator: E2eUser;
  let slug: string | null = null;

  test.beforeAll(async () => {
    player = await createE2eUser("e2e-player");
    narrator = await createE2eUser("e2e-narrator");
    await promoteToStoryteller(narrator.id);
  });

  test.afterAll(async () => {
    await Promise.all([deleteE2eUser(player.id), deleteE2eUser(narrator.id)]);
  });

  test("criar → submeter → aprovar → publicar → visível na galeria", async ({ page, browser }) => {
    await loginAs(page, player);
    await startEmbrace(page);
    await completeIdentity(page, "Lucrécia Valmont", "Curadora de galeria obcecada pela beleza que não envelhece");
    await completeLineage(page, "Toreador");
    await completeAttributes(page);
    await completeSkills(page);
    await completeDisciplines(page, ["Rapidez", "Presença"]);
    await completeAdvantages(page);
    await completeHumanity(page);
    await completeStory(page);

    await expect(page.getByText("Tudo pronto. Nenhuma pendência encontrada.")).toBeVisible();
    await page.getByRole("button", { name: "Enviar para aprovação" }).click();
    await page.waitForURL(/\/app\/personagens$/);
    await expect(page.getByText("Lucrécia Valmont")).toBeVisible();

    // Narrador aprova numa sessão separada.
    const narratorContext = await browser.newContext();
    const narratorPage = await narratorContext.newPage();
    await loginAs(narratorPage, narrator);
    await narratorPage.goto("/app/conselho");
    await narratorPage.getByText("Lucrécia Valmont").click();
    await narratorPage.getByRole("button", { name: "Aprovar" }).click();
    await expect(narratorPage.getByRole("list").getByText("Aprovado")).toBeVisible();
    await narratorContext.close();

    // Dono publica.
    await page.goto("/app/personagens");
    await page.getByText("Lucrécia Valmont").click();
    await page.getByRole("button", { name: "Publicar" }).click();
    await expect(page.getByText(/Público em/)).toBeVisible();

    const slugText = await page.locator("text=/personagens\\//").textContent();
    slug = slugText?.split("/personagens/")[1]?.trim() ?? null;
    expect(slug).toBeTruthy();

    // Visitante anônimo enxerga na galeria pública.
    const visitorContext = await browser.newContext();
    const visitorPage = await visitorContext.newPage();
    await visitorPage.goto("/personagens");
    await expect(visitorPage.getByText("Lucrécia Valmont")).toBeVisible();
    await visitorPage.getByText("Lucrécia Valmont").click();
    await expect(visitorPage.getByText("Curadora de galeria obcecada")).toBeVisible();
    await visitorContext.close();
  });
});
