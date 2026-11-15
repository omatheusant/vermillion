# ADR 0009 — Email/senha como único método de autenticação no MVP

## Contexto

O documento mestre permite OAuth Discord "desde que o provedor esteja configurado" — ou seja, é condicional a uma configuração externa (client ID/secret de uma aplicação Discord) que não existe ainda no projeto.

## Decisão

O MVP implementa apenas login/cadastro/recuperação de senha por email/senha via Supabase Auth. O botão de login com Discord é implementado atrás de uma feature flag (`AUTH_DISCORD_ENABLED`, lida de variável de ambiente) e só aparece na UI quando a flag está ligada e as credenciais do provedor estão configuradas no projeto Supabase. Nenhuma lógica de produto assume a existência de login social.

## Consequências

- Fase C entrega autenticação completa e testável sem depender de criar uma aplicação OAuth no Discord primeiro.
- Quando o dono do projeto configurar o provedor Discord no painel do Supabase, ativar a flag é a única mudança necessária no código.

## Alternativas rejeitadas

- **Bloquear Fase C até ter credenciais Discord**: rejeitado — adiaria toda a fase de autenticação por uma dependência externa opcional.
