# ADR 0001 — Catálogo de poderes de Disciplina com status de verificação

## Contexto

O único material de regras disponível localmente é `players_guide.pdf` (Vampire: The Masquerade Players Guide). Seu capítulo "Discipline Powers" (p. 69 em diante) documenta **apenas poderes novos**, a partir do nível 2 de cada Disciplina — os poderes de nível 1 do manual básico (corebook V5) não estão reproduzidos nesse arquivo. Não há corebook disponível no projeto.

O documento mestre do produto proíbe explicitamente inventar nomes, efeitos ou regras de poderes sem fonte verificável, mas também proíbe travar o MVP por falta de dados.

## Decisão

O catálogo de poderes (`reference_content`, tabela `character_powers` / seed de poderes) carrega um campo `verification_status` com dois valores:

- `verified_from_source`: nome, nível, clã(s), pré-requisitos e resumo autoral foram conferidos contra uma página específica de uma fonte local (`source_document` + `source_page`).
- `requires_reference`: a entrada existe no sistema (porque é mecanicamente necessária — ex.: "poder de nível 1 da Disciplina X, ainda não documentado") mas não tem resumo nem efeito definidos; serve apenas como placeholder de progressão.

O wizard de criação (etapa 5) só permite que o **jogador** selecione poderes `verified_from_source`. Poderes `requires_reference` aparecem desabilitados com rótulo "requer referência do narrador" e só entram na ficha por ação de um narrador (ver ADR 0008).

## Consequências

- O catálogo inicial do MVP será deliberadamente incompleto para vários clãs (faltam poderes de nível 1 para quase todas as Disciplinas). Isso é visível e documentado na UI, não escondido.
- Quando o corebook ou outra fonte autorizada for disponibilizada ao projeto, a migration de seed é atualizada e entradas mudam de status — nenhum dado existente precisa ser restruturado, só o campo de status e os campos de resumo/página.
- Evita o risco legal e de qualidade de reproduzir ou fabricar regras da V5 sem lastro.

## Alternativas rejeitadas

- **Reproduzir de memória os poderes de nível 1 do corebook**: rejeitado — viola a exigência explícita de não inventar regras não verificáveis localmente.
- **Bloquear a etapa 5 inteira até ter o corebook**: rejeitado — trava o MVP indefinidamente por uma dependência externa.
