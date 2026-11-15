# ADR 0004 — Alquimia de Sangue-Ralo: catálogo completo adiado para Fase 2

## Contexto

Sangue-Ralo (Thin-Blood) usa Alquimia de Sangue-Ralo em vez de Disciplinas de clã — um sistema de fórmulas com ingredientes, custo de Rouse Check, pool de teste e duração própria por fórmula (confirmado em `players_guide.pdf`, p. 98–105, "Thin-Blood Alchemy" / "Level 4/5 Formulae"). O catálogo completo é extenso (múltiplos níveis, ingredientes, sistemas de jogo próprios) e só está parcialmente coberto no material local (faltam os níveis 1–3 completos na leitura already feita).

## Decisão

No MVP, a etapa 5 do wizard para personagens Sangue-Ralo registra apenas:
- Nível de Alquimia de Sangue-Ralo (dentro do orçamento da crônica).
- Uma nota narrativa livre (ex.: "aprendeu a primeira fórmula com um mentor").

Fórmulas específicas (nome, ingredientes, sistema) **não** são selecionáveis no wizard no MVP. Elas são concedidas depois da aprovação, manualmente, pelo narrador via lançamento no `xp_ledger` com `source_reference` apontando a página do material usado — seguindo o mesmo fluxo de progressão pós-aprovação de qualquer outra mudança mecânica.

## Consequências

- Sangue-Ralo é jogável no MVP, mas sem a riqueza mecânica completa de Alquimia — isso é visível na Ficha Viva como "Alquimia nível N — fórmulas registradas pelo narrador".
- Fase 2 (fora do MVP) implementa o catálogo completo de fórmulas como uma extensão do catálogo de `reference_content`, reaproveitando o campo `verification_status` da ADR 0001.
- Evita atrasar toda a Fase D por causa de um subsistema que afeta só uma linhagem.

## Alternativas rejeitadas

- **Implementar o catálogo parcial encontrado (níveis 4–5) e deixar os demais como "requer referência"**: rejeitado por ora — misturar fórmulas selecionáveis com fórmulas placeholder no mesmo wizard aumenta a complexidade de UI sem valor proporcional no MVP; revisitar em Fase 2 se o catálogo completo for obtido.
