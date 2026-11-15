# VERMILLION — MASTER PROMPT PARA CLAUDE CODE

## Papel e objetivo

Você é simultaneamente um principal full-stack engineer, product designer, especialista em acessibilidade, arquiteto de segurança e designer de ferramentas para RPG de mesa. Desenvolva **VERMILLION**, uma plataforma web própria de criação, organização, progressão e publicação de personagens para uma crônica de texto de **Vampiro: A Máscara, 5ª edição (V5)**. A inspiração funcional é o COMP/CON de Lancer (criação guiada, fichas vivas, biblioteca/roster, compêndio, controle de progressão), mas não copie seu código, layout, marcas ou ativos.

O produto tem identidade própria: **um arquivo digital de criaturas da noite**, elegante, gótico, editorial, opulento e perfeitamente utilizável. O idioma primário e todos os rótulos voltados ao usuário serão **português brasileiro**. Nomes de funções, variáveis, schemas e arquivos em inglês.

O MVP deve ser realmente funcional, não apenas protótipo navegável. Não invente o funcionamento de regras que o material não comprovar. Nunca declare uma funcionalidade pronta antes de executá-la e testá-la.

## Contexto da crônica e limites de produto

- Nome: **Vermillion**.
- Crônica de RPG de texto com múltiplos jogadores e narradores, vinculada a um servidor de Discord.
- Cada usuário pode possuir **no máximo 3 personagens não arquivados**, incluindo rascunhos, contados e validados no banco. Não dependa de contagem apenas no frontend; garanta atomicamente, mesmo sob requisições simultâneas.
- Os jogadores começam como **vampiros recém-abraçados (childer/fledglings)**. A geração e as regras do grupo serão configuradas pelos narradores. Tipos de Predador podem ser adiados para quem ainda não estabeleceu hábito de caça; não aplicar bônus indevidos.
- Seitas/afiliação política: Camarilla, Anarquistas, Sabá, Ashirra ou Independente/sem filiação. Tratar “Independente” como ausência de seita; a seleção NÃO deve forçar um clã ou ser obrigatória em todos os casos. Opções de seita e suas permissões dependem da crônica, não são bônus automáticos.
- Estados de personagem: draft, submitted, changes_requested, approved, published, archived. Definir transições válidas. O jogador envia para aprovação, o narrador revisa e aprova. A publicação ocorre após aprovação, por ação autorizada ou fluxo explicitamente configurado pelo narrador.
- O site é um **projeto gratuito de fã**, sem vendas, anúncios, premium ou pagamentos. Respeitar o Dark Pack Agreement da Paradox; exibir aviso de não oficial, nota legal obrigatória e logo Dark Pack de fonte oficial. Não incorporar conteúdo integral do livro, PDF original, páginas reproduzidas, ilustrações ou marcas fora do permitido. Usar textos de ajuda resumidos, autorais, com referência às páginas das fontes; poder disponibilizar links para materiais oficiais, não hospedar os livros.
- Segurança de segredos do jogador: notas privadas, NPCs confidenciais, Pilares e dados sensíveis nunca entram automaticamente na visualização pública, nem em payloads públicos, busca ou metadados HTML.

## Stack técnica

- Next.js atual estável, App Router, TypeScript strict, React atual estável.
- Tailwind CSS, shadcn/ui + Radix para componentes semânticos, Lucide para ícones.
- Motion para transições; respeitar `prefers-reduced-motion`.
- Supabase: PostgreSQL, Auth (email/senha e opcional OAuth Discord, desde que o provedor esteja configurado), Storage; `@supabase/ssr` e cookies do lado do servidor conforme documentação atual.
- Zod para schemas compartilhados, React Hook Form para formulários; Zustand apenas para estado de UI e rascunhos efêmeros. Persistência verdadeira no banco, nunca só localStorage.
- Vitest para regras de domínio, Testing Library para componentes, Playwright para jornadas críticas, ESLint e typecheck.
- Não adicionar Prisma/Drizzle por inércia: preferir migrations SQL rastreáveis e Supabase Typed Database se isso reduzir complexidade. Documente decisões.
- Hospedagem proposta: Vercel + Supabase.
- Evitar dependências desnecessárias, bibliotecas desatualizadas, `any`, `as any`, chamadas client-side privilegiadas ou secrets no browser.

