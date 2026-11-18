# Matriz de Regras V5 — Vermillion

`ruleset_version` deste documento: `v5-vermillion-2026.1`

Este documento separa, para toda regra implementada, três coisas: (1) o que foi **verificado** contra uma página específica de `players_guide.pdf` (local, não versionado em git); (2) o que é **parâmetro de briefing** — um número ou regra fornecido pelo documento mestre do produto, consistente com a V5 padrão, mas não re-conferido contra uma página local porque o corebook não está disponível no projeto; (3) o que é **configuração editorial do Vermillion** — decisão de produto do projeto, não uma regra da V5.

Nenhuma entrada de poder, mérito ou defeito é inventada sem pelo menos uma dessas três classificações explícitas.

## 1. Fonte local disponível

| Arquivo | Descrição | Páginas consultadas nesta rodada |
|---|---|---|
| `players_guide.pdf` | Vampire: The Masquerade Players Guide (250 páginas, somente imagem — sem camada de texto, extraído via renderização) | Sumário (p. 3–5 do PDF), Clan Sheet (impressas 12–13), Vampire Traits and Types Summary Sheet (impressas 62–63), Discipline Powers → Animalism (impressa 69), Predator Types (impressa 106), New Merits and Flaws (impressa 118), Castoffs → Caitiff (impressa 125), Thin-Blood Alchemy Level 4–5 (impressas 105–106) |

Offset observado: página impressa N ≈ índice de PDF N+1 (há variação perto de divisórias de capítulo — sempre confirmar pelo rodapé da página renderizada, nunca assumir o offset cegamente).

Não há corebook V5 disponível localmente. Regras de criação de personagem (distribuição de pontos de Atributos/Perícias/Disciplinas/Vantagens, fórmulas derivadas) vêm do corebook na V5 oficial e **não puderam ser re-verificadas contra uma página local** — são tratadas como parâmetro de briefing (seção 4).

## 2. Clãs — verificado (Clan Sheet, impressas 12–13)

| Clã | Epíteto | Disciplinas | Bane | Compulsão |
|---|---|---|---|---|
| Banu Haqim | The Judges | Feitiçaria de Sangue, Celeridade, Ofuscação | Blood Addiction | Judgement |
| Brujah | The Rebels | Celeridade, Potência, Presença | Violent Temper | Rebellion |
| Gangrel | The Beasts | Animalismo, Fortitude, Metamorfose | Bestial Features | Feral Impulses |
| Hecata | The Necromancers | Auspícios, Fortitude, Oblívio | Painful Kiss | Morbidity |
| Lasombra | The Manipulators | Dominação, Oblívio, Potência | Distorted Image | Ruthlessness |
| Malkavian | The Oracles | Auspícios, Dominação, Ofuscação | Fractured Perspective | Delusion |
| Ministério | The Tempters | Ofuscação, Presença, Metamorfose | Abhors the Light | Transgression |
| Nosferatu | The Monstrosities | Animalismo, Ofuscação, Potência | Repulsiveness | Cryptophilia |
| Ravnos | The Nomads | Animalismo, Ofuscação, Presença | Doomed | Tempting Fate |
| Salubri | The Fugitives | Auspícios, Dominação, Fortitude | Hunted | Effective Empathy (impresso "Affective Empathy" no sumário — grafias divergem entre sumário e Clan Sheet; registrar ambas, decidir texto final em revisão de conteúdo) |
| Toreador | The Seducers | Auspícios, Celeridade, Presença | Aesthetic Fixation | Obsession |
| Tremere | The Witches | Auspícios, Dominação, Feitiçaria de Sangue | Deficient Blood | Perfectionism |
| Tzimisce | The Dragons | Animalismo, Dominação, Metamorfose | Grounded | Covetousness |
| Ventrue | The Aristocrats | Dominação, Fortitude, Presença | Rarefied Tastes | Arrogance |

Nomes de Bane/Compulsão mantidos em inglês na matriz de origem; a tradução PT-BR exibida ao usuário é autoral e fica em `reference_content` (não é tradução oficial licenciada).

