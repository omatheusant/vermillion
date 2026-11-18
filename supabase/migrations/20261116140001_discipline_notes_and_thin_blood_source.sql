-- Suporte ao fluxo de Sangue-Ralo (ADR 0004): nível de Alquimia de
-- Sangue-Ralo é guardado como uma linha normal de character_disciplines
-- (discipline_id='thin_blood_alchemy'), mas com source próprio em vez
-- de forçar 'clan'. `notes` guarda a nota narrativa livre exigida pela
-- ADR ("aprendeu a primeira fórmula com um mentor") — campo genérico,
-- reaproveitável por qualquer Disciplina no futuro.

alter type character_discipline_source add value 'thin_blood';

alter table character_disciplines add column notes text;
