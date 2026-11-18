#!/usr/bin/env node
/**
 * Seed de dados fictícios para demonstração (Fase F, item 3). Cria uma
 * conta de jogador e uma de narrador claramente rotuladas como demo
 * (usuário @demo-jogador / @demo-narrador, nome "(Demo)" em todo
 * personagem) e três personagens cobrindo rascunho, enviado para
 * avaliação e publicado — para mostrar o produto sem misturar com
 * dados reais da crônica.
 *
 * Idempotente: rodar de novo não duplica nada. `--clean` remove tudo
 * (cascade via FK ao excluir as duas contas demo).
 *
 * Uso:
 *   node scripts/seed-demo-data.mjs
 *   node scripts/seed-demo-data.mjs --clean
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

function loadEnv() {
  const envPath = fileURLToPath(new URL("../.env.local", import.meta.url));
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^"|"$/g, "");
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  console.error("Variáveis do Supabase ausentes em .env.local. Rode `vercel env pull .env.local` primeiro.");
  process.exit(1);
}

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const credentialsPath = fileURLToPath(new URL("./.demo-credentials.json", import.meta.url));
const isClean = process.argv.includes("--clean");

const DEMO_PLAYER = { email: "demo-jogador@vermillion.demo", username: "demo-jogador", displayName: "Jogador (Demo)" };
const DEMO_NARRATOR = { email: "demo-narrador@vermillion.demo", username: "demo-narrador", displayName: "Narrador (Demo)" };

function loadStoredCredentials() {
  if (!existsSync(credentialsPath)) return {};
  return JSON.parse(readFileSync(credentialsPath, "utf8"));
}

function saveStoredCredentials(creds) {
  writeFileSync(credentialsPath, JSON.stringify(creds, null, 2));
}

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`listUsers: ${error.message}`);
    const found = data.users.find((u) => u.email === email);
    if (found) return found;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function ensureUser({ email, username, displayName }, storedCreds) {
  const existing = await findUserByEmail(email);
  if (existing) {
    const password = storedCreds[email];
    if (!password) {
      throw new Error(
        `Usuário demo ${email} já existe mas a senha não está em ${credentialsPath}. ` +
          `Rode com --clean para recriar do zero, ou restaure o arquivo de credenciais.`,
      );
    }
    return { id: existing.id, email, password };
  }

  const password = `Demo-${randomUUID()}`;
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, display_name: displayName },
  });
  if (error || !data.user) throw new Error(`createUser(${email}): ${error?.message}`);

  storedCreds[email] = password;
  saveStoredCredentials(storedCreds);
  return { id: data.user.id, email, password };
}

async function signInClient(user) {
  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email: user.email, password: user.password });
  if (error) throw new Error(`signIn(${user.email}): ${error.message}`);
  return client;
}

async function promoteToStoryteller(userId, chronicleId) {
  await adminClient.from("chronicle_memberships").update({ role: "storyteller" }).eq("user_id", userId).eq("chronicle_id", chronicleId);
}

async function findExistingCharacter(ownerId, name) {
  const { data } = await adminClient.from("characters").select("id, status").eq("owner_id", ownerId).eq("name", name).maybeSingle();
  return data;
}

async function rpcStep(client, fn, args, label) {
  const { data, error } = await client.rpc(fn, args);
  if (error || !data) throw new Error(`${label ?? fn}: ${error?.message}`);
  return data;
}

/** Monta um personagem válido (atributos/perícias no orçamento exato de criação) até o status alvo. */
async function seedCharacter({ playerClient, narratorClient, chronicleId, name, lineage, clanId, sect, disciplines, targetStatus }) {
  const draft = await rpcStep(playerClient, "create_character_draft", { p_chronicle_id: chronicleId, p_name: name }, "create_character_draft");
  const characterId = draft.id;
  let version = draft.version;

  version = (await rpcStep(
    playerClient,
    "save_character_identity",
    { p_character_id: characterId, p_expected_version: version, p_name: name, p_concept: "Personagem fictício criado para demonstrar o Vermillion." },
    "save_character_identity",
  )).version;

  version = (await rpcStep(
    playerClient,
    "save_character_lineage",
    { p_character_id: characterId, p_expected_version: version, p_lineage: lineage, p_clan_id: clanId ?? null, p_sect: sect ?? null },
    "save_character_lineage",
  )).version;

  if (targetStatus === "draft_only") {
    return characterId;
  }

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
  version = (await rpcStep(
    playerClient,
    "save_character_attributes",
    { p_character_id: characterId, p_expected_version: version, p_attributes: attributes },
    "save_character_attributes",
  )).version;

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
  version = (await rpcStep(
    playerClient,
    "save_character_skills",
    { p_character_id: characterId, p_expected_version: version, p_skill_preset: "generalist", p_skills: skills, p_specializations: [] },
    "save_character_skills",
  )).version;

  version = (await rpcStep(
    playerClient,
    "save_character_disciplines",
    { p_character_id: characterId, p_expected_version: version, p_disciplines: disciplines },
    "save_character_disciplines",
  )).version;

  version = (await rpcStep(
    playerClient,
    "save_character_advantages",
    { p_character_id: characterId, p_expected_version: version, p_merits: [], p_flaws: [] },
    "save_character_advantages",
  )).version;

  const convictionClientId = randomUUID();
  version = (await rpcStep(
    playerClient,
    "save_character_humanity",
    {
      p_character_id: characterId,
      p_expected_version: version,
      p_convictions: [{ client_id: convictionClientId, label: "Nunca trair quem confia em mim", position: 0 }],
      p_touchstones: [
        {
          conviction_client_id: convictionClientId,
          name: "Um elo mortal do passado",
          bond: "amizade",
          meaning: "O último fio que ainda o prende à vida que teve.",
          status: "unaware",
          is_private: false,
        },
      ],
    },
    "save_character_humanity",
  )).version;

  await rpcStep(
    playerClient,
    "save_character_story",
    { p_character_id: characterId, p_expected_version: version, p_appearance: "Aparência típica de um personagem de demonstração — ajuste à vontade." },
    "save_character_story",
  );

  if (targetStatus === "submitted" || targetStatus === "published") {
    await rpcStep(playerClient, "submit_character_for_review", { p_character_id: characterId }, "submit_character_for_review");
  }
  if (targetStatus === "published") {
    await rpcStep(narratorClient, "approve_character", { p_character_id: characterId }, "approve_character");
    await rpcStep(playerClient, "publish_character", { p_character_id: characterId }, "publish_character");
  }

  return characterId;
}

