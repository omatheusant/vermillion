# Legal — Dark Pack e uso de fã

Vermillion é um projeto de fã, gratuito, sem venda, anúncio, assinatura ou qualquer forma de monetização. Opera sob o **Dark Pack Agreement** da Paradox Interactive para World of Darkness.

## Obrigações aplicadas no produto

1. **Aviso de não oficial**: presente no rodapé de toda página e na landing, em destaque — "Vermillion é um projeto de fã, não afiliado nem endossado pela Paradox Interactive. Vampire: The Masquerade® é marca registrada da Paradox Interactive AB."
2. **Logo Dark Pack**: exibido no rodapé, obtido de fonte oficial do programa Dark Pack — nunca recriado ou aproximado visualmente; se o asset oficial não estiver disponível no momento da implementação, o rodapé mostra o texto da licença sem um logo substituto improvisado (nunca inventar um logo "parecido").
3. **Sem conteúdo integral reproduzido**: nenhuma página do `players_guide.pdf`, ilustração original, ou texto extenso copiado literalmente. Todo texto de regra exibido ao usuário no Códice ou no wizard é **resumo autoral**, com referência de página (`source_document`, `source_page`) — nunca cópia literal de parágrafos do livro.
4. **Não hospedar os livros**: `players_guide.pdf` fica fora do controle de versão (`.gitignore`) e fora de qualquer rota pública ou bucket de Storage acessível. Links para adquirir o material oficial podem ser oferecidos, nunca o arquivo em si.
5. **Marcas e nomes de clã/Disciplina**: usados como referência funcional (são termos de sistema, não arte/logo), consistente com uso de fã documentado por outros produtos não-oficiais da linha.

## Dados pessoais e privacidade

- Nenhum dado de contato real (email, IDs internos do Supabase) é exposto em `/u/[username]` ou em qualquer payload público.
- Segredos de personagem (Pilares, notas privadas, NPCs confidenciais) nunca entram em busca, OpenGraph, sitemap ou resposta de API pública — reforçado por RLS e por seleção explícita de colunas (ver `docs/DATA_MODEL.md`, seção 5).
- Exclusão de conta: comportamento documentado em `docs/DATA_MODEL.md`, seção 7 — personagens publicados são despublicados, não permanecem acessíveis publicamente após a exclusão.

## Upload de mídia

- Apenas imagens (verificação de MIME real, não só extensão/nome do arquivo); nenhum arquivo executável aceito.
- Nome de arquivo gerado pelo servidor (aleatório), nunca o nome original enviado pelo usuário.
- Rate limit em upload e em ações de risco (publicação, submissão) para mitigar abuso.
- Toda imagem enviada deve ser de autoria do usuário ou licenciada para esse uso — o produto não garante isso automaticamente; o Termos de Uso (a escrever antes do lançamento público) deixa essa responsabilidade explícita para quem envia.

## Pendências antes de qualquer lançamento público real

- Obter o logo Dark Pack oficial em alta resolução.
- Redigir Termos de Uso e Política de Privacidade completos (fora do escopo técnico deste plano, mas referenciados no rodapé desde o MVP com um placeholder "em construção" se ainda não existirem).