## Direção estética obrigatória

Construa um design **gótico contemporâneo de luxo**: manuscritos, biblioteca aristocrática, rosas secas, vitrais, pedra negra, veludo, lacre de cera, prata envelhecida, cartas e arquivos confidenciais. Não fazer um painel SaaS genérico pintado de vermelho.

Tokens propostos (ajuste para contraste AA):
- fundo profundo `#0B0A0C` (Obsidiana);
- superfícies `#171016` / `#21161D` (Ébano e Vinho Escuro);
- acento `#941D36` (Carmesim);
- borda/ornamento `#B79A72` (Ouro Antigo);
- texto principal `#E6DDD1` (Marfim);
- texto secundário `#AE9DA2`.

Tipografia: **Cormorant Garamond** em grandes títulos e números; **Manrope** ou **Inter** em formulários, estatísticas e interface; opção **Cinzel** somente em pequenas insígnias, nunca para todo o corpo. Tipos locais ou fontes web licenciadas e otimizadas pelo Next.

Componentes visuais distintivos: cabeçalhos com divisores finos, filetes de ouro, ícones de cera/lacre próprios, monogramas, cartões como dossiês, tabs como páginas de arquivo, progressão como trilha ritualística. Estética cinematográfica, mas funcional.

Animações com propósito: fade/reveal de entrada, deslocamento sutil entre etapas, foco do item escolhido, movimento leve de sombras e brilhos, selo de aprovação, microinterações em botões e barras. Duração aproximada 180–420 ms; `prefers-reduced-motion` desliga movimentos não essenciais. Sem scroll-jacking, splash screen obrigatória, vídeo pesado no fundo ou parallax excessiva. As fontes e os elementos críticos carregam rapidamente.

Escolher imagens originais, próprias, ou licenciadas. Caso não haja arte segura, usar placeholders atmosféricos elegantes em CSS/SVG; nunca buscar/copy-paste artes protegidas de V5 ou interfaces de terceiros.

Mobile-first. Espaços, contraste, foco visível, navegação por teclado, labels, erros junto aos campos, skeletons e estados vazios impecáveis. Interface legível mesmo sem efeitos visuais.

## Experiências e rotas

1. **Landing `/`**: hero inesquecível com wordmark “VERMILLION”, subtítulo “Toda eternidade começa com um nome”, CTA “Entre na noite” e “Conheça a crônica”; teaser do cenário, manifesto curto, linha editorial de personagens e explicação do criador. Navegação discreta; rodapé legal.
2. **Autenticação `/entrar`, `/cadastro`, `/recuperar-senha`**: login, registro, logout, reset por email, estados de erro e confirmação; OAuth com Discord só se configurado.
3. **Dashboard `/app`**: boas-vindas, seus personagens, slots restantes, continuar rascunho, status de avaliação, novidades da crônica.
4. **Meu Grimório `/app/personagens`**: até 3 cartões de personagens com foto, nome, clã, idade aparente, conceito, status, progresso da ficha; opções de editar, duplicar somente se houver slot, arquivar, visualizar e exportar. Confirmação para ações destrutivas. Busca local, ordenação, estados vazios.
5. **O Abraço `/app/personagens/novo` e `/app/personagens/[id]/editar/[etapa]`**: wizard detalhado, descrito abaixo.
6. **Ficha Viva `/app/personagens/[id]`**: cabeçalho cinematográfico com retrato e detalhes, tabs “Perfil”, “Atributos”, “Perícias”, “Disciplinas”, “Vantagens e Defeitos”, “Condição”, “História”, “Evolução”; elementos numéricos interativos somente quando permitido. Área de visibilidade privada separada.
7. **Os Condenados `/personagens` e `/personagens/[slug]`**: galeria pública SOMENTE de fichas published e campos permitidos; filtro por clã e busca, cartões inspirados em arquivos de uma sociedade secreta, perfis compartilháveis com metadados OpenGraph sem segredos.
8. **O Códice `/codice`**: compêndio autoral de clãs, disciplinas, atributos, perícias, regras resumidas, mecânicas de rolagem e tutoriais; filtros e links de origem. O usuário deve saber distinguir resumo de regra oficial integral.
9. **O Conselho `/app/conselho`**: apenas storyteller/admin. Fila de submissões, comparação com ficha anterior, comentários de revisão, aprovar/devolver, status e registros; ajuste da crônica (clãs/seitas permitidos, pontos iniciais, máximo de slots, aprovação, tipo de predador), gestão de conteúdo de referência e logs.
10. **Perfil `/u/[username]`**: apelido, avatar, bio curta, personagens públicos daquele usuário, sem expor email, IDs internos ou segredos.

