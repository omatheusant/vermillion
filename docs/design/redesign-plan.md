# Plano de refinamento visual — Vermillion

Status: **implementado** (autorizado pelo usuário) — os 5 passos da seção 7 foram aplicados; ver "Registro de implementação" ao final deste documento para o que foi feito, o que divergiu do plano original e por quê. DNA completo em [`vermillion-design-dna.json`](./vermillion-design-dna.json); medições brutas de cor em [`measurements/`](./measurements/).

## 1. Objetivo e restrição inegociável

Elevar o acabamento visual do Vermillion a um nível premium/cinematográfico — "grimório vampírico digital", Londres 2026 — **sem trocar nenhuma cor existente**. Todo hex usado abaixo já existe em `src/app/globals.css`:

| Token | Hex | Papel atual |
|---|---|---|
| `--bg-obsidian` | `#0B0A0C` | fundo |
| `--surface-ebony` | `#171016` | superfície primária |
| `--surface-wine` | `#21161D` | superfície elevada |
| `--ink-ivory` | `#E6DDD1` | texto principal |
| `--ink-muted` | `#AE9DA2` | texto secundário |
| `--ornament-gold` | `#B79A72` | borda/ornamento/foco |
| `--accent-crimson-deep` | `#941D36` | preenchimento de destaque |
| `--accent-crimson-bright` | `#D6445C` | link/erro sobre fundo escuro |

Nenhum `--color-*` novo é proposto. Onde este plano fala em "glow", "vinheta" ou "grão", é sempre uma composição `color-mix`/`radial-gradient`/`opacity` em cima destes 8 valores — nunca um hex novo.

## 2. Auditoria do estado atual

**Tokens e config**: Tailwind v4 CSS-first, tudo em `globals.css` (`@theme inline` + `:root`), sem `tailwind.config.ts` separado. Fontes via `next/font`: Cormorant Garamond (display), Manrope (UI/corpo), Cinzel (insígnia/badge only). `--radius: 0.25rem` com escala derivada (`radius-sm` ≈ 2.4px) — cantos quase retos, nunca `rounded-2xl`.

**Componentes de marca reutilizáveis** (`src/components/vermillion/`):
- `GothicShell` — header fino + rodapé legal Dark Pack, usado em 17 páginas. Estrutural, não muda.
- `VelvetCard` — cartão-base: borda `ornament-gold` 1px, `rounded-sm`, sombra inset sutil (papel), 1 `cornerLabel` opcional. É o componente mais reutilizado do produto (listas, grids, painéis).
- `StatusBadge` — ícone + cor + texto, nunca só cor (regra de acessibilidade já implementada).
- `LoreDivider` — filete + losango SVG geométrico próprio.
- `WaxSeal` — selo SVG (círculo irregular + "V"), reservado a aprovação/publicação.
- `PageTransition` — fade+translateY(8px), já respeita `useReducedMotion` (hook central, `matchMedia` via `useSyncExternalStore`).
- `wizard-shell.tsx` — shell de 3 colunas (`stepper · formulário · prévia`), corrigido recentemente para nunca duplicar o formulário no DOM entre mobile/desktop.

**Documentação normativa já em vigor** (`docs/DESIGN_SYSTEM.md`): regra de moderação do carmesim (máx. 1 destaque vermelho por "dossiê"), regra de nunca-textura-atrás-de-texto, regra de 1 etiqueta de canto por card, regra de movimento (180–420ms, proibido scroll-jacking/vídeo de fundo/parallax >1 camada). **Este plano não contradiz nenhuma dessas regras — ele é desenhado para operar dentro delas.**

**Páginas-chave para o refinamento**: landing (`src/app/page.tsx`), Ficha Viva (`character-sheet.tsx`, `publish-panel.tsx`), Conselho (`review-actions-panel.tsx`, `[characterId]/page.tsx`), galeria/perfil público (`public-gallery-grid.tsx`, `/personagens/[slug]`, `/u/[username]`), Códice (`/codice/page.tsx` — hoje provavelmente o mais "nu", bom candidato a dossiê de clã ornamentado).

## 3. Síntese das referências (resumo — DNA completo no JSON)

