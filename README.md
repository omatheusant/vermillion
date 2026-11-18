# Vermillion

Arquivo digital de criaturas da noite — plataforma de criação, progressão e publicação de personagens para uma crônica de **Vampiro: A Máscara, 5ª edição**. Projeto de fã, gratuito, não afiliado à Paradox Interactive.

Planejamento completo em [`docs/`](./docs); estado atual em [`docs/IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md). Especificação de produto: [`VERMILLION_PROMPT_CLAUDE_CODE.md`](./VERMILLION_PROMPT_CLAUDE_CODE.md).

## Estado atual (Fase F)

MVP funcional: autenticação, wizard de criação completo (9 etapas), fluxo de revisão do Conselho, Ficha Viva, galeria pública e perfis de jogador, tudo com persistência real no Supabase (RLS + RPCs `SECURITY DEFINER`). Cobertura de testes: domínio (Vitest), jornadas críticas e acessibilidade (Playwright + axe-core). Detalhes e pendências de cada fase em [`docs/IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md).

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com os valores do seu projeto Supabase
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Se o projeto Supabase foi provisionado via Vercel Marketplace, prefira `vercel env pull .env.local` a preencher `.env.local` à mão — ele já traz as chaves corretas do projeto linkado.

## Scripts

```bash
npm run build              # build de produção
npm run start               # serve o build de produção
npm run typecheck           # tsc --noEmit
npm run lint                 # eslint
npm run test                 # Vitest — domínio (src/domain/v5) e componentes
npm run test:e2e             # Playwright — jornadas críticas, acessibilidade, mobile
npm run db:types             # regenera src/lib/supabase/database.types.ts a partir do schema remoto
npm run db:seed:demo         # cria contas e personagens de demonstração (claramente rotulados "(Demo)")
npm run db:seed:demo:clean   # remove tudo o que o seed de demonstração criou
```

Antes de declarar qualquer trabalho "pronto", rode build + typecheck + lint + os testes relevantes (ver `CLAUDE.md`).

### Testes E2E (Playwright)

`npm run test:e2e` builda a aplicação (`next build && next start`) e roda contra ela — não contra `next dev` — porque o modo de desenvolvimento usa React Strict Mode, que já mostrou comportamento divergente com Server Actions em sessões anteriores (ver nota da Fase D em `docs/IMPLEMENTATION_PLAN.md`). Os testes rodam contra o **projeto Supabase remoto de verdade** (sem banco de teste isolado): criam usuários efêmeros via Admin API e os removem ao final (`e2e/helpers.ts`). Por isso:

- Precisam de `SUPABASE_SERVICE_ROLE_KEY` e `POSTGRES_URL_NON_POOLING` em `.env.local` (nunca só as chaves públicas).
- Rodam com `fullyParallel: false` / `workers: 1` — testes em paralelo colidiriam no mesmo projeto remoto.
- Incluem uma auditoria de acessibilidade (WCAG 2.1 AA via `@axe-core/playwright`) nas telas públicas, do jogador e do Conselho, e checagens de layout mobile (viewport Pixel 7, sem overflow horizontal). Toda a suíte roda com `prefers-reduced-motion: reduce` emulado, para resultados determinísticos e para exercitar esse caminho de verdade.

## Deploy

### Supabase (banco, auth, storage)

1. Crie o projeto no Supabase (direto ou via Vercel Marketplace — `vercel integration add supabase`).
2. Aplique as migrations (`supabase/migrations/`, SQL puro — sem Prisma/Drizzle, ADR 0010):
   ```bash
   npx supabase@latest db push --db-url "$POSTGRES_URL_NON_POOLING" --include-all --yes
   ```
3. Regenere os tipos TypeScript a partir do schema aplicado:
   ```bash
   npm run db:types
   ```
4. Opcional: popule dados de demonstração (`npm run db:seed:demo`) antes de mostrar o produto a alguém.

Toda operação multi-tabela é uma função Postgres `SECURITY DEFINER` (ADR 0007) — nunca várias chamadas sequenciais do client. O papel de narrador/admin nunca vem de `role`/`user_metadata` do client, só de `chronicle_memberships` (RLS).

### Vercel (aplicação)

1. `vercel link` (ou importe o repositório pelo dashboard).
2. Garanta que as variáveis de `.env.example` estejam configuradas no projeto Vercel — se o Supabase foi provisionado pelo Marketplace, isso já acontece automaticamente.
3. `vercel --prod` (ou deploy automático via Git).

Zero monetização: sem pagamento, anúncio ou paywall em nenhum ambiente.

## Material de regras

`players_guide.pdf` (não versionado — ver `.gitignore`) deve ficar na raiz do projeto para consulta durante o desenvolvimento. Nunca é servido pela aplicação nem incluído no bundle. Toda regra/poder/mérito usado no código tem `source_document` + `source_page`, ou status `requires_reference` (ADR 0001) — nunca é inventado.

## Stack

Next.js 16 (App Router, Turbopack, TypeScript strict) · Supabase (Postgres, Auth, Storage, RLS) · Tailwind CSS v4 · shadcn/ui sobre Radix · Lucide · Motion · Zod · React Hook Form · Zustand · Vitest + Testing Library · Playwright + axe-core. Decisões registradas em [`docs/adr/`](./docs/adr).