## Wizard O Abraço — exigências de UX

- Passo a passo com barra lateral de etapas, breadcrumb, progresso em porcentagem, indicação de campos pendentes, botão “Voltar”, “Salvar rascunho”, “Continuar”.
- Em desktop, 3 colunas quando couber: barra lateral com capítulos, formulário principal, à direita uma **prévia viva do dossiê** do vampiro. Em mobile, etapas no topo, preview em drawer ou aba.
- Salvar automaticamente mudanças validadas com debounce; mostrar “Salvo agora” e estado de erro de persistência. Não perder texto ao atualizar, navegar, cair a conexão ou sair e voltar. Usar versionamento otimista/conflict detection para abas simultâneas.
- Mudança de clã deve avisar quais seleções dependentes ficarão inválidas e exigir confirmação antes de limpar somente essas seleções; nunca descartar história escrita ou imagens.
- Todas as regras validadas do lado do servidor e no cliente. Explicações pequenas em PT-BR; mensagens de erro claras, nunca bloqueios sem motivo.
- Opção “Como funciona?” abre explicação autoral breve, com referência às páginas do livro, sem transcrições extensas.
- Preview completo e lista de pendências na última etapa; só habilitar “Enviar para aprovação” quando todos os requisitos aplicáveis passarem.

### Etapas de criação, seguindo a ficha

**0. Introdução** — status “recém-abraçado”, regras da crônica, slots disponíveis, “Começar meu Abraço”.

**1. Identidade e conceito** — nome completo, nome social/apelido, idade real, idade aparente, gênero opcional, nacionalidade, ocupação mortal, conceito, ambição, desejo, breve descrição. Campos de texto narrativos não devem ter limites arbitrariamente curtos.

**2. Linhagem e sociedade** — escolha de clã via cards com visual simbólico e descrição breve, Disciplinas do clã e fraquezas em linguagem resumida; seita/afiliação separada e opcional; senhor(a) e data do Abraço; geração e potência do sangue determinadas pelo preset da crônica/narrador, não escolhidas livremente se estiverem fixadas. Incluir 13 clãs e regras de Caitiff/Sangue-Ralo, habilitados pelos narradores.

Clãs de referência e Disciplinas típicas segundo o Players Guide:
- Banu Haqim: Feitiçaria de Sangue, Celeridade, Ofuscação.
- Brujah: Celeridade, Potência, Presença.
- Gangrel: Animalismo, Fortitude, Metamorfose.
- Hecata: Auspícios, Fortitude, Oblívio.
- Lasombra: Dominação, Oblívio, Potência.
- Malkavian: Auspícios, Dominação, Ofuscação.
- Ministério: Ofuscação, Presença, Metamorfose.
- Nosferatu: Animalismo, Ofuscação, Potência.
- Ravnos: Animalismo, Ofuscação, Presença.
- Salubri: Auspícios, Dominação, Fortitude.
- Toreador: Auspícios, Celeridade, Presença.
- Tremere: Auspícios, Dominação, Feitiçaria de Sangue.
- Tzimisce: Animalismo, Dominação, Metamorfose.
- Ventrue: Dominação, Fortitude, Presença.
- Caitiff: linhagem sem clã, seleção de disciplinas pelo próprio conjunto de regras.
- Sangue-Ralo: fluxo ESPECIAL, independente do padrão de clã, de mérito/defeito e de Alquimia de Sangue-Ralo. Não force regras de clã normal neste fluxo.

