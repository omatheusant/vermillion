# Matriz de Regras V5 — Vermillion

`ruleset_version` deste documento: `v5-vermillion-2026.1`

Este documento separa, para toda regra implementada, três coisas: (1) o que foi **verificado** contra uma página específica de `players_guide.pdf` ou (desde 19/11/2026) `V5_Corebook_Extended.pdf` — ambos locais, nenhum versionado em git; (2) o que é **parâmetro de briefing** — um número ou regra fornecido pelo documento mestre do produto, consistente com a V5 padrão, mas ainda não re-conferido contra uma página local; (3) o que é **configuração editorial do Vermillion** — decisão de produto do projeto, não uma regra da V5.

Nenhuma entrada de poder, mérito ou defeito é inventada sem pelo menos uma dessas três classificações explícitas.

## 1. Fonte local disponível

| Arquivo | Descrição | Páginas consultadas nesta rodada |
|---|---|---|
| `players_guide.pdf` | Vampire: The Masquerade Players Guide (250 páginas, somente imagem — sem camada de texto, extraído via renderização) | Sumário (p. 3–5 do PDF), Clan Sheet (impressas 12–13), Vampire Traits and Types Summary Sheet (impressas 62–63), Discipline Powers → Animalism (impressa 69), Predator Types (impressa 106), New Merits and Flaws (impressa 118), Castoffs → Caitiff (impressa 125), Thin-Blood Alchemy Level 4–5 (impressas 105–106) |
| `V5_Corebook_Extended.pdf` | Corebook V5 (430 páginas, com camada de texto pesquisável — `pymupdf`, sem necessidade de renderizar imagem). Cobre só os 7 clãs "core" (Brujah, Gangrel, Malkavian, Nosferatu, Toreador, Tremere, Ventrue) + Caitiff + Sangue-Ralo; os outros 7 clãs já cadastrados continuam sem capítulo próprio nesta fonte | Character Creation Summary (impressas 136–137), Core Traits — Atributos/Perícias/Força de Vontade (impressas 155–159), Beliefs — Convicções/Pilares/Ambição-Desejo (impressas 172–174), Advantages — Méritos/Antecedentes (impressas 179–194, incl. Thin-Blood Merits/Flaws 182–185) |

Offset observado em `players_guide.pdf`: página impressa N ≈ índice de PDF N+1 (há variação perto de divisórias de capítulo — sempre confirmar pelo rodapé da página renderizada, nunca assumir o offset cegamente). Em `V5_Corebook_Extended.pdf` o mesmo offset (índice de PDF = página impressa + 1) se confirmou estável em todo o material lido até agora.

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

**Atualização 19/11/2026**: a definição de cada um dos 9 Atributos e das 27 Perícias (o que cada um mede, não só o nome) agora tem resumo autoral próprio com citação de página de `V5_Corebook_Extended.pdf` (impressas 155–159 para Atributos/Força de Vontade, 159–171 para Perícias) — vive em `src/lib/v5-copy.ts` (`ATTRIBUTE_COPY`/`SKILL_COPY`/`WILLPOWER_COPY`) e alimenta os tooltips "?" do wizard (etapas 3 e 4), não `reference_content` (é copy de UI, não catálogo editável pelo narrador — ADR 0005).

### Disciplinas (confirma a lista do documento mestre) e clãs associados

Animalismo (Gangrel, Nosferatu, Ravnos, Tzimisce) · Auspícios/Auspex (Hecata, Malkavian, Toreador, Tremere, Salubri) · Feitiçaria de Sangue/Blood Sorcery (Banu Haqim, Tremere) · Celeridade (Banu Haqim, Brujah, Toreador) · Dominação/Dominate (Malkavian, Salubri, Tremere, Tzimisce, Ventrue, Lasombra) · Fortitude (Gangrel, Hecata, Salubri, Ventrue) · Ofuscação/Obfuscate (Malkavian, Nosferatu, Ravnos, Banu Haqim, Ministério) · Oblívio/Oblivion (Hecata, Lasombra) · Potência/Potence (Brujah, Lasombra, Nosferatu) · Presença/Presence (Brujah, Ministério, Ravnos, Toreador, Ventrue) · Metamorfose/Protean (Gangrel, Ministério, Tzimisce) · Alquimia de Sangue-Ralo/Thin-Blood Alchemy (exclusiva de Sangue-Ralo).

Nota: a tabela do Clan Sheet (seção 2) e esta lista por Disciplina (Summary Sheet) são consistentes entre si e com o documento mestre — nenhuma divergência encontrada.

### Backgrounds (Antecedentes) — verificado

Allies, Contacts, Fame, Haven, Herd, Influence, Loresheet, Mask, Mawla, Resources, Retainers, Status. (Nomes em inglês na fonte; tradução PT-BR fica em `reference_content`.)

## 4. Criação de personagem — verificado (`V5_Corebook_Extended.pdf`, "Character Creation Summary", impressas 136–137)