5 imagens em `references/design/`, todas medidas com `measure-colors.mjs` (k-means determinístico, não estimativa visual). Achado principal: **as 5 referências convergem para a mesma família tonal que o Vermillion já usa** — preto quase absoluto como fundo dominante (58–85% de cobertura em todas), vinho/carmesim como único acento saturado, e em duas delas um metal quente (dourado/marfim) para destaque. Isso valida a fusão sem precisar de nenhuma cor nova.

| Referência | Dispositivo mais transportável |
|---|---|
| Victoria D. Tzigani (site de autora) | borda de "papel rasgado" entre seções; ticker-tape de faixa inteira |
| Cartier/Nerpherius (key art) | glow radial vermelho + grão de filme + vinheta no hero |
| Hooligan (selo/pôster) | moldura de respingo orgânico nos 4 cantos; wordmark isolado em campo vazio |
| Vampyr UI (capa de case) | ritmo "hero cinematográfico pesado → bloco de leitura calmo"; chuva/neblina generativa (rejeitado — custo vs. regra de movimento) |
| Dossiê de vampiro (spread) | moldura ornamentada de canto + letra-capitular + retrato em duotone atrás de texto |

## 4. O que é mantido integralmente

- As 8 cores/tokens listadas na seção 1 — nenhuma alteração de hex, nenhum token novo de cor.
- As 3 fontes e seus usos exclusivos (Cormorant display, Manrope UI, Cinzel só insígnia).
- `GothicShell`, `StatusBadge`, `LoreDivider`, `WaxSeal`, `VelvetCard` como componentes-base — nenhum é removido ou renomeado.
- A regra de moderação do carmesim, a regra de nunca-textura-atrás-de-texto, a regra de 1 etiqueta de canto por card.
- A regra de movimento: 180–420ms, `ease-out`/`ease-in`, proibição de scroll-jacking/vídeo de fundo/parallax >1 camada, `prefers-reduced-motion` via o hook `useReducedMotion` já existente.
- Toda a estrutura de rotas, autenticação, RLS e regras de negócio — **fora de escopo por instrução explícita.**
- O tratamento visual de telas de formulário puro (wizard, Conselho, cadastro/login) continua **sem** ornamento pesado — são as telas de "trabalho", não de "vitrine".

## 5. O que é aprimorado — por área

### 5.1 Landing (`src/app/page.tsx`)
- Hero: o `radial-gradient` simples atual ganha uma segunda camada de glow mais difusa (inspirada na Ref 2) e grão de filme finíssimo (opacidade 0.02–0.04, `feTurbulence` SVG ou PNG de ruído, nunca atrás do texto) — reforça profundidade sem herdar cor nova.
- Transição hero → manifesto: reforçar o ritmo "tensão cinematográfica → leitura calma" (Ref 4), já presente estruturalmente, com um pouco mais de respiro vertical.
- `LoreDivider` ganha variante opcional com traço revelado (`stroke-dashoffset`) no primeiro scroll até a seção — não substitui o divisor estático, é uma variante para momentos de peso.

### 5.2 Ficha Viva (`character-sheet.tsx`, `publish-panel.tsx`)
- Quando o personagem está `published`: o cartão principal passa a usar uma nova variante de `VelvetCard` com **moldura de canto ornamentada** (SVG, 4 cantos, lados abertos — inspirada na Ref 5) em vez da borda reta simples. Cards de rascunho/em avaliação continuam com a borda atual (reserva o ornamento para o "momento de peso").
- Se houver retrato de personagem (upload existente via `media_assets`): tratamento **duotone** sutil em crimson-deep/wine com overlay escurecedor atrás de texto de história/lore (nunca atrás de números de atributo ou formulário).
- Blocos de "História" (`embrace_account`, `human_history` etc.) ganham letra-capitular (`DropCapLore`, novo componente pequeno) no primeiro parágrafo — efeito puramente tipográfico, zero custo de performance.
- Botão "Publicar"/selo de aprovação: o `WaxSeal` existente ganha uma versão com traço revelado (500–900ms, uma vez, desabilitada sob `prefers-reduced-motion`) só no momento da própria aprovação/publicação — não em toda renderização da página.

### 5.3 Conselho (`review-actions-panel.tsx`, `grant-power-form.tsx`)
- Nenhuma mudança decorativa — é a tela de trabalho do narrador, já corrigida nesta sessão por um problema real de contraste. Only garante que o glow/vinheta de outras áreas nunca vaze para cá.