**3. Atributos** — 9 campos agrupados por físicos (Força, Destreza, Vigor), sociais (Carisma, Manipulação, Compostura) e mentais (Inteligência, Raciocínio, Determinação). Distribuição inicial **1 atributo com 4, 3 com 3, 4 com 2, 1 com 1**. Implementar selector de pontos acessível, contador e validação exata; exibir Saúde = Vigor + 3; Força de Vontade = Compostura + Determinação; respeitar modificadores quando houver.

**4. Perícias e especializações** — todas as 27 perícias físicas/sociais/mentais, com nomes portugueses do guia da crônica. Presets exclusivos:
- Generalista: 1×3, 8×2, 10×1.
- Equilibrado: 3×3, 5×2, 7×1.
- Especialista: 1×4, 3×3, 3×2, 3×1.
Não permitir soma de presets. Zeradas para perícias sem pontos; perfis de especialização, pelo menos uma especialização gratuita na criação e especializações obrigatórias nas perícias correspondentes conforme as regras e fontes. Exibir feedback de pontos ainda não alocados. Dados de especialização editáveis, mas persistidos tipadamente.

**5. Disciplinas e poderes** — para clãs comuns: escolher duas Disciplinas DO clã, uma com 2 pontos e outra com 1 ponto; terceira sem pontos. Escolher um poder por ponto; cada poder deve respeitar nível máximo, pré-requisitos, combinações/amálgamas. Acesso a um catálogo de poderes resumido e legalmente utilizável. Tratar separadamente Caitiff, Sangue-Ralo, custos e poderes de predador. Não inventar nomes/efeitos/rules se não houver dados autorizados verificáveis; inicialmente permitir catálogo reduzido e administração da narração ou descrições próprias, com status explícito de “requer referência”.

**6. Vantagens, Defeitos e Antecedentes** — orçamento padrão inicial **7 pontos de Vantagens e 2 pontos de Defeitos**, conforme resumo de criação do Players Guide; exibir saldos por categoria, descrição e origem. Distinguir Méritos, Antecedentes e Defeitos; não criar uma falsa equivalência 1:1 automática onde o sistema não a prevê. Loresheets e variantes são habilitadas apenas com referência/validação da narração. Vantagens/Defeitos associados ao Tipo de Predador não consomem o orçamento base. Adições por XP são contabilizadas separadamente.

**7. Humanidade e crenças** — Humanidade inicial 7 por padrão salvo modificadores; 1 a 3 Convicções e 1 Pilar mortal vinculado a cada Convicção. Nome, vínculo, significado e status do Pilar; configuração de privacidade individual. Tenets/Princípios da crônica são globais (narrador), não regras pessoais editadas pelo jogador. Fome inicial e condição vampírica conforme preset, com trilhas distintas para dano superficial e agravado; não considerar tudo um simples contador indiferenciado.

**8. História, aparência e informações** — retrato e recorte (respeitar autoria/licenças), aparência, personalidade, história humana, relato do Abraço, vida após o Abraço, refúgio, relações, pertences e inventário narrativo, notas privadas/segredos. Separar campos públicos/privados.

**9. Revisão e envio** — dossiê visual completo, pontos e fórmulas auditáveis, avisos, avisos sobre dados públicos, checklist, versão da regra de criação, status de submissão, confirmação explícita. Exibir campos privados que ficarão ocultos. Quando aprovado, congelar snapshot da criação base; mudanças mecânicas posteriores requerem lançamento em progressão e aprovação, conforme configuração.

## Regras de domínio e cálculos

