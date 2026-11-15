# ADR 0010 — Supabase Typed Database em vez de Prisma/Drizzle

## Contexto

O documento mestre pede para evitar adicionar Prisma/Drizzle "por inércia", preferindo migrations SQL rastreáveis e tipos gerados pelo Supabase, se isso reduzir complexidade.

## Decisão

- Schema vive em migrations SQL puras em `supabase/migrations/`, aplicadas via Supabase CLI.
- Tipos TypeScript são gerados com `supabase gen types typescript --local` (ou `--project-id` em CI) para `src/lib/supabase/database.types.ts`, consumidos pelo client `@supabase/ssr`.
- Nenhum ORM (Prisma/Drizzle/Kysely) é introduzido. Consultas compostas que não cabem bem no `postgrest-js` viram funções Postgres (ver ADR 0007) chamadas via `.rpc()`, com seus próprios tipos de retorno declarados manualmente em `src/lib/supabase/rpc.types.ts` quando a geração automática não cobre.
- Regras de domínio (cálculos, validações) vivem fora do banco e fora do client Supabase, em `src/domain/v5/`, como funções puras testáveis sem rede.

## Consequências

- Uma fonte de verdade para o schema (migrations SQL), sem camada de mapeamento objeto-relacional para manter sincronizada.
- Tipagem do banco depende do passo manual/CI de regenerar `database.types.ts` após cada migration — documentado no README e num script `npm run db:types`.
- Lógica de domínio V5 não depende de Supabase nem de React, podendo ser testada com Vitest puro (requisito explícito do documento mestre).

## Alternativas rejeitadas

- **Prisma**: adiciona um schema paralelo (`schema.prisma`) e um cliente gerado que duplicaria a fonte de verdade já exigida em SQL puro; migrations do Prisma competiriam com as migrations do Supabase CLI.
- **Drizzle**: mais leve que Prisma, mas ainda introduz uma DSL de schema paralela às migrations SQL sem benefício claro dado que RLS e funções `SECURITY DEFINER` (ADR 0007) já são escritas em SQL diretamente.
