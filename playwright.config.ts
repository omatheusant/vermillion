import { defineConfig, devices } from "@playwright/test";

/**
 * E2E das jornadas críticas (Fase F). Usa o servidor de produção
 * (`next build && next start`) em vez de `next dev` — o `dev` roda sob
 * React Strict Mode, que já mostrou invocar closures duplicadas em
 * Server Actions numa sessão anterior (ver docs/IMPLEMENTATION_PLAN.md,
 * nota da Fase D); produção reflete o que o usuário real usa.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Evita falso-positivo de contraste no axe durante a transição de
    // entrada (PageTransition/motion) e exercita o caminho
    // prefers-reduced-motion (docs/DESIGN_SYSTEM.md §5) em toda a suíte.
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
