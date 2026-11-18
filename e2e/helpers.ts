import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";
import type { Database } from "../src/lib/supabase/database.types";

function loadEnv() {
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
}

loadEnv();

const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export interface E2eUser {
  id: string;
  email: string;
  password: string;
  username: string;
}

export async function createE2eUser(label: string): Promise<E2eUser> {
  const email = `${label}-${randomUUID()}@vermillion.test`;
  const password = `Test-${randomUUID()}`;
  const username = `${label}-${randomUUID().slice(0, 8)}`;

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (error || !data.user) throw new Error(`Falha ao criar usuário e2e: ${error?.message}`);

  return { id: data.user.id, email, password, username };
}

export async function promoteToStoryteller(userId: string) {
  const { data: chronicle } = await adminClient.from("chronicles").select("id").eq("slug", "vermillion").single();
  await adminClient.from("chronicle_memberships").update({ role: "storyteller" }).eq("user_id", userId).eq("chronicle_id", chronicle!.id);
}

export async function deleteE2eUser(userId: string) {
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) console.error(`Falha ao limpar usuário e2e ${userId}: ${error.message}`);
}

export async function loginAs(page: Page, user: E2eUser) {
  await page.goto("/entrar");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Senha").fill(user.password);
  await page.getByRole("button", { name: "Entrar na noite" }).click();
  await page.waitForURL(/\/app/);
}

export function anonSupabase(): SupabaseClient<Database> {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function signInClient(user: E2eUser): Promise<SupabaseClient<Database>> {
  const client = anonSupabase();
  await client.auth.signInWithPassword({ email: user.email, password: user.password });
  return client;
}

export async function getDefaultChronicleId(client: SupabaseClient<Database>): Promise<string> {
  const { data } = await client.from("chronicles").select("id").eq("slug", "vermillion").single();
  return data!.id;
}

/**
 * Cria um personagem Caitiff válido direto via RPC (sem passar pela UI
 * do wizard — essa jornada já é coberta por critical-journeys.spec.ts)
 * e o leva até publicado, para auditorias (a11y, mobile) que precisam
 * de uma Ficha Viva e de entradas reais na galeria pública.
 */
export async function seedPublishedCharacter(
  playerClient: SupabaseClient<Database>,
  narratorClient: SupabaseClient<Database>,
  chronicleId: string,
  name: string,
): Promise<{ characterId: string; slug: string }> {
  const { data: draft, error: draftError } = await playerClient.rpc("create_character_draft", {
    p_chronicle_id: chronicleId,
    p_name: name,
  });
  if (draftError || !draft) throw new Error(`create_character_draft: ${draftError?.message}`);
  const characterId = draft.id;
  let version = draft.version;

  async function step<T extends { version: number } | null>(
    label: string,
    result: { data: T; error: { message: string } | null },
  ): Promise<T> {
    if (result.error || !result.data) throw new Error(`${label}: ${result.error?.message}`);
    version = result.data.version;
    return result.data;
  }

  await step(
    "save_character_identity",
    await playerClient.rpc("save_character_identity", {
      p_character_id: characterId,
      p_expected_version: version,
      p_name: name,
      p_concept: "Curador obcecado por relíquias esquecidas pela noite",
    }),
  );

  await step(
    "save_character_lineage",
    await playerClient.rpc("save_character_lineage", {
      p_character_id: characterId,
      p_expected_version: version,
      p_lineage: "caitiff",
    }),
  );

  const attributes = [
    { attribute_id: "strength", value: 2 },
    { attribute_id: "dexterity", value: 3 },
    { attribute_id: "stamina", value: 2 },
    { attribute_id: "charisma", value: 4 },
    { attribute_id: "manipulation", value: 2 },
    { attribute_id: "composure", value: 3 },
    { attribute_id: "intelligence", value: 3 },
    { attribute_id: "wits", value: 2 },
    { attribute_id: "resolve", value: 1 },
  ];
  await step(
    "save_character_attributes",
    await playerClient.rpc("save_character_attributes", {
      p_character_id: characterId,
      p_expected_version: version,
      p_attributes: attributes,
    }),
  );

  const skills = [
    { skill_id: "persuasion", value: 3 },
    { skill_id: "insight", value: 2 },
    { skill_id: "etiquette", value: 2 },
    { skill_id: "academics", value: 2 },
    { skill_id: "investigation", value: 2 },
    { skill_id: "stealth", value: 2 },
    { skill_id: "subterfuge", value: 2 },
    { skill_id: "awareness", value: 2 },
    { skill_id: "athletics", value: 2 },
    { skill_id: "brawl", value: 1 },
    { skill_id: "drive", value: 1 },
    { skill_id: "firearms", value: 1 },
    { skill_id: "larceny", value: 1 },
    { skill_id: "melee", value: 1 },
    { skill_id: "survival", value: 1 },
    { skill_id: "craft", value: 1 },
    { skill_id: "animal_ken", value: 1 },
    { skill_id: "intimidation", value: 1 },
    { skill_id: "leadership", value: 1 },
  ];
  await step(
    "save_character_skills",
    await playerClient.rpc("save_character_skills", {
      p_character_id: characterId,
      p_expected_version: version,
      p_skill_preset: "generalist",
      p_skills: skills,
      p_specializations: [],
    }),
  );

  await step(
    "save_character_disciplines",
    await playerClient.rpc("save_character_disciplines", {
      p_character_id: characterId,
      p_expected_version: version,
      p_disciplines: [
        { discipline_id: "celerity", value: 2, source: "caitiff" },
        { discipline_id: "potence", value: 1, source: "caitiff" },
      ],
    }),
  );

  await step(
    "save_character_advantages",
    await playerClient.rpc("save_character_advantages", {
      p_character_id: characterId,
      p_expected_version: version,
      p_merits: [],
      p_flaws: [],
    }),
  );

  const convictionClientId = randomUUID();
  await step(
    "save_character_humanity",
    await playerClient.rpc("save_character_humanity", {
      p_character_id: characterId,
      p_expected_version: version,
      p_convictions: [{ client_id: convictionClientId, label: "Nunca trair quem confia em mim", position: 0 }],
      p_touchstones: [
        {
          conviction_client_id: convictionClientId,
          name: "Seu antigo mentor mortal",
          bond: "amizade",
          meaning: "O último elo com a vida que teve antes do Abraço.",
          status: "unaware",
          is_private: false,
        },
      ],
    }),
  );

  await step(
    "save_character_story",
    await playerClient.rpc("save_character_story", {
      p_character_id: characterId,
      p_expected_version: version,
      p_appearance: "Figura esguia, sempre em trajes de outra década.",
    }),
  );

  const { data: submitted, error: submitError } = await playerClient.rpc("submit_character_for_review", {
    p_character_id: characterId,
  });
  if (submitError || !submitted) throw new Error(`submit_character_for_review: ${submitError?.message}`);

  const { data: approved, error: approveError } = await narratorClient.rpc("approve_character", {
    p_character_id: characterId,
  });
  if (approveError || !approved) throw new Error(`approve_character: ${approveError?.message}`);

  const { data: published, error: publishError } = await playerClient.rpc("publish_character", {
    p_character_id: characterId,
  });
  if (publishError || !published || !published.slug) throw new Error(`publish_character: ${publishError?.message}`);

  return { characterId, slug: published.slug };
}

export { adminClient };
