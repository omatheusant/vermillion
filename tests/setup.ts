import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * Vitest não lê .env.local automaticamente (isso é um comportamento do
 * Next.js) — carregamos manualmente para os testes de integração
 * (RLS, concorrência de slots) que precisam das credenciais do projeto
 * Supabase provisionado via Vercel Marketplace.
 */
const envPath = path.resolve(__dirname, "../.env.local");

if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^"|"$/g, "");
  }
}
