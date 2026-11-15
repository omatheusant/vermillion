# ADR 0002 — Limite de 3 personagens ativos via `slot_number` + advisory lock

## Contexto

O documento mestre exige, em dois pontos diferentes, regras aparentemente conflitantes: (a) "cada usuário pode possuir no máximo 3 personagens não arquivados... garanta atomicamente, mesmo sob requisições simultâneas"; (b) a configuração da crônica no Conselho lista "máximo de slots" como ajustável pelo narrador. Contar personagens no backend antes de inserir não é atômico sob concorrência (duas requisições simultâneas podem passar na contagem antes de qualquer uma inserir).

## Decisão

1. **O teto é fixo em 3, não configurável por crônica.** Resolve a contradição a favor da regra de produto mais explícita e mais citada (critério de aceite #12). O item "máximo de slots" sai da lista de ajustes do Conselho.
2. `characters` ganha uma coluna `slot_number SMALLINT CHECK (slot_number BETWEEN 1 AND 3)`, nula quando `status = 'archived'`.
3. Constraint `UNIQUE (owner_id, chronicle_id, slot_number) WHERE status <> 'archived'` garante que nunca existam dois personagens ativos da mesma dupla usuário+crônica com o mesmo slot.
4. Um trigger `BEFORE INSERT` (e `BEFORE UPDATE OF status` quando status sai de `archived`) chama `pg_advisory_xact_lock(hashtextextended(owner_id::text || ':' || chronicle_id::text, 0))` — lock de **transação** (não de sessão), compatível com o pooler do Supabase em modo transação (Supavisor/PgBouncer) — antes de procurar o primeiro slot livre entre 1 e 3. Se não houver slot livre, a transação levanta uma exceção de negócio (`P0001` com mensagem padronizada), que o backend traduz para erro amigável.

## Consequências

- A checagem de "slots restantes" no frontend (dashboard, botão "Novo personagem") é só UX — a garantia real está no banco.
- Lock de transação é liberado automaticamt ao fim do `INSERT`/transação, sem risco de lock pendurado mesmo com conexões recicladas pelo pooler.
- Arquivar um personagem libera o slot (ADR 0006 trata isso como via de mão única no MVP).

## Alternativas rejeitadas

- **Contar linhas no app antes do insert**: rejeitado — corrida clássica (`SELECT COUNT` + `INSERT` em transações separadas).
- **`SERIALIZABLE` isolation sem advisory lock**: funciona, mas exige retry logic genérica no app para `serialization_failure`, mais complexo que a trava explícita.
- **Trigger que faz `COUNT(*)` com `FOR UPDATE` na própria tabela `characters`**: funciona mas exige lock de range mais pesado e é mais sensível a index bloat; o advisory lock por `(owner_id, chronicle_id)` é mais barato e direto.