Caitiff e Sangue-Ralo (Thin-Blood) são linhagens sem clã fixo, com disciplinas e fluxo de criação próprios — não entram nesta tabela (ver seção 6).

### 2.1 Conteúdo autoral efetivamente seedado — texto da crônica (não o da fonte local)

O texto exibido ao jogador em `reference_clans` (Códice, seletor de clã) **não** é a tradução do Clan Sheet acima — é o texto próprio da crônica Vermillion, enviado pelo narrador (Lord Nariffin) via Discord em 14/11/2026: descrição narrativa, "Forças", "Fraqueza" (bane em PT-BR autoral) e afiliações típicas de seita por clã. `source_document` de cada linha registra essa origem (`"Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)"`), distinta de `players_guide.pdf`.

Divergência de nomenclatura registrada: a crônica chama a Disciplina **Celeridade/Celerity** de **"Rapidez"** — `reference_disciplines.id = 'celerity'` mantém o slug técnico da fonte (código em inglês, CLAUDE.md), mas `name = 'Rapidez'` é o que aparece na UI. As tríades de Disciplina por clã do texto autoral foram conferidas contra a tabela da seção 2 e são idênticas — nenhuma divergência mecânica, só de nome de uma Disciplina e de texto narrativo/afiliação de seita (este último meramente informativo, nunca restritivo — ver documento mestre, seção "Seitas/afiliação política").

Caitiff e Sangue-Ralo permanecem sem linha em `reference_clans` (são `characters.lineage`, não clã) — continuam disponíveis como opção no wizard (etapa 2, Fase D) e no Códice, só que como seções próprias de texto, não como card de catálogo de clã.

## 3. Atributos, Perícias e Disciplinas — verificado (Vampire Traits and Types Summary Sheet, impressas 62–64)

### Atributos (9, confirma a estrutura do documento mestre)

Físicos: Força, Destreza, Vigor. Sociais: Carisma, Manipulação, Compostura. Mentais: Inteligência, Raciocínio (Wits), Determinação (Resolve).

### Perícias (27, confirma a estrutura do documento mestre)

- Físicas (9): Atletismo, Briga, Ofício, Condução, Armas de Fogo, Roubo, Luta Armada (Melee), Furtividade, Sobrevivência.
- Sociais (9): Trato com Animais, Etiqueta, Percepção (Insight), Intimidação, Liderança, Performance, Persuasão, Manha de Rua (Streetwise), Subterfúgio.
- Mentais (9): Acadêmicos, Prontidão (Awareness), Finanças, Investigação, Medicina, Ocultismo, Política, Ciência, Tecnologia.

Nomes em PT-BR acima são tradução de trabalho do Vermillion (projeto autoral); ajustar para os nomes oficiais em português se/quando uma fonte oficial em PT-BR for confirmada pelo narrador da crônica — registrar a fonte em `chronicle_overrides` se divergir.

### Disciplinas (confirma a lista do documento mestre) e clãs associados

Animalismo (Gangrel, Nosferatu, Ravnos, Tzimisce) · Auspícios/Auspex (Hecata, Malkavian, Toreador, Tremere, Salubri) · Feitiçaria de Sangue/Blood Sorcery (Banu Haqim, Tremere) · Celeridade (Banu Haqim, Brujah, Toreador) · Dominação/Dominate (Malkavian, Salubri, Tremere, Tzimisce, Ventrue, Lasombra) · Fortitude (Gangrel, Hecata, Salubri, Ventrue) · Ofuscação/Obfuscate (Malkavian, Nosferatu, Ravnos, Banu Haqim, Ministério) · Oblívio/Oblivion (Hecata, Lasombra) · Potência/Potence (Brujah, Lasombra, Nosferatu) · Presença/Presence (Brujah, Ministério, Ravnos, Toreador, Ventrue) · Metamorfose/Protean (Gangrel, Ministério, Tzimisce) · Alquimia de Sangue-Ralo/Thin-Blood Alchemy (exclusiva de Sangue-Ralo).

