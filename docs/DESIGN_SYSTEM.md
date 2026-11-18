# Design System — Vermillion

Nota de processo: as skills `frontend-design`, `web-design-guidelines` e `ui-ux-pro-max` estão listadas como disponíveis neste ambiente, mas falharam ao ser invocadas (`Unknown skill`) nas tentativas feitas durante este planejamento. As decisões abaixo são autorais, fundamentadas diretamente na seção "Direção estética obrigatória" do documento mestre e em cálculo real de contraste WCAG (script Python, não estimativa visual).

Direção: **gótico contemporâneo de luxo** — arquivo confidencial de uma sociedade secreta, não um SaaS vermelho. Referências de humor: biblioteca aristocrática fechada ao público, dossiê selado a cera, vitral visto à noite, prata envelhecida sobre veludo escuro.

## 1. Cor

| Token | Hex | Papel | Contraste medido |
|---|---|---|---|
| `--bg-obsidian` | `#0B0A0C` | Fundo profundo, base de toda a aplicação | — |
| `--surface-ebony` | `#171016` | Superfície primária (cards, painéis) | — |
| `--surface-wine` | `#21161D` | Superfície elevada (modais, popovers, hover) | — |
| `--ink-ivory` | `#E6DDD1` | Texto principal | 14.7:1 sobre obsidian, 13.9:1 sobre ebony — AA confortável |
| `--ink-muted` | `#AE9DA2` | Texto secundário, metadados, legendas | 7.7:1 / 7.3:1 — AA |
| `--ornament-gold` | `#B79A72` | Bordas, filetes, ícones de ornamento, foco visível | 7.4:1 / 7.0:1 — AA, seguro como linha/ícone |
| `--accent-crimson-deep` | `#941D36` | **Preenchimento** de botão primário, selo de cera, barras de progresso, destaque de superfície — nunca como texto sobre fundo escuro | 2.3:1 sobre obsidian — **falha AA como texto**; sempre com `--ink-ivory` por cima (6.3:1, AA) |
| `--accent-crimson-bright` | `#D6445C` | Texto de link, ícone ativo, foco de estado de erro/alerta sobre fundo escuro | 4.55:1 sobre obsidian — AA (texto normal, no limite — evitar tamanho < 16px) |

**Regra de moderação do carmesim**: no máximo um elemento de destaque carmesim por "dossiê" (card/tela) além de botões primários — selo, barra de progresso ativa, ou badge de status, nunca os três ao mesmo tempo na mesma composição. O resto da hierarquia é resolvido com ouro antigo (linha/ornamento) e contraste tonal entre as três superfícies escuras, não com mais vermelho.

Estados: foco visível sempre com `outline` de 2px `--ornament-gold` + offset, nunca só mudança de cor (também vale para quem não distingue vermelho/verde). Erro de formulário usa ícone + `--accent-crimson-bright` + texto, nunca só a cor da borda.

## 2. Tipografia

- **Cormorant Garamond** — títulos (`h1`–`h3`), números grandes de atributo/estatística, nome do personagem no cabeçalho da Ficha Viva. Pesos 500/600, nunca abaixo de 20px (serifa fina ilegível em corpo pequeno).
- **Manrope** — UI, formulários, labels, corpo de texto, tabelas, botões. Peso 400 corpo / 600 labels e botões.
- **Cinzel** — somente insígnias pequenas (brasão de clã, selo, badge de status, "VERMILLION" no wordmark). Nunca em parágrafo ou label de formulário.

Escala (rem, base 16px):

| Nível | Tamanho | Fonte | Uso |
|---|---|---|---|
| Display | 3.5rem / 1.05 | Cormorant Garamond 600 | Hero da landing |
| H1 | 2.5rem / 1.1 | Cormorant Garamond 600 | Título de página |
| H2 | 1.875rem / 1.15 | Cormorant Garamond 500 | Seção / nome do personagem |
| H3 | 1.375rem / 1.2 | Cormorant Garamond 500 | Subseção, título de card |
| Stat | 2.25rem / 1 | Cormorant Garamond 600 | Número de atributo/track |
| Body | 1rem / 1.6 | Manrope 400 | Corpo, formulário |
| Small | 0.875rem / 1.5 | Manrope 400 | Metadados, legendas |
| Badge/Insígnia | 0.75rem / 1, letter-spacing 0.08em, uppercase | Cinzel 500 | Status, brasão |

