-- Fix: colunas que registram "quem fez a ação" (reviewer_id, created_by,
-- actor_id, invited_by, granted_by_narrator_id) referenciavam
-- profiles(id) sem ON DELETE SET NULL. Isso bloqueava permanentemente a
-- exclusão de qualquer conta que já tivesse revisado/aprovado/arquivado
-- qualquer personagem — mesmo o de outro jogador — com
-- "Database error deleting user" (FK violation), descoberto pelos
-- testes de integração (cleanup de usuários de teste falhando).
--
-- A trilha de auditoria em si (docs/DATA_MODEL.md §3) é preservada —
-- só o vínculo com o ator deletado vira null, nunca a linha de
-- xp_ledger/review_events/character_revisions/audit_events inteira.

alter table chronicle_memberships drop constraint chronicle_memberships_invited_by_fkey;
alter table chronicle_memberships
  add constraint chronicle_memberships_invited_by_fkey
  foreign key (invited_by) references profiles(id) on delete set null;

alter table xp_ledger alter column created_by drop not null;
alter table xp_ledger drop constraint xp_ledger_created_by_fkey;
alter table xp_ledger
  add constraint xp_ledger_created_by_fkey
  foreign key (created_by) references profiles(id) on delete set null;

alter table xp_ledger drop constraint xp_ledger_approved_by_fkey;
alter table xp_ledger
  add constraint xp_ledger_approved_by_fkey
  foreign key (approved_by) references profiles(id) on delete set null;

alter table character_revisions alter column created_by drop not null;
alter table character_revisions drop constraint character_revisions_created_by_fkey;
alter table character_revisions
  add constraint character_revisions_created_by_fkey
  foreign key (created_by) references profiles(id) on delete set null;

alter table review_events alter column reviewer_id drop not null;
alter table review_events drop constraint review_events_reviewer_id_fkey;
alter table review_events
  add constraint review_events_reviewer_id_fkey
  foreign key (reviewer_id) references profiles(id) on delete set null;

alter table audit_events alter column actor_id drop not null;
alter table audit_events drop constraint audit_events_actor_id_fkey;
alter table audit_events
  add constraint audit_events_actor_id_fkey
  foreign key (actor_id) references profiles(id) on delete set null;

alter table character_powers drop constraint character_powers_granted_by_narrator_id_fkey;
alter table character_powers
  add constraint character_powers_granted_by_narrator_id_fkey
  foreign key (granted_by_narrator_id) references profiles(id) on delete set null;