Nota: a tabela do Clan Sheet (seção 2) e esta lista por Disciplina (Summary Sheet) são consistentes entre si e com o documento mestre — nenhuma divergência encontrada.

### Backgrounds (Antecedentes) — verificado

Allies, Contacts, Fame, Haven, Herd, Influence, Loresheet, Mask, Mawla, Resources, Retainers, Status. (Nomes em inglês na fonte; tradução PT-BR fica em `reference_content`.)

## 4. Criação de personagem — parâmetro de briefing (não re-verificado localmente)

Estes valores vêm do documento mestre do produto e são tratados como a configuração-padrão da crônica Vermillion. Ficam marcados `source_reference = "briefing_v5_corebook"` em vez de uma página local, porque o corebook não está disponível no projeto para nova conferência.

- **Atributos**: distribuição inicial 1×4, 3×3, 4×2, 1×1 entre os 9 atributos.
- **Perícias** — três presets exclusivos (não somam entre si):
  - Generalista: 1×3, 8×2, 10×1.
  - Equilibrado: 3×3, 5×2, 7×1.
  - Especialista: 1×4, 3×3, 3×2, 3×1.
- **Disciplinas** (clã comum): duas Disciplinas do clã (2 pontos + 1 ponto), terceira sem pontos na criação.
- **Vantagens e Defeitos**: orçamento padrão 7 pontos de Vantagens, 2 pontos de Defeitos. Vantagens/Defeitos do Tipo de Predador não consomem esse orçamento.
- **Humanidade** inicial: 7, salvo modificadores.
- **Convicções**: 1 a 3, cada uma vinculada a 1 Pilar (Touchstone) mortal.
- **Derivados**: Saúde = Vigor + 3; Força de Vontade = Compostura + Determinação.
- **Fome**: escala 0–5; dados de Fome substituem (não somam a) dados comuns na parada.

Essas regras são implementadas em `src/domain/v5/` como funções puras e cobertas por teste unitário (ver `docs/IMPLEMENTATION_PLAN.md`, Fase D). Qualquer divergência que a narração da crônica queira aplicar entra em `chronicle_overrides`, nunca sobrescrevendo a regra base silenciosamente — resolução determinística documentada no código.

## 5. XP — parâmetro de briefing

| Compra | Custo |
|---|---|
| Atributo | novo nível × 5 |
| Perícia | novo nível × 3 |
| Nova especialização | 3 XP fixo |
| Disciplina do clã | novo nível × 5 |
| Disciplina fora do clã | novo nível × 7 |
| Disciplina (Caitiff) | novo nível × 6 |
| Potência de Sangue | novo nível × 10 |

Toda compra de XP é lançada em `xp_ledger` e sujeita a aprovação do narrador (nunca subtraída apenas no client) — ver ADR 0007.

## 6. Caitiff e Sangue-Ralo — fluxos especiais

- **Caitiff**: linhagem sem clã. Players Guide confirma (impressa 125) que Caitiff têm méritos/defeitos próprios ("Caitiff Merits" p. 126, "Caitiff Flaws" p. 127 — não lidos nesta rodada, pendente para seed). Disciplinas: conjunto próprio de regras, não herda a tríade de um clã — tratado como escolha livre dentro de um orçamento equivalente, sujeito a confirmação quando o corebook/Caitiff Merits forem lidos.
- **Sangue-Ralo (Thin-Blood)**: fluxo totalmente separado — Alquimia de Sangue-Ralo em vez de Disciplinas de clã (ver ADR 0004 para escopo do MVP). Players Guide tem capítulo próprio "Thin-Bloods" (impressa 128–132+) com organização, relação com as seitas e "Blood Destiny" — não lido em detalhe nesta rodada; útil para o Códice, não bloqueia o MVP mecânico.

## 7. Predator Types — verificado (Summary Sheet, impressa 63; detalhado a partir da impressa 106)