Fontes carregadas via `next/font` (self-hosted, sem CDN externo) — crítico para "elementos críticos carregam rapidamente" e para não depender de terceiro em runtime.

## 3. Espaço, borda e ornamento

- Escala de espaçamento: 4, 8, 12, 16, 24, 32, 48, 64px (Tailwind `spacing` custom alinhado a isso).
- Cards ("dossiês"): borda 1px `--ornament-gold` a 40% de opacidade, canto levemente quadrado (`rounded-sm`, 4–6px — nunca cartão com `rounded-2xl` estilo app consumer), sombra sutil interna no topo simulando papel, não sombra drop externa genérica.
- `LoreDivider`: regra fina com um ornamento SVG geométrico original no centro (losango ou selo simplificado), nunca um `<hr>` cru nem clip-art de terceiro.
- `WaxSeal`: SVG geométrico próprio (círculo irregular + monograma "V"), usado para confirmação/aprovação — nunca em excesso (reservado para momentos de peso: aprovação, publicação, selo de autenticidade do personagem).

## 4. Tratamento de "dossiê confidencial" sem virar pastiche

- Metadados do personagem (clã, status, idade aparente) em uma faixa superior do card com Cinzel só no rótulo de status (ex.: "APROVADO"), o resto em Manrope.
- Uma única "etiqueta" de canto (ex.: carimbo de status) por card — evitar empilhar selos, fitas e textura de papel ao mesmo tempo; a sugestão de arquivo é dada por **tipografia + borda + um detalhe**, não por textura de fundo pesada que prejudica contraste e peso de página.
- Nunca usar papel/textura de fundo *atrás do texto* — texturas (se usadas) ficam só em elementos decorativos isolados (cabeçalho da landing, fundo do `WaxSeal`), nunca atrás de corpo de texto ou formulário, para não comprometer o contraste calculado acima.
- Retratos de personagem: moldura fina dourada, máscara de recorte levemente vinhetada (CSS `mask-image`/gradiente), sem frame ornamentado pesado que compita com o conteúdo.

## 5. Movimento

- Duração 180–420ms, `ease-out` para entrada, `ease-in` para saída. Biblioteca: Motion (Framer Motion).
- Padrões: fade+translateY(8px) na entrada de seção; foco de item selecionado com leve escala (1.0→1.02) e brilho de borda dourada; selo de aprovação com um único "carimbo" (escala 0.8→1 com leve overshoot) na conclusão de aprovação/publicação.
- `prefers-reduced-motion: reduce` remove todo transform/opacity de entrada não essencial (mantém apenas mudanças de estado instantâneas); implementado via hook único `useReducedMotion` central, não checagem espalhada.
- Proibido: scroll-jacking, splash screen, vídeo de fundo.
- Parallax (regra revisada a pedido explícito do usuário — Fase de refinamento visual): no máximo **1 camada por seção**, nunca na própria tipografia/conteúdo de leitura — só em pano de fundo decorativo (`ParallaxLayer`, `src/components/vermillion/parallax-layer.tsx`). Implementado com `scroll`/`resize` + `requestAnimationFrame` (sem loop contínuo ocioso), desliga por completo sob `prefers-reduced-motion`. Continua proibido empilhar mais de uma camada de parallax na mesma seção.

## 6. Componentes — notas de implementação

Lista completa de componentes no documento mestre. Notas específicas:
- `DotsInput`: navegável por teclado (setas ajustam valor, Home/End vão ao mínimo/máximo), `role="slider"` ou `spinbutton` com `aria-valuenow/min/max`, nunca depende só de clique em alvo pequeno.
- `StatusBadge`: mapeia estado → texto + ícone + cor, nunca só cor (ver regra de foco/erro acima).
- `CharacterCard`/`CharacterRoster`: grid responsivo mobile-first (1 coluna → 2 → 3), skeleton com a mesma geometria do card real (não um retângulo cinza genérico).

## 7. Tokens Tailwind (referência de implementação, Fase B)

Mapeamento direto dos tokens da seção 1 para `tailwind.config.ts` (`theme.extend.colors`) e CSS vars em `globals.css`, para permitir both uso utilitário (`bg-surface-ebony`) e troca futura de tema sem reescrever componentes.
