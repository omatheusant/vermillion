# ADR 0003 — Autosave multi-aba via soft-lock, sem merge em tempo real

## Contexto

O wizard precisa de autosave com debounce, sem perda de texto ao navegar, atualizar, perder conexão ou abrir a mesma ficha em duas abas. Um editor colaborativo real (CRDT/OT) resolveria o caso geral, mas é desproporcional para um produto de fã mantido por uma única pessoa, e o caso de uso real (mesmo jogador, duas abas, raramente ao mesmo tempo) não exige fusão de texto caractere a caractere.

## Decisão

- Cada etapa do wizard tem uma coluna `version` (inteiro, incrementado a cada PATCH bem-sucedido) na tabela relevante (`characters` e/ou tabelas filhas por etapa).
- O client guarda a `version` que recebeu no último load. Autosave faz PATCH por etapa (não por campo) com debounce de ~800ms, enviando `expected_version`.
- Uma tabela leve `character_edit_sessions (character_id, step, session_id, client_label, last_seen_at)` registra presença: cada aba manda heartbeat a cada ~15s. Se outra sessão aparece ativa (`last_seen_at` recente) na mesma etapa, a UI mostra "Esta etapa está sendo editada em outro lugar" **proativamente**, antes de qualquer conflito de save.
- Se o PATCH chega com `expected_version` diferente da versão atual no banco, o servidor **recusa** a escrita (não tenta merge automático), retorna a versão atual e o conteúdo atual, e o client pede ao usuário para recarregar antes de continuar editando. Nenhum dado é apagado silenciosamente — o texto local do usuário permanece visível na tela até ele decidir recarregar ou copiar o que escreveu.

## Consequências

- Resolve o requisito "não perder texto" sem construir infraestrutura de merge em tempo real.
- No pior caso (duas abas editando ativamente ao mesmo tempo), um dos dois usuários precisa recarregar e reaplicar manualmente uma edição recente — aceitável para o volume de uso esperado.
- `character_edit_sessions` é efêmera (TTL curto, sem necessidade de retenção/auditoria).

## Alternativas rejeitadas

- **CRDT/OT real (ex.: Yjs)**: poder de fogo desproporcional ao problema; adiciona dependência e complexidade operacional não justificadas pelo volume de usuários da crônica.
- **Last-write-wins silencioso**: rejeitado — viola diretamente "não perder texto ao... sair e voltar" se a aba antiga sobrescrever a nova sem aviso.
