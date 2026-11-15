# ADR 0005 — `reference_content` via migration versionada, sem UI admin no MVP

## Contexto

O Códice (`/codice`) e o wizard precisam de um catálogo de clãs, disciplinas, poderes, perícias, atributos, antecedentes e méritos/defeitos resumidos e referenciados por página. Esse catálogo pode ser editado por humanos (migrations SQL) ou por uma tela de administração dedicada.

## Decisão

No MVP, `reference_content` é populado **somente** por seeds SQL versionados em `supabase/migrations/`, revisados como qualquer outra mudança de schema. Não existe tela de administração para editar/promover conteúdo de referência pela UI. O Conselho (`/app/conselho`), na Fase E, fica restrito a: fila de aprovação de fichas, comentários de revisão, aprovar/devolver, e ajuste de configuração da crônica (clãs/seitas permitidos, tipo de predador habilitado, ponto inicial — exceto "máximo de slots", ver ADR 0002).

## Consequências

- Qualquer correção ou adição ao catálogo (ex.: um poder que muda de `requires_reference` para `verified_from_source`) é uma migration nova, versionada e revisável — reduz risco de erro de regra introduzido por um formulário apressado.
- O Códice sempre reflete exatamente o que está nas migrations aplicadas, sem deriva entre ambientes.
- Uma UI de administração de catálogo fica registrada como item de Fase 2/pós-MVP, não removida da visão de produto.

## Alternativas rejeitadas

- **CRUD de catálogo no Conselho desde o MVP**: rejeitado — tela de administração de regras é superfície de risco (erro de digitação vira regra errada em produção) desproporcional ao ritmo do MVP.