**Atualização 19/11/2026**: estes valores eram tratados como parâmetro de briefing (não re-verificados) porque nenhum corebook estava disponível localmente. O resumo de criação de personagem do corebook (impressas 136–137) confirma, sem divergência, todos os números já implementados em `src/domain/v5/`:

- **Atributos**: distribuição inicial 1×4, 3×3, 4×2, 1×1 entre os 9 atributos.
- **Perícias** — três presets exclusivos (não somam entre si; a fonte os chama de "jack of all trades", "balanced", "specialist" — traduzidos no Vermillion como Generalista/Equilibrado/Especialista):
  - Generalista: 1×3, 8×2, 10×1.
  - Equilibrado: 3×3, 5×2, 7×1.
  - Especialista: 1×4, 3×3, 3×2, 3×1.
- **Disciplinas** (clã comum): duas Disciplinas do clã (2 pontos + 1 ponto), terceira sem pontos na criação. Caitiff: duas Disciplinas livres, mesma distribuição. Sangue-Ralo: sem Disciplina de clã (ver seção 6).
- **Vantagens e Defeitos**: orçamento padrão 7 pontos de Vantagens, 2 pontos de Defeitos. Vantagens/Defeitos do Tipo de Predador não consomem esse orçamento. Sangue-Ralo: 1 a 3 Méritos de Sangue-Ralo + igual número de Defeitos de Sangue-Ralo, fora desse orçamento (ver seção 8.1).
- **Humanidade** inicial: 7, salvo modificadores.
- **Convicções**: 1 a 3, cada uma vinculada a 1 Pilar (Touchstone) mortal — definição de cada termo agora também verificada (impressas 172–174, ver `src/lib/v5-copy.ts`).
- **Derivados**: Saúde = Vigor + 3; Força de Vontade = Compostura + Determinação (confirmado também em "Core Traits", impressa 157).
- **Fome**: escala 0–5; dados de Fome substituem (não somam a) dados comuns na parada. (Não estava no resumo de criação lido nesta rodada — continua parâmetro de briefing.)

Essas regras são implementadas em `src/domain/v5/` como funções puras e cobertas por teste unitário (ver `docs/IMPLEMENTATION_PLAN.md`, Fase D). Qualquer divergência que a narração da crônica queira aplicar entra em `chronicle_overrides`, nunca sobrescrevendo a regra base silenciosamente — resolução determinística documentada no código.

## 5. XP — verificado (`V5_Corebook_Extended.pdf`, "Trait Costs: Experience", impressa 137)

**Atualização 19/11/2026**: a tabela abaixo (já implementada em `src/domain/v5/calculate-xp-cost.ts`) é confirmada sem divergência pela fonte; as duas últimas linhas existem na fonte mas não têm implementação própria ainda (Feitiçaria de Sangue/Alquimia de Sangue-Ralo não compram rituais/fórmulas por XP no MVP) — ficam registradas aqui para quando essa frente for aberta, não bloqueiam nada hoje.

| Compra | Custo |
|---|---|
| Atributo | novo nível × 5 |
| Perícia | novo nível × 3 |
| Nova especialização | 3 XP fixo |
| Disciplina do clã | novo nível × 5 |
| Disciplina fora do clã | novo nível × 7 |
| Disciplina (Caitiff) | novo nível × 6 |
| Potência de Sangue | novo nível × 10 |
| Vantagem | 3 XP por ponto (não implementado — compra de Vantagem pós-criação fica para fase futura) |
| Ritual de Feitiçaria de Sangue | nível do ritual × 3 (não implementado) |
| Fórmula de Sangue-Ralo | nível da fórmula × 3 (não implementado) |

Toda compra de XP é lançada em `xp_ledger` e sujeita a aprovação do narrador (nunca subtraída apenas no client) — ver ADR 0007.

## 6. Caitiff e Sangue-Ralo — fluxos especiais

- **Caitiff**: linhagem sem clã. Players Guide confirma (impressa 125) que Caitiff têm méritos/defeitos próprios ("Caitiff Merits" p. 126, "Caitiff Flaws" p. 127 — não lidos nesta rodada, pendente para seed). Disciplinas: conjunto próprio de regras, não herda a tríade de um clã — tratado como escolha livre dentro de um orçamento equivalente, sujeito a confirmação quando o corebook/Caitiff Merits forem lidos.
- **Sangue-Ralo (Thin-Blood)**: fluxo totalmente separado — Alquimia de Sangue-Ralo em vez de Disciplinas de clã (ver ADR 0004 para escopo do MVP). Players Guide tem capítulo próprio "Thin-Bloods" (impressa 128–132+) com organização, relação com as seitas e "Blood Destiny" — não lido em detalhe nesta rodada; útil para o Códice, não bloqueia o MVP mecânico.

## 7. Predator Types — verificado (Summary Sheet, impressa 63; detalhado a partir da impressa 106)

