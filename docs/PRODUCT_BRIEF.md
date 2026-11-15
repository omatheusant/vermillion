# Vermillion — Product Brief

## O que é

Vermillion é um arquivo digital de criaturas da noite: plataforma web própria (não um clone de COMP/CON) de criação, organização, progressão e publicação de personagens de **Vampire: The Masquerade, 5ª edição (V5)**, construída para uma crônica de texto com múltiplos jogadores e narradores, operada por um servidor de Discord. É um projeto de fã, gratuito, sem monetização.

## Para quem

- **Jogadores**: criam e evoluem até 3 personagens vampiros (recém-abraçados) não arquivados por vez, acompanham status de aprovação, publicam fichas para a galeria pública.
- **Narradores (storyteller)**: revisam submissões, aprovam/devolvem com justificativa, ajustam configuração da crônica, concedem poderes pontuais fora do catálogo verificado.
- **Admin**: superset de narrador; gestão de papéis dentro da crônica.
- **Visitantes**: veem a galeria pública (`/personagens`) e perfis publicados, sem autenticação.

## Fora de escopo no MVP

- Rolagem de dados em tempo real (sistema de Fome/sucessos) — ADR futura se entrar em fase 2; o documento mestre autoriza adiar.
- Catálogo completo de fórmulas de Alquimia de Sangue-Ralo (ADR 0004).
- Desarquivamento de personagens (ADR 0006).
- UI de administração do catálogo de referência (ADR 0005).
- Login social (Discord OAuth) até credenciais serem configuradas (ADR 0009).
- Pagamentos, anúncios, qualquer monetização — proibido pelo escopo de fã.

## Restrições de licenciamento (Dark Pack)

Ver `docs/LEGAL.md`. Resumo: aviso de projeto não oficial obrigatório em todas as páginas relevantes, logo Dark Pack de fonte oficial, nenhuma reprodução integral de texto/arte do livro — apenas resumos autorais com referência de página, seguindo a fonte local disponível (`players_guide.pdf`, não versionado em git).

## Métrica de sucesso do MVP

Um jogador consegue, sem ajuda, criar um personagem completo (das 10 etapas do wizard), enviar para aprovação, receber aprovação de um narrador de teste, publicar, e ver a ficha pública — com todos os cálculos de V5 corretos e nenhum dado privado vazando para a galeria pública. Ver critérios de aceite completos no documento mestre (`VERMILLION_PROMPT_CLAUDE_CODE.md`, seção "Critérios de aceite").

## Fontes de verdade

- Requisitos funcionais/visuais/técnicos: `VERMILLION_PROMPT_CLAUDE_CODE.md` (raiz do projeto).
- Regras de V5: `players_guide.pdf` (raiz do projeto, não versionado) — ver `docs/V5_RULES_MATRIX.md` para o que foi verificado e com que página.
- Decisões de arquitetura: `docs/adr/`.
- Terminologia: `docs/GLOSSARY.md`.