- Centralize regras em `src/domain/v5/` ou módulo equivalente, sem dependência de React, Supabase ou componentes visuais.
- Exportar schemas tipados, funções puras e testes: `validateAttributes`, `validateSkills`, `validateDisciplines`, `validateAdvantages`, `calculateHealth`, `calculateWillpower`, `getCreationSummary`, `validateCharacterForSubmission`, `calculateXpCost`, `evaluateVisibility`.
- Versão explícita do ruleset (`ruleset_version`), `source_reference` e `chronicle_overrides`, com resolução determinística e documentação de divergências.
- **Poderes, méritos e defeitos específicos** só entram no catálogo oficial após extração autorizada de informações e conferência de fonte. Não criar dados fabricados. Permitir administração de resumos próprios e referência à página, sem reproduzir livros integralmente.
- Fome de 0 a 5. Dados de Fome **substituem** dados comuns; não se somam ao tamanho da parada. Dados d10 contam sucesso em 6+; pares de 10 valem 4 sucessos por par; 10 de Dado de Fome envolvido em crítico gera crítico bagunçado; falha com dado de Fome 1 pode gerar falha bestial. Testes de Despertar usam 1d10 normal e falham em 1–5, aumentando Fome. Implementar eventual rolagem como recurso **fase 2** se comprometer o MVP; não fazer fake math.
- Progresso e XP: atributos `novo nível × 5`, perícias `novo nível × 3`, nova especialização `3 XP`, Disciplina do clã `novo nível × 5`, fora do clã `novo nível × 7`, Caitiff `novo nível × 6`, Potência do Sangue `novo nível × 10`. Fórmulas/rituais/benefícios adicionais exigem referência específica. Deixar compras de XP sujeitas à aprovação do narrador e registrar eventos, nunca subtrair XP apenas no client.
- Ações de narradores podem alterar manualmente condição/XP com **justificativa e trilha de auditoria**; personagem aprovado não pode modificar livremente atributos ou disciplinas sem aprovação.
- Toda restrição importante tem teste unitário para caminhos válidos e inválidos (especialmente orçamento de pontos, Caitiff/Sangue-Ralo, três slots simultâneos, mudanças de clã, roteamento de estados).

## Modelagem e integridade de dados

Projetar migrations versionadas e tipos derivados, no mínimo cobrindo:
- `profiles` (id referenciando auth.users, username único, avatar, display_name, role, preferências);
- `chronicles`, `chronicle_memberships` (papéis player/storyteller/admin, presets, configurações e convites se necessário);
- `characters` (owner_id, chronicle_id, slug único no contexto, name, clan_id, status, visibility, version, ruleset_version, creation_step, timestamps);
- `character_details` (história, dados pessoais, campos públicos e privados **separáveis**);
- `character_attributes`, `character_skills`, `character_specializations`;
- `character_disciplines`, `character_powers`;
- `character_advantages`, `character_flaws`, `character_convictions`, `character_touchstones`;
- `character_tracks` (Saúde, Força de Vontade, Humanidade, Fome, Potência do Sangue e danos conforme regras);
- `xp_ledger`, `character_revisions`, `review_events`, `audit_events`;
- `reference_content` ou seeds versionados com nomes, níveis, resumos autorais e referências;
- `media_assets` associado a owner e personagem.

É aceitável reduzir o número físico de tabelas se justificar transações mais simples sem fragilizar integridade. Dados mecânicos devem ser validados e consultáveis; não guardar tudo em um JSONB único impossível de auditar.

**Segurança:** aplicar RLS em todas as tabelas expostas; acessos com `auth.uid()`, dono do personagem e associação narrador/admin comprovada no banco. Não confiar no role vindo de input, metadata editável ou claims user_metadata. Visões públicas com allowlist de campos. Exigir autenticação nos writes e checar autorização no servidor. Policies para SELECT/INSERT/UPDATE/DELETE testadas em cenários player A, player B, storyteller e visitante. Evitar service-role no browser. Limites de upload, verificação de MIME e tipo real, extensão permitida, nomes aleatórios, rate limit para publicações e ações de risco; nenhum arquivo executável aceito. Nunca renderizar HTML de usuário sem sanitização e escapar o texto. Não expor segredos ou informações privadas via OpenGraph, feeds, search ou storage aberto.

