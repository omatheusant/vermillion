# Glossário — Vermillion

Termos de domínio usados em código (inglês, `snake_case`/`camelCase`) e na UI (PT-BR). Mantém os dois lados explícitos para evitar ambiguidade entre "nome de campo" e "rótulo visto pelo jogador".

| Termo PT-BR (UI) | Termo em código | Definição |
|---|---|---|
| Crônica | `chronicle` | Instância de jogo ligada a um servidor Discord; contém membros, configuração e personagens. |
| Narrador | `storyteller` (role em `chronicle_memberships`) | Papel com poder de revisão/aprovação dentro de uma crônica. |
| O Abraço | wizard de criação (`creation_step`) | Fluxo de 10 etapas (0–9) que produz um personagem submetível. |
| Rascunho | `status = 'draft'` | Personagem ainda não submetido. |
| Meu Grimório | rota `/app/personagens` | Listagem dos até 3 personagens ativos do jogador. |
| Ficha Viva | rota `/app/personagens/[id]` | Visão pós-criação, com tabs e progressão. |
| O Conselho | rota `/app/conselho` | Painel de narrador/admin. |
| Os Condenados | rota `/personagens` | Galeria pública. |
| O Códice | rota `/codice` | Compêndio autoral de regras resumidas. |
| Linhagem | `lineage` (`clan` \| `caitiff` \| `thin_blood`) | Categoria de origem vampírica de um personagem — substitui "clã" quando não há clã fixo. |
| Fome | `hunger` (`character_tracks.hunger`, 0–5) | Recurso que substitui dados comuns na parada ao ser gasto (regra de dados é Fase 2 — ver `docs/V5_RULES_MATRIX.md` §4). |
| Potência de Sangue | `blood_potency` | Atributo vampírico derivado da geração/preset da crônica. |
| Pilar | `touchstone` | Vínculo mortal associado a uma Convicção; pode ser privado. |
| Convicção | `conviction` | Princípio pessoal do personagem (1 a 3), base da Humanidade. |
| Tenets/Princípios da crônica | config global (`chronicles.settings`) | Regras morais coletivas definidas pelo narrador — nunca editadas pelo jogador. |
| Poder verificado | `verification_status = 'verified_from_source'` | Poder de Disciplina com resumo e página conferidos localmente (ADR 0001). |
| Poder pendente de referência | `verification_status = 'requires_reference'` | Poder mecanicamente necessário mas sem fonte local conferida; só entra via concessão de narrador (ADR 0008). |
| Snapshot de criação | `character_revisions` (`reason = 'creation_approved'`) | Congelamento dos dados mecânicos no momento da aprovação. |
| Slot ativo | `slot_number` (1–3) | Posição que um personagem não-arquivado ocupa no limite de 3 por crônica (ADR 0002). |
| Link não listado | `public_share_token` | Identificador longo/imprevisível para compartilhar um personagem sem publicá-lo na galeria. |

Ver também `docs/V5_RULES_MATRIX.md` para termos de regra da V5 (clãs, Disciplinas, Bane, Compulsão) e suas fontes.
