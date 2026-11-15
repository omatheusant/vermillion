# ADR 0008 — Concessão pontual de poder não verificado pela tela do Conselho

## Contexto

A ADR 0001 impede o jogador de autosselecionar poderes `requires_reference`. Mas o narrador pode legitimamente querer conceder um desses poderes a um personagem específico (ele tem o corebook, decidiu o efeito, quer registrar). Isso não deveria exigir uma ferramenta de administração de catálogo nova (ADR 0005 já adiou isso).

## Decisão

Dentro da tela de revisão de uma ficha específica no Conselho, o narrador pode anexar um poder customizado ao personagem em avaliação: nome, Disciplina, nível, página/fonte de referência e um resumo autoral curto. Essa concessão:

- É registrada como `character_powers` com `granted_by_narrator_id`, `source_reference` e vínculo a um `audit_event`.
- Só está disponível **antes da aprovação** (durante `submitted`/`changes_requested`). Depois de `approved`, qualquer poder adicional segue o fluxo normal de progressão (`xp_ledger` + aprovação, Fase E) — não a tela de revisão inicial.

## Consequências

- Reaproveita a superfície de UI já prevista (tela de revisão), sem criar uma rota de administração nova no MVP.
- Mantém rastreabilidade: toda entrada mecânica fora do catálogo verificado tem um responsável (`narrador`) e uma referência, nunca é anônima.

## Alternativas rejeitadas

- **Narrador edita o catálogo global (`reference_content`) para desbloquear o poder para todos**: rejeitado pela ADR 0005 — mistura "dado de catálogo" com "decisão de mesa para este personagem".