Salvar em transações coerentes, proteger alterações concorrentes com versionamento, não confiar em contadores enviados pelo usuário. Contemplar paginação e índices para galeria, owner, status e cronologia. Fornecer fluxo de exclusão de conta com comportamento documentado para fichas publicadas.

## Componente de publicação

- Rascunhos só visíveis ao proprietário e aos narradores autorizados da crônica.
- Após submissão, bloquear mudanças mecânicas de forma clara, mantendo comentários de revisão.
- Narrador pode aprovar ou solicitar ajustes; usuário vê pendências destacadas e histórico.
- Somente aprovado pode ser publicado; o sistema pode exigir ato explícito de publicação pelo dono ou narrador conforme configuração.
- Página pública não inclui segredos, anotações privadas, Pilares confidenciais, endereço/email real, informações de autenticação ou recursos secretos do narrador.
- O usuário pode compartilhar `/personagens/[slug]`; link “não listado” deve usar um identificador longo e imprevisível, não slug como segredo.
- Preview fiel do que outras pessoas verão antes de publicar.

## Componentes de UI a entregar

`VermillionWordmark`, `GothicShell`, `VelvetCard`, `WaxSeal`, `LoreDivider`, `PageTransition`, `CharacterPortrait`, `CharacterCard`, `CharacterRoster`, `ClanSelector`, `DotsInput`, `StatBudget`, `DisciplinePowerPicker`, `WizardStepper`, `AutosaveIndicator`, `PrivacyPreview`, `StatusBadge`, `CharacterSheet`, `TrackMeter`, `XpLedger`, `LoreTooltip`, `ReviewChecklist`, `ApprovalPanel`.

Crie SVGs geométricos originais para ornamentos, sem usar fontes de ícones protegidas de outras marcas. Adotar composição responsiva; `DotsInput` precisa de interação por teclado e acessibilidade (não depende de clicar em círculos minúsculos).

## Acessibilidade e desempenho

WCAG AA no conteúdo e controles, formulários com labels e `aria-describedby`, sem erro dependente só de cor, indicador de foco, ordenação lógica, modais com foco e ESC, leitura por screen reader, tratamento `prefers-reduced-motion`. Tratar redes lentas, loading, erros de autenticação, uploads interrompidos e banco indisponível. Evitar hydration mismatch, layout shift, cascatas de client components, consultas N+1; imagens responsivas e cache apropriado.

## Fluxo de implementação obrigatório

**Fase A — Descoberta/documentação**
- Inspecione ambiente, versões e arquivos existentes. Antes de alterar, redija `docs/PRODUCT_BRIEF.md`, `docs/UX_FLOW.md`, `docs/V5_RULES_MATRIX.md`, `docs/DATA_MODEL.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/LEGAL.md` e `CLAUDE.md` conciso.
- Se o arquivo PDF do Players Guide estiver disponível em `docs/referencias/`, confira **páginas impressas 12–13 e 62–65** (clãs, características, criação e custos). Se não estiver, documente a falta, use os fatos presentes neste briefing e NÃO invente o restante. Não versionar o PDF no Git.
- Defina explicitamente o que vem do livro e o que é configuração editorial do Vermillion; preserve um registro de decisões (ADRs) para escolhas relevantes.
- Apresente um plano faseado; corrija contradições de domínio antes de avançar.

**Fase B — Design system e protótipo funcional sem banco**
- Defina tokens, tipografia, animações e componentes base; implemente landing, dashboard/roster com fixtures, início do wizard e preview; dados falsos marcados como demo.
- Faça screenshots desktop/tablet/mobile e revise contraste, visual e legibilidade; se não houver browser de testes, explique a limitação e rode o que for possível.
- Sem mock permanente. Componentes devem ter interfaces tipadas e poder conectar ao banco.

