# Plano de Implementação — Vermillion

Fases conforme `VERMILLION_PROMPT_CLAUDE_CODE.md`. Cada fase só é declarada concluída após build, typecheck, lint e testes relevantes passarem, com arquivos criados e evidências listadas no relatório de fechamento da fase. Nenhuma fase é "meio pronta e declarada completa".

## Fase A — Descoberta/documentação (concluída nesta rodada)

- [x] Leitura de `VERMILLION_PROMPT_CLAUDE_CODE.md`.
- [x] Extração verificada de `players_guide.pdf` (clãs, atributos, perícias, disciplinas, predator types, amostra de méritos, Caitiff) — `docs/V5_RULES_MATRIX.md`.
- [x] Verificação de skills instaladas (`frontend-design`, `web-design-guidelines`, `vercel:react-best-practices`; `grill-with-docs` não existe — usado `mattpocock-skills:grilling` como equivalente, registrado aqui para transparência).
- [x] Sessão de grilling de arquitetura → 10 ADRs em `docs/adr/`.
- [x] `docs/PRODUCT_BRIEF.md`, `docs/UX_FLOW.md`, `docs/V5_RULES_MATRIX.md`, `docs/DATA_MODEL.md`, `docs/GLOSSARY.md`, `docs/LEGAL.md`, este plano, `CLAUDE.md` (raiz).
- [x] `git init` + `.gitignore` (exclui `players_guide.pdf` e artefatos de build).

## Fase B — Design system e protótipo funcional sem banco

Entregas:
1. Scaffold Next.js (App Router, TS strict) + Tailwind + shadcn/ui + Radix + Lucide + Motion.
2. `docs/DESIGN_SYSTEM.md`: tokens de cor (ajustados para AA), tipografia (Cormorant Garamond/Manrope/Cinzel), espaçamento, animação.
3. Componentes base sem dados reais: `VermillionWordmark`, `GothicShell`, `VelvetCard`, `WaxSeal`, `LoreDivider`, `PageTransition`, `StatusBadge`, `LoreTooltip` — com props tipadas prontas para dados reais (sem mock permanente embutido no componente).
4. Landing `/` completa (hero, manifesto, CTA, rodapé legal com aviso Dark Pack).
5. Dashboard `/app` e Meu Grimório `/app/personagens` com **fixtures explicitamente marcadas como demo** (não com dados reais do banco).
6. Início do wizard (etapa 0 e 1) e layout de 3 colunas com preview viva, ainda sem persistência.
7. Screenshots desktop/tablet/mobile via Playwright (ou relato explícito da limitação se o ambiente não permitir) + revisão de contraste AA.

Critério de fechamento: `npm run build`, `npm run typecheck`, `npm run lint` passam; screenshots anexados; nenhuma dependência nova fora das listadas no documento mestre sem justificativa registrada.

## Fase C — Auth, migrations, RLS e persistência

Pré-requisito externo: projeto Supabase criado pelo usuário (URL + anon key; service role key nunca no browser) — solicitar antes de iniciar esta fase.

1. Migrations SQL (`supabase/migrations/`) para as tabelas de `docs/DATA_MODEL.md` §1–4, incluindo `uq_active_slot`, trigger de `slot_number` (ADR 0002), funções `is_chronicle_staff`, RPCs de ADR 0007.
2. RLS completo por tabela, testado nos 4 cenários (jogador A, jogador B, narrador, visitante).
3. `@supabase/ssr` com cookies de servidor, páginas de auth (`/entrar`, `/cadastro`, `/recuperar-senha`), feature flag `AUTH_DISCORD_ENABLED` (ADR 0009, desligada por padrão).
4. Criação de rascunho real, respeitando os 3 slots sob concorrência (teste de corrida automatizado: N inserts paralelos, só 3 sucedem).
5. Upload de avatar/retrato com bucket privado, MIME real validado, nomes aleatórios.

Critério de fechamento: suíte de testes de RLS e de concorrência de slots passando; nenhuma chamada service-role no bundle client (checagem de build).

## Fase D — Criador V5 completo

1. `src/domain/v5/`: `validateAttributes`, `validateSkills`, `validateDisciplines`, `validateAdvantages`, `calculateHealth`, `calculateWillpower`, `getCreationSummary`, `validateCharacterForSubmission`, `calculateXpCost`, `evaluateVisibility` — funções puras, testadas (Vitest) para caminhos válidos e inválidos.
2. Wizard completo (etapas 0–9), autosave com soft-lock (ADR 0003), `ClanSelector`, `StatBudget`, `DotsInput`, `DisciplinePowerPicker` (restrito a `verified_from_source`, ADR 0001), fluxo Caitiff e fluxo Sangue-Ralo (nível de Alquimia + nota, ADR 0004).
3. Seed de `reference_content` (migrations) com os dados verificados de `docs/V5_RULES_MATRIX.md`, todos com `source_document`/`source_page`.
4. Testes de distribuição exata de pontos (os 3 presets de perícia, a distribuição de atributos, orçamento 7/2) e de comportamentos especiais (Caitiff, Sangue-Ralo, três slots, mudança de clã preservando texto livre).

Critério de fechamento: um personagem completo pode ser criado ponta a ponta via UI e via teste de integração, chegando a `submitted`.

## Fase E — Aprovação, publicação e Ficha Viva

1. `/app/conselho`: fila, comparação com revisão anterior, comentários, aprovar/devolver via RPC (`approve_character`, `request_character_changes`), config de crônica (sem "máximo de slots", ADR 0002), concessão pontual de poder (ADR 0008).
2. Publicação (`publish_character` RPC), galeria pública `/personagens` e `/personagens/[slug]` com `evaluateVisibility` aplicado a toda resposta, OpenGraph sem segredos.
3. Ficha Viva completa (`/app/personagens/[id]`) com tabs, `TrackMeter`, `XpLedger`, exportação JSON versionada (`ruleset_version` incluso).
4. Perfil público `/u/[username]`.

Critério de fechamento: fluxo completo draft → submitted → approved → published → visível na galeria, com um narrador de teste e um jogador de teste em contas separadas.

## Fase F — Polimento e entrega

1. Playwright para as jornadas críticas (criar → submeter → aprovar → publicar; tentativa de 4º personagem bloqueada; acesso cruzado entre contas bloqueado).
2. Auditoria de acessibilidade (WCAG AA), mobile, `prefers-reduced-motion`.
3. Seed de dados fictícios para demonstração (claramente rotulados como demo).
4. `README.md`, `.env.example`, documentação de deploy Vercel/Supabase e comandos de migração.

## Convenção de fechamento de fase

Ao final de cada fase: listar arquivos criados/alterados, comandos executados e seus resultados (build/lint/typecheck/test), e pendências explícitas que passaram para a fase seguinte. Nenhum "está tudo pronto" sem essa lista.