16 tipos confirmados, cada um com 2 Disciplinas associadas (ex.: Alleycat → Celeridade ou Potência; Sandman → Auspícios ou Ofuscação). Lista completa já extraída para seed; mecânica de bônus (Vantagem/Defeito automático, modificador de Fome) não foi lida em detalhe — **tratar como adiável para depois do MVP conforme o documento mestre** ("Tipos de Predador podem ser adiados para quem ainda não estabeleceu hábito de caça; não aplicar bônus indevidos"). No MVP, o Vermillion registra o Tipo de Predador escolhido como dado narrativo/Disciplinas sugeridas, sem aplicar automaticamente vantagens/defeitos mecânicos até esse texto ser verificado.

## 8. Méritos, Defeitos e Antecedentes — verificado (`V5_Corebook_Extended.pdf`, capítulo "Advantages", impressas 179–194)

**Atualização 19/11/2026**: `players_guide.pdf` só tinha uma amostra (impressa 118: Famous Face •, Ingénue •, Remarkable Feature •, Vessel Recognition •, City Secrets •) e remetia ao corebook para a lista completa. Essa lista completa agora está disponível — catálogo geral de Méritos/Defeitos (Linguagem, Visual, Uso de Substâncias, Arcaico, Vínculo de Sangue, Alimentação, Amaldiçoado) e de Antecedentes (Aliados, Contatos, Fama, Influência, Refúgio + sub-méritos, Rebanho, Identidade Falsa, Mawla, Recursos, Lacaios, Status) seedado em `supabase/migrations/20261119100001_seed_core_advantages.sql`, cada linha com `source_page` próprio. As 12 entradas específicas de Caitiff seedadas na Fase D (`20261116130001`, impressas 126–128 do `players_guide.pdf`) continuam valendo — são de uma linhagem que o corebook core não cobre em detalhe.

### 8.1 Méritos e Defeitos de Sangue-Ralo — verificado (impressas 182–185)

Sem custo em pontos na fonte (`dots_min=dots_max=0` no catálogo): cada Defeito de Sangue-Ralo "paga" um Mérito de Sangue-Ralo, e vice-versa — não consomem o orçamento de 7/2 pontos da criação comum (seção 4). `validateAdvantages` (domínio) foi ajustada para aceitar 0 pontos nesse caso.

## 9. Pendências de leitura (não bloqueiam o MVP, registradas para não esquecer)

- ~~Caitiff Merits/Flaws (p. 126–127)~~ — lido na Fase D, seedado (seção 10).
- ~~Thin-Blood Merits/Flaws~~ — lido em `V5_Corebook_Extended.pdf` (impressas 182–185) e seedado (seção 8.1).
- Blood Destiny (~p. 132 do `players_guide.pdf`) — ainda não lido.
- Ghoul Advantages (~p. 141 do `players_guide.pdf`) — ainda não lido.
- ~~Oblivion Ceremonies (p. 96–97)~~ — lido na Fase D (Level 4–5), seedado.
- Blood Sorcery Rituals (p. 99) — catálogo de Feitiçaria de Sangue ainda incompleto (só Level 1–2 por nome, via fichas prontas; texto mecânico não lido).

## 10. Catálogo de poderes, Tipos de Predador e Vantagens/Defeitos — Fase D

Seedado em `supabase/migrations/20261116130001_seed_powers_predators_advantages.sql`. Duas fontes distintas dentro do `players_guide.pdf`, cada entrada com `source_page` próprio:

- **"Iconic Characters"/"Instant Vampires" (impressas 63–68)**: fichas pré-prontas que citam poderes de Nível 1 (e alguns de Nível 2) por nome, cruzando com o clã/Disciplina — confirma a existência e o nome do poder, mas não o texto mecânico completo. Essas entradas entram como `requires_reference` (ADR 0001) mesmo com nome real confirmado — a coluna `name` não é um placeholder genérico, só o `summary` fica vazio até alguém ler o capítulo integral do poder.
- **Capítulo "Discipline Powers" (impressas 69–85) e Oblivion Ceremonies (impressas 85–97)**: texto mecânico completo (custo, dados, sistema) a partir do Nível 2 de cada Disciplina (Nível 1 de Dominate e todo Oblivion são exceção, documentados desde o Nível 1). Essas entradas são `verified_from_source` com resumo autoral fiel ao texto em inglês.
- **Tipos de Predador**: os 16 confirmados na seção 7 agora têm linha em `reference_predator_types`, incluindo os 3 com bônus mecânico confirmado por ficha pronta (Alleycat, Bagger, Siren) — os outros 13 ficam só com a sugestão de Disciplina, sem bônus automático (nenhum texto mecânico lido para eles ainda).
- **Caitiff**: Méritos/Defeitos específicos (impressas 126–128) lidos e seedados com `lineage_restriction = 'caitiff'`.
- **Feitiçaria de Sangue**: nenhuma entrada `verified_from_source` ainda — só Nível 1/2 por nome (`requires_reference`), via fichas prontas. Capítulo de Rituais (p. 99) não lido nesta rodada.
