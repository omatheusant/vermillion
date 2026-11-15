# ADR 0006 — Arquivamento como transição terminal no MVP

## Contexto

Os critérios de aceite do MVP não mencionam "desarquivar" um personagem. Permitir desarquivamento abriria perguntas não triviais: o slot liberado pode já ter sido ocupado por outro personagem; um personagem publicado e depois arquivado e desarquivado deveria voltar a `published` direto ou exigir nova aprovação?

## Decisão

No MVP, a transição para `archived` é terminal: não existe caminho de volta para `draft` ou qualquer outro estado. Se o jogador quiser "recuperar" um personagem arquivado, ele cria um rascunho novo e copia manualmente as informações relevantes (sujeito ao limite de 3 slots da ADR 0002). Arquivar sempre libera o `slot_number` do personagem (seta para `NULL`).

## Consequências

- Simplifica a máquina de estados e a UI de "Meu Grimório" — o botão "Arquivar" tem uma confirmação clara de que é definitivo.
- Evita ambiguidade sobre reaprovação/republicação de algo desarquivado.
- Revisitar como funcionalidade explícita na Fase 2, com sua própria máquina de estados e trilha de auditoria, se os narradores pedirem.

## Alternativas rejeitadas

- **Permitir desarquivar direto para o status anterior**: rejeitado por ora — multiplica casos de borda (slot ocupado, personagem publicado desatualizado) sem um critério de aceite que exija isso.
