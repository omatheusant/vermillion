#!/usr/bin/env node
/**
 * Regenera src/lib/supabase/database.types.ts a partir do schema remoto
 * (ADR 0010 — tipos gerados pelo Supabase CLI, nunca escritos à mão).
 * Lê POSTGRES_URL_NON_POOLING de .env.local em vez de exigir login
 * interativo do Supabase CLI (indisponível em ambiente não-TTY).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const envLocal = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const match = envLocal.match(/^POSTGRES_URL_NON_POOLING=(.*)$/m);

if (!match) {
  console.error("POSTGRES_URL_NON_POOLING não encontrada em .env.local. Rode `vercel env pull .env.local` primeiro.");
  process.exit(1);
}

const dbUrl = match[1].trim().replace(/^"|"$/g, "");
const outPath = fileURLToPath(new URL("../src/lib/supabase/database.types.ts", import.meta.url));

const result = execSync(
  `npx -y supabase@latest gen types typescript --db-url "${dbUrl}" --schema public`,
  { stdio: ["ignore", "pipe", "inherit"] },
);

writeFileSync(outPath, result);
execSync(`npx -y oxfmt "${outPath}"`, { stdio: "inherit" });

console.log("database.types.ts atualizado.");
