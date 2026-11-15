# Fluxo de UX — Vermillion

Base: seção "Experiências e rotas" e "Wizard O Abraço" do documento mestre. Este documento detalha estados, transições e o que cada tela mostra/esconde — a direção visual (tokens, tipografia, componentes) está em `docs/DESIGN_SYSTEM.md` (Fase B).

## 1. Mapa de rotas

| Rota | Acesso | Conteúdo |
|---|---|---|
| `/` | público | Landing cinematográfica, sem dados reais |
| `/entrar`, `/cadastro`, `/recuperar-senha` | público | Auth email/senha (ADR 0009) |
| `/app` | autenticado | Dashboard: slots restantes, rascunhos, status, novidades |
| `/app/personagens` | autenticado | Meu Grimório — até 3 cartões ativos |
| `/app/personagens/novo` | autenticado | Etapa 0 do wizard |
| `/app/personagens/[id]/editar/[etapa]` | dono do personagem | Wizard, etapas 1–9 |
| `/app/personagens/[id]` | dono + staff da crônica | Ficha Viva (tabs) |
| `/app/conselho` | storyteller/admin | Fila, revisão, config da crônica |
| `/personagens` | público | Galeria — só `published` + `public` |
| `/personagens/[slug]` | público | Perfil público de personagem |
| `/codice` | público | Compêndio autoral |
| `/u/[username]` | público | Perfil de usuário, sem email/IDs internos |

## 2. Máquina de estados do personagem

```
draft --(submeter)--> submitted --(aprovar)--> approved --(publicar)--> published
  ^                       |                                                 |
  |                       v                                                 v
  +---(ajustar e reenviar)-- changes_requested                     (despublicar: visibility privada, status mantém)

qualquer estado não-archived --(arquivar, ADR 0006)--> archived  [terminal, sem volta]
```

- `draft → submitted`: só o dono, só quando `validateCharacterForSubmission` (domínio) passa sem pendências bloqueantes.
- `submitted → approved` / `submitted → changes_requested`: só staff, via RPC (ADR 0007), sempre com `review_events` + (se aprovado) `character_revisions` snapshot.
- `changes_requested → submitted`: só o dono, reenvio após ajustar.
- `approved → published`: dono ou staff, conforme `chronicles.settings.publish_requires_storyteller` (config de crônica); gera `slug` e `public_share_token` se ainda não existirem.
- Mudanças mecânicas em `approved`/`published` não acontecem por edição direta — só via `xp_ledger` + aprovação (Fase E).
- `* → archived`: só o dono (ou staff com justificativa registrada em `audit_events`); libera `slot_number`.

## 3. Wizard — estrutura comum a todas as etapas

- Layout desktop: 3 colunas (barra lateral de etapas · formulário · prévia viva do dossiê). Mobile: etapas no topo (stepper horizontal com scroll), preview em drawer/aba.
- Cada etapa mostra: breadcrumb, % de progresso global, lista de campos pendentes daquela etapa, botões "Voltar" / "Salvar rascunho" / "Continuar".
- Autosave: debounce ~800ms, indicador de estado (`AutosaveIndicator`: salvando / salvo agora / erro de conexão), soft-lock multi-aba (ADR 0003).
- Troca de clã (etapa 2): modal explícito listando que seleções dependentes (Disciplinas, poderes) serão limpas; história/imagens nunca são descartadas.
- "Como funciona?": popover/drawer com explicação autoral curta + referência de página (`source_document`/`source_page` de `reference_content`), nunca transcrição longa.

### Etapas

0. **Introdução** — status "recém-abraçado", resumo das regras da crônica, slots disponíveis, CTA "Começar meu Abraço". Se 3 slots ocupados, CTA desabilitado com explicação.
1. **Identidade e conceito** — campos de texto sem limite curto arbitrário; validação mínima é "não vazio" para campos obrigatórios definidos pela crônica.
2. **Linhagem e sociedade** — `ClanSelector` (13 clãs + Caitiff + Sangue-Ralo, filtrados por `chronicles.settings.allowed_clans`), seita opcional (Independente = ausência, nunca forçado), senhor/data do Abraço, geração/potência de sangue mostradas como somente-leitura quando fixadas pelo preset da crônica.
3. **Atributos** — `StatBudget` com contador exato do preset (seção 4 da matriz de regras), Saúde/Força de Vontade calculados ao vivo.
4. **Perícias e especializações** — seleção de 1 dos 3 presets (sem soma entre eles), especialização gratuita obrigatória quando o preset exige, feedback de pontos não alocados.
5. **Disciplinas e poderes** — `DisciplinePowerPicker` restrito a `verified_from_source` para autosserviço (ADR 0001); Caitiff e Sangue-Ralo com sub-fluxo próprio (ADR 0004 para Sangue-Ralo).
6. **Vantagens, Defeitos e Antecedentes** — saldo 7/2 visível por categoria, origem de cada bônus rotulada (base, Tipo de Predador, XP).
7. **Humanidade e crenças** — Humanidade inicial 7 (ou modificador do preset), 1–3 Convicções cada uma com 1 Pilar, toggle de privacidade por campo sensível, Fome inicial, trilhas de Saúde/Vontade separadas por dano superficial/agravado.
8. **História, aparência e informações** — upload de retrato com corte, campos narrativos, notas privadas claramente marcadas (`PrivacyPreview` mostra o que fica oculto).
9. **Revisão e envio** — dossiê completo, fórmulas auditáveis (de onde veio cada número), checklist de pendências, `ruleset_version`, confirmação explícita para "Enviar para aprovação" (só habilita se `validateCharacterForSubmission` passar).

## 4. Visibilidade e segredo

- `PrivacyPreview` é usado em toda tela que mistura dados públicos/privados — simula exatamente o que a galeria pública mostraria.
- Pilares, notas privadas e qualquer `character_details` privado nunca entram em: resposta de API pública, metadados OpenGraph, busca, sitemap, Storage com URL previsível.
- Link "não listado" usa `public_share_token` (gerado aleatório, não o `slug`) — o `slug` sozinho nunca é tratado como segredo.

## 5. Conselho (narrador/admin)

- Fila de `submitted` ordenável por data/crônica; comparação lado a lado com a última `character_revisions` aprovada (diff simples de campos mecânicos).
- Ação de aprovar/devolver exige comentário quando `changes_requested` (justificativa obrigatória, vira `review_events.comment` + `audit_events`).
- Concessão pontual de poder não verificado (ADR 0008) vive nesta tela, não em rota separada.
- Config da crônica: clãs/seitas permitidos, tipo de predador habilitado, ponto inicial, `publish_requires_storyteller` — **sem** "máximo de slots" (ADR 0002).

## 6. Estados vazios e erro

- Dashboard sem personagens: CTA proeminente "Começar meu Abraço", sem placeholder genérico de SaaS.
- Galeria sem resultados de filtro: estado vazio temático, nunca "No results found" cru.
- Erros de persistência: mensagem junto ao campo, nunca só um toast genérico; erro de rede no autosave não apaga o texto do campo.
