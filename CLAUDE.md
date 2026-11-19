# CLAUDE.md — Vermillion

Especificação completa: `VERMILLION_PROMPT_CLAUDE_CODE.md`. Planejamento: `docs/` (`PRODUCT_BRIEF`, `UX_FLOW`, `V5_RULES_MATRIX`, `DATA_MODEL`, `IMPLEMENTATION_PLAN`, `LEGAL`, `GLOSSARY`, `adr/`).

## Regras inegociáveis

- **Não inventar regras de V5.** Toda regra/poder/mérito tem `source_document` + `source_page`, ou status `requires_reference` (ADR 0001). Fontes locais disponíveis (raiz do projeto, **nenhuma versionada em git**): `players_guide.pdf` e, desde 19/11/2026, `V5_Corebook_Extended.pdf` (corebook V5 com camada de texto pesquisável — cobre só os 7 clãs "core" + Caitiff + Sangue-Ralo; os outros 7 clãs cadastrados continuam sem corebook próprio).
- **Idioma**: UI e rótulos em PT-BR. Código (funções, variáveis, schemas, arquivos) em inglês.
- **Sem Prisma/Drizzle** (ADR 0010): migrations SQL + tipos gerados pelo Supabase CLI.
- **Sem contagem de slots só no client** (ADR 0002): a trava de 3 personagens ativos por usuário+crônica vive no banco (`slot_number` + índice parcial + advisory lock).
- **Toda operação multi-tabela é uma função Postgres** (ADR 0007), nunca várias chamadas sequenciais do client.
- **Nunca confiar em `role` vindo do client/`user_metadata`**: papel de narrador/admin só via `chronicle_memberships` (RLS).
- **Nunca** expor Pilares, notas privadas ou qualquer `character_details` privado em payload público, OpenGraph, busca ou Storage aberto.
- **Zero monetização**: sem pagamento, anúncio, paywall.
- Direção visual: gótico contemporâneo de luxo (ver seção "Direção estética obrigatória" do documento mestre) — nunca um painel SaaS genérico.

## Comandos (a partir da Fase B)

```
npm run dev
npm run build
npm run typecheck
npm run lint
npm run test        # Vitest (domínio) + Testing Library (componentes)
npm run test:e2e    # Playwright
npm run db:types    # regenera database.types.ts após migration
```

## Antes de declarar algo "pronto"

Rodar build + typecheck + lint + testes relevantes e relatar o resultado. Fechamento de fase segue o formato descrito no final de `docs/IMPLEMENTATION_PLAN.md`.