### 5.4 Galeria pública e perfil (`public-gallery-grid.tsx`, `/personagens/[slug]`, `/u/[username]`)
- Cards de personagem na galeria continuam no tratamento atual de lista (volume > ornamento, por performance e por já estarem no limite recomendado do "1 destaque por dossiê").
- Página de detalhe de um personagem publicado (`/personagens/[slug]`) herda o mesmo tratamento "dossiê ornamentado" da Ficha Viva do dono (seção 5.2), já que é a mesma vitrine pública.

### 5.5 O Códice (`/codice`)
- Candidato mais forte a "dossiê de clã": cada clã pode usar a moldura ornamentada + letra-capitular no texto autoral já existente (o conteúdo de clã fornecido pelo narrador no Discord) — essa página hoje é a mais "nua" e a que mais se beneficia do tratamento tipo Ref 5.

### 5.6 Em todo o produto
- Novo utilitário de "glow sutil" em hover de CTA primário e cards `elevated` (2–4px, opacidade baixa) — substitui a mudança de opacidade pura atual por algo com mais profundidade, sem mudar a cor do botão.

## 6. Novos componentes propostos (aditivos — nada é removido)

| Componente | Papel | Usa cor nova? |
|---|---|---|
| `OrnateFrame` | Moldura de canto SVG reutilizável (3-4 tamanhos), linha fina estilo gravura | Não — `currentColor`/`ornament-gold` |
| `DropCapLore` | Letra-capitular circular para o primeiro parágrafo de blocos de história/lore | Não |
| `FilmGrainOverlay` | Camada `::before` de ruído finíssimo, só para telas de tela cheia (hero, splash) | Não — preto/branco a baixa opacidade |
| Variante `VelvetCard elevated ornate` | Combina `OrnateFrame` + glow sutil, para os "momentos de peso" da seção 5 | Não |

## 7. Ordem de implementação sugerida (após autorização)

1. `FilmGrainOverlay` + glow de hero (landing) — menor risco, maior impacto visual imediato.
2. `OrnateFrame` (SVG) + variante `VelvetCard ornate` — aplicar primeiro na Ficha Viva publicada (1 tela).
3. `DropCapLore` — aplicar no Códice (texto de clã já existente, conteúdo pronto).
4. Traço revelado no `WaxSeal`/`LoreDivider` — só nos 3 momentos de peso já mapeados (aprovação, publicação, entrada de seção do Códice).
5. Glow de hover em CTA/card elevado — passe final, menor risco.

Cada passo é independente e reversível; nenhum exige migração de banco, mudança de rota ou de regra de negócio.

## 8. Verificação antes de declarar pronto

- `npm run typecheck && npm run lint && npm run build` — inalterado como gate.
- `npm run test:e2e` — a suíte de acessibilidade (`e2e/accessibility.spec.ts`, axe-core WCAG 2.1 AA) **precisa continuar em 0 violações**; qualquer glow/grão/duotone novo será revisado quanto a contraste antes de mesclar.
- Checagem manual de `prefers-reduced-motion: reduce` em cada efeito novo (todos devem degradar para estático).
- Nenhuma verificação de cor via `scripts/verify.mjs` é necessária aqui — não há paleta nova para validar por ΔE, já que o objetivo é preservação, não substituição.

## 9. Riscos e mitigação

- **Risco**: ornamento "vazar" para telas de trabalho (wizard, formulários) e violar a regra de §4. Mitigação: lista explícita de "momentos de peso" na seção 5 — tudo fora dela mantém o tratamento atual.
- **Risco**: grão/glow comprometer contraste medido. Mitigação: opacidades propostas são deliberadamente baixas (0.02–0.2) e revisadas via axe antes de mesclar.
- **Risco**: efeito pesado demais para mobile/performance. Mitigação: nenhum WebGL/Canvas/partícula foi adotado — tudo é CSS/SVG (ver `visual_effects` no DNA JSON, `performance_tier: lightweight`).

## 10. Autorização

Nenhuma implementação começa até confirmação explícita. Ao autorizar, posso seguir a ordem da seção 7 inteira ou só os itens que você priorizar.

