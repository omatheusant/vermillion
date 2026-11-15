# Architecture Decision Records — Vermillion

Cada ADR documenta uma decisão de arquitetura ou de modelagem de domínio que não é trivialmente reversível, seguindo o formato: Contexto, Decisão, Consequências, Alternativas rejeitadas.

ADRs são numeradas sequencialmente e nunca editadas retroativamente para mudar a decisão em si — uma mudança de rumo vira uma ADR nova que supera a anterior (linkada em "Superseded by").

## Índice

| # | Título | Status |
|---|--------|--------|
| [0001](./0001-discipline-power-catalog-verification-status.md) | Catálogo de poderes de Disciplina com status de verificação | Aceita |
| [0002](./0002-three-slot-limit-concurrency.md) | Limite de 3 personagens ativos via slot_number + advisory lock | Aceita |
| [0003](./0003-autosave-soft-lock.md) | Autosave multi-aba via soft-lock, sem merge em tempo real | Aceita |
| [0004](./0004-thin-blood-alchemy-scope.md) | Alquimia de Sangue-Ralo: catálogo completo adiado para Fase 2 | Aceita |
| [0005](./0005-reference-content-governance.md) | `reference_content` via migration versionada, sem UI admin no MVP | Aceita |
| [0006](./0006-archive-terminal-transition.md) | Arquivamento como transição terminal no MVP | Aceita |
| [0007](./0007-composite-operations-via-rpc.md) | Operações compostas via função Postgres transacional (RPC) | Aceita |
| [0008](./0008-unverified-power-grant-via-council.md) | Concessão pontual de poder não verificado pela tela do Conselho | Aceita |
| [0009](./0009-auth-email-password-first.md) | Email/senha como único método de autenticação no MVP | Aceita |
| [0010](./0010-supabase-typed-database-no-orm.md) | Supabase Typed Database em vez de Prisma/Drizzle | Aceita |
