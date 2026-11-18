/**
 * AUTH_DISCORD_ENABLED — ADR 0009. Login social Discord só aparece na UI
 * quando esta flag está ligada E as credenciais do provedor estão
 * configuradas no painel do Supabase. Nenhuma lógica de produto assume
 * a existência de login social por padrão (desligada).
 */
export const AUTH_DISCORD_ENABLED = process.env.AUTH_DISCORD_ENABLED === "true";
