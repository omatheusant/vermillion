import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import type { Database } from "@/lib/supabase/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Variáveis do Supabase ausentes em .env.local — rode `vercel env pull .env.local` antes de testar.",
  );
}

/**
 * Client com a service-role key — só usado em testes (nunca no
 * app/bundle client), para preparar fixtures (ex.: promover um usuário
 * a storyteller) que o RLS bloquearia de outra forma.
 */
export const adminClient: SupabaseClient<Database> = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export function anonClient(): SupabaseClient<Database> {
  return createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface TestUser {
  id: string;
  email: string;
  client: SupabaseClient<Database>;
}

/** Cria um usuário real (via Admin API) e devolve um client autenticado como ele. */
export async function createTestUser(label: string): Promise<TestUser> {
  const email = `${label}-${randomUUID()}@vermillion.test`;
  const password = `Test-${randomUUID()}`;

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    throw new Error(`Falha ao criar usuário de teste: ${createError?.message}`);
  }

  const client = anonClient();
  const { error: signInError } = await client.auth.signInWithPassword({ email, password });
  if (signInError) {
    throw new Error(`Falha ao autenticar usuário de teste: ${signInError.message}`);
  }

  return { id: created.user.id, email, client };
}

export async function promoteToStoryteller(userId: string, chronicleId: string) {
  const { error } = await adminClient
    .from("chronicle_memberships")
    .update({ role: "storyteller" })
    .eq("user_id", userId)
    .eq("chronicle_id", chronicleId);

  if (error) {
    throw new Error(`Falha ao promover usuário a storyteller: ${error.message}`);
  }
}

export async function getDefaultChronicleId(): Promise<string> {
  const { data, error } = await adminClient.from("chronicles").select("id").eq("slug", "vermillion").single();
  if (error || !data) {
    throw new Error("Crônica padrão 'vermillion' não encontrada — rode as migrations primeiro.");
  }
  return data.id;
}

/** Cascata via auth.users on delete cascade cobre profiles/memberships/characters/etc. */
export async function deleteTestUser(userId: string) {
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) {
    console.error(`Falha ao limpar usuário de teste ${userId}: ${error.message}`);
  }
}
