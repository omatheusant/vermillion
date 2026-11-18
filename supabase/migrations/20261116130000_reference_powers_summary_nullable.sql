-- Fix: entradas requires_reference (ADR 0001) legitimamente não têm
-- resumo ainda ("não tem resumo nem efeito definidos; serve apenas
-- como placeholder de progressão") — summary não deveria ser NOT NULL.
alter table reference_powers alter column summary drop not null;