async function clean() {
  for (const user of [DEMO_PLAYER, DEMO_NARRATOR]) {
    const existing = await findUserByEmail(user.email);
    if (!existing) continue;
    const { error } = await adminClient.auth.admin.deleteUser(existing.id);
    if (error) throw new Error(`deleteUser(${user.email}): ${error.message}`);
    console.log(`Removido: ${user.email} (cascade apagou perfil + personagens demo).`);
  }
  if (existsSync(credentialsPath)) writeFileSync(credentialsPath, "{}");
  console.log("Seed de demonstração limpo.");
}

async function seed() {
  const storedCreds = loadStoredCredentials();

  const { data: chronicle, error: chronicleError } = await adminClient.from("chronicles").select("id").eq("slug", "vermillion").single();
  if (chronicleError || !chronicle) throw new Error(`chronicle 'vermillion' não encontrada: ${chronicleError?.message}`);
  const chronicleId = chronicle.id;

  const playerUser = await ensureUser(DEMO_PLAYER, storedCreds);
  const narratorUser = await ensureUser(DEMO_NARRATOR, storedCreds);
  await promoteToStoryteller(narratorUser.id, chronicleId);

  const playerClient = await signInClient(playerUser);
  const narratorClient = await signInClient(narratorUser);

  const roster = [
    {
      name: "Seráfina Duval (Demo)",
      lineage: "clan",
      clanId: "toreador",
      sect: "camarilla",
      disciplines: [
        { discipline_id: "celerity", value: 2, source: "clan" },
        { discipline_id: "presence", value: 1, source: "clan" },
      ],
      targetStatus: "published",
    },
    {
      name: "Jonas Petrov (Demo)",
      lineage: "caitiff",
      clanId: null,
      sect: "anarch",
      disciplines: [
        { discipline_id: "fortitude", value: 2, source: "caitiff" },
        { discipline_id: "potence", value: 1, source: "caitiff" },
      ],
      targetStatus: "submitted",
    },
    {
      name: "Marla Esquiva (Demo)",
      lineage: "thin_blood",
      clanId: null,
      sect: null,
      disciplines: [],
      targetStatus: "draft_only",
    },
  ];

  for (const entry of roster) {
    const existing = await findExistingCharacter(playerUser.id, entry.name);
    if (existing) {
      console.log(`Já existe: "${entry.name}" (status atual: ${existing.status}) — pulando.`);
      continue;
    }
    await seedCharacter({ playerClient, narratorClient, chronicleId, ...entry });
    console.log(`Criado: "${entry.name}" (alvo: ${entry.targetStatus}).`);
  }

  console.log("\nSeed de demonstração concluído.");
  console.log(`Credenciais das contas demo salvas em ${credentialsPath} (não versionado).`);
  console.log('Para remover tudo depois: node scripts/seed-demo-data.mjs --clean');
}

(isClean ? clean() : seed()).catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