## 11. Registro de implementação

Os 5 passos foram implementados na ordem da seção 7. Duas divergências do plano original, ambas por respeitar a restrição de não implementar páginas/funcionalidades novas nesta etapa:

- **Passo 3 (letra-capitular)**: o alvo original era "O Códice", mas essa página ainda é um placeholder `ComingSoon` — não existe conteúdo real nela para estilizar. Em vez de construir a página (fora de escopo), `DropCapLore` foi aplicado ao bloco "História humana" da própria Ficha Viva (`CharacterSheet`), que já é um texto de lore real e longo. O Códice continua como pendência de produto, não de design.
- **Passo 4 (traço revelado)**: o `WaxSeal` ganhou o efeito de **"carimbo" (escala com overshoot)** em vez de traço revelado — essa animação específica já estava documentada em `docs/DESIGN_SYSTEM.md §5` desde antes deste plano e nunca tinha sido implementada; por ser mais específica e mais adequada a uma forma preenchida (o selo de cera), ela prevaleceu sobre a sugestão genérica deste documento. O `WaxSeal` também não existia em nenhum fluxo de aprovação/publicação antes de hoje — foi conectado a `review-actions-panel.tsx` e `publish-panel.tsx` pela primeira vez, disparando só no instante real da ação (nunca em toda renderização da página, via estado local `justApproved`/`justPublished`). O traço revelado (`stroke-dashoffset`) foi usado no `OrnateFrame` (passo 2) e no `LoreDivider` do manifesto da landing, no lugar do divisor de seção do Códice.

Também não foi aplicado o duotone de retrato de personagem — não há, hoje, nenhuma renderização de retrato por personagem na Ficha Viva (só avatar de perfil do usuário, em tela separada). Fica registrado como pendência para quando essa funcionalidade existir, não implementada agora por ser fora do escopo desta etapa.

Arquivos novos: `src/components/vermillion/film-grain-overlay.tsx`, `ornate-frame.tsx`, `drop-cap-lore.tsx`. Arquivos alterados: `globals.css`, `page.tsx` (landing), `velvet-card.tsx`, `lore-divider.tsx`, `wax-seal.tsx`, `button.tsx`, `character-card.tsx`, `character-sheet.tsx`, `publish-panel.tsx`, `review-actions-panel.tsx`, `public-gallery-grid.tsx`, `app/personagens/[id]/page.tsx`, `personagens/[slug]/page.tsx`, `u/[username]/page.tsx`, `app/conselho/page.tsx`. Nenhuma cor nova, nenhuma rota nova, nenhuma mudança de regra de negócio. Validação: `typecheck`/`lint`/`build` limpos, 73 testes unitários + 22 E2E (incluindo auditoria WCAG 2.1 AA via axe-core nas telas afetadas) verdes.

## 12. Passagem "bolder" (pós-aprovação, hero + Ficha Viva publicada)

O usuário considerou a passagem acima pouco diferente do estado anterior e pediu algo genuinamente mais parecido com as referências (`hero-reference`, `vampire-reference`, `vampire2-reference`), autorizando a instalação de `three.js` quando perguntado explicitamente (a skill `impeccable`, carregada a pedido do usuário, exige perguntar antes de adicionar qualquer primitivo que o sistema visual ainda não possui — imagem/cena, chuva, partículas, 3D).

**Elementos novos adicionados ao hero da landing** (escopo confirmado pelo usuário: landing + Ficha Viva publicada):
- `GothicSkyline` — silhueta original (SVG, traço próprio) de telhados vitorianos + lua minguante, em duas camadas de profundidade.
- `HeroAtmosphere` — chuva fina + brasas subindo, Canvas 2D puro (sem lib), pausa quando a aba não está visível, nunca renderiza sob `prefers-reduced-motion`.
- `HeroFogScene` — névoa volumétrica sutil, única cena three.js do produto (3 planos translúcidos sem iluminação, textura procedural, sem asset externo); carregada via `next/dynamic(ssr:false)` só no client e só quando o hero monta — confirmado por inspeção do chunk de build que o bundle do three.js (528KB) não é referenciado no manifesto de nenhuma rota além do carregamento sob demanda da landing. Sob `prefers-reduced-motion` renderiza um único frame estático, sem parallax de ponteiro.
- Glow/vinheta do hero bem mais fortes; hero agora ocupa `min-h-[100svh]` (antes, altura definida só pelo padding do conteúdo).

