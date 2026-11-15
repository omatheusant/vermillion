# ADR 0007 — Operações compostas via função Postgres transacional (RPC)

## Contexto

Várias ações do produto tocam mais de uma tabela em um único passo lógico: aprovar uma ficha (muda `characters.status`, insere `review_events`, congela um snapshot em `character_revisions`); publicar; arquivar (libera slot); lançar XP (insere `xp_ledger`, atualiza o atributo/perícia/disciplina correspondente, e eventualmente `character_revisions`). Se isso for feito como múltiplas chamadas sequenciais do client/Server Action contra o Supabase, uma falha de rede ou de validação no meio deixa o banco em estado parcialmente aplicado — por exemplo, status trocado para `approved` sem o `review_event` correspondente.

## Decisão

Toda operação que escreve em mais de uma tabela como parte de uma única ação de produto é implementada como **uma função Postgres** (`CREATE FUNCTION ... SECURITY DEFINER SET search_path = public, pg_temp`), chamada via `supabase.rpc(...)`, nunca como chamadas sequenciais separadas do client. A função faz toda a validação de autorização internamente (reconfirma `auth.uid()` e papel via `chronicle_memberships`) antes de escrever, mesmo que RLS já devesse bloquear o caminho errado — defesa em profundidade.

Candidatas iniciais: `approve_character`, `request_character_changes`, `publish_character`, `archive_character`, `submit_character_for_review`, `apply_xp_purchase`.

## Consequências

- `SECURITY DEFINER` exige `search_path` fixo explícito para evitar sequestro de função por schema — checklist de segurança obrigatório em toda função nova.
- Toda ação composta vira uma unidade atômica testável isoladamente (Vitest contra um Postgres de teste, ou pgTAP).
- Reduz a superfície de "lógica de negócio" espalhada em Server Actions para um conjunto auditável de funções de banco.

## Alternativas rejeitadas

- **Transação orquestrada no Server Action com múltiplas chamadas ao client Supabase**: o client Supabase (`postgrest-js`) não expõe transações multi-statement; múltiplas chamadas HTTP não são atômicas entre si.