**Fase C — Auth, migrations, RLS e persistência**
- Implementar Supabase SSR/Auth, migrations, policies, tipos de banco, upload seguro e perfil.
- Validar criação de rascunho, controle de três slots e isolamento entre contas.

**Fase D — Criador V5 completo**
- Implementar wizard por etapas, autosave, domínio de regras, clãs, atributos, perícias, disciplinas, vantagens, humanidade e revisão.
- Testar a distribuição exata de pontos, derivados e comportamentos especiais.

**Fase E — Aprovação, publicação e Ficha Viva**
- Dashboard narrador, avaliações, retorno de ajustes, publicações públicas, exportação JSON com schemas/versionamento, versão de impressão responsiva, XP e trilha de alterações.

**Fase F — Polimento e entrega**
- Testes end-to-end; otimização; auditoria de segurança, RLS, mobile e acessibilidade; seed de dados *fictícios*; README e `.env.example`; documentação de deploy Vercel/Supabase e comandos de migração.

Não entregue uma fase pela metade e afirme que o sistema inteiro está pronto. Feche cada fase verificando build, typecheck, lint e testes relevantes e relatando os arquivos criados, evidências de validação e pendências. Faça commits pequenos e semanticamente nomeados se o repositório estiver preparado; não faça deploy sem autorização.

## Critérios de aceite (Definition of Done do MVP)

1. Usuário consegue entrar, cadastrar-se, sair e recuperar acesso.
2. Usuário consegue criar até três rascunhos, continuar no mesmo ponto depois de fazer logout e retornar, editar e arquivar.
3. Os nove Atributos aceitam exatamente a distribuição oficial no preset selecionado.
4. As 27 Perícias e seus três modelos têm validação exata, especializações persistidas.
5. O clã determina as Disciplinas disponíveis, com regras de criação e poderes selecionados; opções especiais são tratadas sem falsa equivalência.
6. Pontuação de Vantagens/Defeitos não permite saldo inválido e registra a origem dos bônus.
7. Fome, Humanidade, Saúde e Força de Vontade são calculadas ou preenchidas conforme suas regras, não números inventados.
8. As prévias públicas nunca revelam conteúdo classificado como privado.
9. O envio exige validação de servidor, mostra pendências e chega à fila de narradores.
10. Um narrador aprova, pede alterações e registra justificativas; um jogador não pode forjar aprovação.
11. Jogador publica o personagem aprovado; visitante o encontra na galeria e no link compartilhável.
12. O usuário não consegue ler/escrever fichas privadas de outro usuário nem criar o quarto slot por chamadas diretas ou corrida concorrente.
13. O site possui identidade visual genuinamente gótica, com animações discretas e excelente versão mobile.
14. Fluxos críticos cobertos por testes unitários, integração e E2E; build e lint passam.
15. Rodapé e política de uso de fã cumprem as exigências aplicáveis do Dark Pack.

## Sua primeira resposta e primeiras ações

1. Faça uma inspeção rápida do repositório. Se estiver vazio, proponha scaffolding do Next.js e migrations sem introduzir frameworks extras.
2. Apresente um mapa sucinto de arquitetura, etapas e critérios de aceite.
3. Use as skills instaladas de `frontend-design`, `web-design-guidelines`, `react-best-practices` e `grill-with-docs` quando aplicáveis, verificando a presença real de cada uma; não afirme que as usou sem invocá-las.
4. Comece a criar os documentos e a primeira fatia vertical funcional (landing e dashboard de demonstração), de forma incremental, antes de expandir para todos os fluxos.
5. Se houver dúvidas decisivas, documente a alternativa recomendada e avance com a configuração padrão explicitamente indicada aqui. Não substituir o objetivo por uma landing page estática.
6. Ao final de cada ciclo, inclua instruções exatas de execução local e um checklist do que foi realmente testado.

**O resultado deve parecer um produto feito para vampiros, não um dashboard corporativo com um filtro vermelho.**
