# Vermillion

Arquivo digital de criaturas da noite — plataforma de criação, progressão e publicação de personagens para uma crônica de **Vampiro: A Máscara, 5ª edição**. Projeto de fã, gratuito, não afiliado à Paradox Interactive.

Planejamento completo em [`docs/`](./docs); estado atual em [`docs/IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md). Especificação de produto: [`VERMILLION_PROMPT_CLAUDE_CODE.md`](./VERMILLION_PROMPT_CLAUDE_CODE.md).

## Estado atual (Fase B)

Protótipo visual sem banco de dados: landing, dashboard, Meu Grimório e a Etapa 1 do wizard O Abraço, todos com dados de demonstração (sem persistência real ainda — chega na Fase C).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

```bash
npm run build       # build de produção
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

## Stack

Next.js (App Router, TypeScript strict) · Tailwind CSS v4 · shadcn/ui sobre Radix · Lucide · Motion · Zod · React Hook Form · Zustand. Decisões registradas em [`docs/adr/`](./docs/adr).

## Material de regras

`players_guide.pdf` (não versionado — ver `.gitignore`) deve ficar na raiz do projeto para consulta durante o desenvolvimento. Nunca é servido pela aplicação nem incluído no bundle.
