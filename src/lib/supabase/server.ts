import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Client Supabase para Server Components/Actions/Route Handlers. Grava
 * cookies de sessão no servidor (@supabase/ssr) — nunca usar a
 * service-role key aqui; ela não entra no bundle nem neste client.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component chamando setAll durante render — ignorado
            // porque o middleware já cuida de refrescar a sessão.
          }
        },
      },
    },
  );
}