16 tipos confirmados, cada um com 2 Disciplinas associadas (ex.: Alleycat → Celeridade ou Potência; Sandman → Auspícios ou Ofuscação). Lista completa já extraída para seed; mecânica de bônus (Vantagem/Defeito automático, modificador de Fome) não foi lida em detalhe — **tratar como adiável para depois do MVP conforme o documento mestre** ("Tipos de Predador podem ser adiados para quem ainda não estabeleceu hábito de caça; não aplicar bônus indevidos"). No MVP, o Vermillion registra o Tipo de Predador escolhido como dado narrativo/Disciplinas sugeridas, sem aplicar automaticamente vantagens/defeitos mecânicos até esse texto ser verificado.

## 8. Méritos e Defeitos — amostra verificada (impressa 118)

Exemplos confirmados com custo em pontos (símbolo "•" = 1 ponto na fonte): Famous Face •, Ingénue •, Remarkable Feature • (Looks Merits), Vessel Recognition • (Feeding Merit), City Secrets • (Background-like merit). O texto da fonte remete ao corebook (p. 179 da V5) para a lista completa — confirma que o grosso do catálogo de Méritos/Defeitos-base está fora do material local disponível. Caitiff/Thin-Blood/Ghoul têm seções próprias nas páginas 126, 134 e 141 (citadas pela fonte, não lidas em detalhe ainda).

## 9. Pendências de leitura (não bloqueiam o MVP, registradas para não esquecer)

- ~~Caitiff Merits/Flaws (p. 126–127)~~ — lido na Fase D, seedado (seção 10).
- Thin-Blood Merits/Flaws (~p. 134) e Blood Destiny (~p. 132).
- Ghoul Advantages (~p. 141).
- ~~Oblivion Ceremonies (p. 96–97)~~ — lido na Fase D (Level 4–5), seedado.
- Blood Sorcery Rituals (p. 99) — catálogo de Feitiçaria de Sangue ainda incompleto (só Level 1–2 por nome, via fichas prontas; texto mecânico não lido).

## 10. Catálogo de poderes, Tipos de Predador e Vantagens/Defeitos — Fase D

Seedado em `supabase/migrations/20261116130001_seed_powers_predators_advantages.sql`. Duas fontes distintas dentro do `players_guide.pdf`, cada entrada com `source_page` próprio:

- **"Iconic Characters"/"Instant Vampires" (impressas 63–68)**: fichas pré-prontas que citam poderes de Nível 1 (e alguns de Nível 2) por nome, cruzando com o clã/Disciplina — confirma a existência e o nome do poder, mas não o texto mecânico completo. Essas entradas entram como `requires_reference` (ADR 0001) mesmo com nome real confirmado — a coluna `name` não é um placeholder genérico, só o `summary` fica vazio até alguém ler o capítulo integral do poder.
- **Capítulo "Discipline Powers" (impressas 69–85) e Oblivion Ceremonies (impressas 85–97)**: texto mecânico completo (custo, dados, sistema) a partir do Nível 2 de cada Disciplina (Nível 1 de Dominate e todo Oblivion são exceção, documentados desde o Nível 1). Essas entradas são `verified_from_source` com resumo autoral fiel ao texto em inglês.
- **Tipos de Predador**: os 16 confirmados na seção 7 agora têm linha em `reference_predator_types`, incluindo os 3 com bônus mecânico confirmado por ficha pronta (Alleycat, Bagger, Siren) — os outros 13 ficam só com a sugestão de Disciplina, sem bônus automático (nenhum texto mecânico lido para eles ainda).
- **Caitiff**: Méritos/Defeitos específicos (impressas 126–128) lidos e seedados com `lineage_restriction = 'caitiff'`.
- **Feitiçaria de Sangue**: nenhuma entrada `verified_from_source` ainda — só Nível 1/2 por nome (`requires_reference`), via fichas prontas. Capítulo de Rituais (p. 99) não lido nesta rodada.
