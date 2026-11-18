import { headers } from "next/headers";

/**
 * URL absoluta do site para links de email (confirmação de cadastro,
 * recuperação de senha). Prioriza o host da requisição atual — funciona
 * em preview deployments da Vercel sem configuração extra.
 */
export async function getSiteUrl(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