**Ficha Viva publicada**: glow do `VelvetCard ornate` bem mais forte (sombra com offset real em vez de halo centrado) + lavagem radial estática de canto, sem chuva/partículas/3D — mantida deliberadamente mais contida que o hero porque, no framework de "Modes" da própria skill `impeccable`, essa tela é "Operate" (o visitante está lendo/gerenciando a própria ficha), não "Persuade"; animação pesada ali prejudicaria a leitura, não a serviria.

**Achado durante a verificação visual**: o Chrome usado para verificar tem `prefers-reduced-motion: reduce` ativo no nível do sistema operacional — então chuva, brasas, deriva da névoa e a respiração do glow aparecem como estáticos nesse navegador especificamente (comportamento correto, não um bug). Vale conferir essa configuração do Windows se o resultado parecer mais parado do que o esperado ao testar.

**Achado do detector mecânico da Impeccable** (`impeccable detect`): 1 ocorrência advisória de "bounce/elastic easing" no `cubic-bezier(0.34, 1.56, 0.64, 1)` do carimbo do `WaxSeal`. Mantido deliberadamente — é a curva documentada em `docs/DESIGN_SYSTEM.md §5` ("escala 0.8→1 com leve overshoot"), um único micro-gesto fisicamente motivado (um selo de cera real bate e assenta com um leve solavanco), não bounce decorativo espalhado pela interface.

Validação: `typecheck`/`lint`/`build` limpos, 73 testes unitários + 22 E2E (incluindo WCAG 2.1 AA via axe-core na landing e na Ficha Viva publicada, e "sem overflow horizontal" em mobile real via Playwright) verdes após esta passagem. Dependência nova: `three` + `@types/three`.

## 13. Hero com fotografia real (pós-feedback: "sem impacto", cenário era vitoriano e o RPG é 2026)

O usuário apontou dois problemas reais na passagem anterior: o `GothicSkyline` (silhueta desenhada) não tinha impacto nenhum perto das referências, e pior — era vitoriano, enquanto a crônica se passa em **Londres contemporânea, 2026**. Pedi um prompt de geração de imagem (gerado por mim, a pedido do usuário, para ele colar no GPT) já corrigindo esse ponto de cenário; o usuário gerou a imagem e adicionou em `public/hero.webp`, sem área escura embutida — pediu para controlar o escurecimento por CSS.

**O que mudou**:
- `GothicSkyline`, `HeroAtmosphere` (chuva/brasas em Canvas 2D) e `HeroFogScene`/`HeroFogSceneLazy` (névoa em three.js) foram **removidos** — a fotografia real já tem chuva, neblina e luz vermelha convincentes; empilhar os efeitos sintéticos por cima ficaria redundante e sujaria uma imagem boa. Os 4 arquivos foram apagados e a dependência `three`/`@types/three` foi desinstalada (não tinha mais nenhum uso no projeto).
- O hero agora usa `next/image` (`fill`, `priority`, `sizes="100vw"`) com `public/hero.webp` como cena de fundo real.
- Escurecimento feito inteiramente em CSS, num único elemento: lavagem radial mais forte atrás do bloco de texto (`ellipse 65% 60% at 50% 48%`) + vinheta de topo/base + uma lavagem uniforme leve por cima — tudo só com `--bg-obsidian`/`black`, nenhuma cor nova. `FilmGrainOverlay` mantido, com opacidade reduzida (0.05 → ainda mais sutil que antes) já que a foto tem granulação própria.
- Confirmado via axe-core que o texto permanece com contraste AA sobre a imagem, e via Playwright mobile que não há overflow horizontal.

**Nota operacional**: ao rodar a suíte E2E, deixei um `next dev` anterior ainda escutando na porta 3000; o Playwright reaproveitou esse servidor de dev em vez de subir o build de produção (`reuseExistingServer`), reproduzindo a instabilidade de timing do modo dev já documentada na Fase D — um teste (`critical-journeys`) falhou por isso. Derrubei o servidor de dev e reexecutei contra o build de produção real: passou normalmente. Não era uma regressão de produto.
