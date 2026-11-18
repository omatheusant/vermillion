import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Os testes de integração compartilham a mesma crônica/projeto
    // Supabase remoto (sem banco de teste isolado) — rodar arquivos de
    // teste em paralelo causa corrida real entre eles (ex.: exclusão de
    // usuário de um arquivo colidindo com update de outro na mesma
    // linha de chronicles). Testes de domínio são rápidos o bastante
    // para não sentir o custo de rodar em série também.
    fileParallelism: false,
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
});
