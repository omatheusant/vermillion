-- Catálogo completo de Vantagens/Defeitos/Antecedentes — docs/V5_RULES_MATRIX.md
-- §4. Até aqui reference_advantages só tinha as 12 entradas específicas de
-- Caitiff (migration 20261116130001). O Matheus adicionou V5_Corebook_Extended.pdf
-- (capítulo "Advantages", p.179-194) como fonte local — agora disponível para
-- consulta (nunca versionado em git, mesma regra do players_guide.pdf).
--
-- Todo resumo abaixo é texto autoral curto (nunca cópia literal de parágrafo
-- do livro, docs/LEGAL.md §3), com source_page apontando para a página
-- impressa do capítulo onde o Mérito/Defeito/Antecedente aparece.
--
-- Méritos e Defeitos de Sangue-Ralo (p.182-185) não têm custo em pontos no
-- livro original (cada Defeito "paga" um Mérito, não consomem o orçamento
-- de criação) — por isso entram com dots_min=0/dots_max=0. A validação de
-- domínio (validate-advantages.ts) foi ajustada numa migration/commit
-- separado para aceitar 0 pontos.

insert into reference_advantages (kind, name, dots_min, dots_max, summary, lineage_restriction, source_document, source_page) values
-- Méritos/Defeitos gerais (p.179-183)
('merit', 'Linguística', 1, 5, 'Cada ponto garante fluência (fala, leitura e escrita) em mais um idioma além do nativo e do idioma dominante da crônica.', null, 'V5_Corebook_Extended.pdf', '179'),
('flaw', 'Analfabetismo', 2, 2, 'Não sabe ler nem escrever: Acadêmicos e Ciência ficam limitados a 1 ponto, sem especialização de conhecimento moderno.', null, 'V5_Corebook_Extended.pdf', '179'),
('flaw', 'Feio', 1, 1, 'Perde 1 dado em testes Sociais relevantes por causa da aparência desagradável.', null, 'V5_Corebook_Extended.pdf', '179'),
('flaw', 'Repulsivo', 2, 2, 'Perde 2 dados em testes Sociais relevantes — a aparência é perturbadora à primeira vista.', null, 'V5_Corebook_Extended.pdf', '179'),
('merit', 'Belo', 2, 2, 'Ganha 1 dado extra em testes Sociais apropriados graças à aparência marcante.', null, 'V5_Corebook_Extended.pdf', '179'),
('merit', 'Deslumbrante', 4, 4, 'Ganha 2 dados extras em testes Sociais apropriados — a beleza chega a ser quase sobrenatural.', null, 'V5_Corebook_Extended.pdf', '179'),
('flaw', 'Dependência Química', 1, 1, 'Vício em uma substância além de sangue: perde 1 dado em qualquer teste quando a última presa não tinha a droga no sangue.', null, 'V5_Corebook_Extended.pdf', '179-180'),
('flaw', 'Vício Incurável', 2, 2, 'Versão mais severa da Dependência Química: perde 2 dados nas mesmas condições.', null, 'V5_Corebook_Extended.pdf', '179'),
('merit', 'Usuário Funcional', 1, 1, 'Ganha 1 dado extra numa categoria de testes quando a última presa tinha sua droga no sangue.', null, 'V5_Corebook_Extended.pdf', '180'),
('flaw', 'Arcaico', 2, 2, 'Não se adaptou ao presente (ou passou muito tempo em torpor): Tecnologia permanece 0 e não consegue usar celulares ou computadores.', null, 'V5_Corebook_Extended.pdf', '180'),
('flaw', 'Vivendo no Passado', 1, 1, 'Carrega crenças visivelmente desatualizadas; perde 1 dado em testes Sociais envolvendo essas crenças, exceto com vampiros da sua época ou mais velhos.', null, 'V5_Corebook_Extended.pdf', '180'),
('flaw', 'Escravo do Vínculo', 1, 1, 'O Vínculo de Sangue é especialmente prazeroso para você: perde 1 dado para agir contra um Vínculo ativo.', null, 'V5_Corebook_Extended.pdf', '181'),
('flaw', 'Vínculo Duradouro', 1, 1, 'Vínculos de Sangue sobre você se dissolvem mais lentamente do que o normal.', null, 'V5_Corebook_Extended.pdf', '181'),
('merit', 'Resistência ao Vínculo', 1, 3, 'Cada ponto soma 1 dado para resistir à formação de um novo Vínculo de Sangue (máximo 3 pontos).', null, 'V5_Corebook_Extended.pdf', '181'),
('flaw', 'Vínculo Curto', 2, 2, 'Vínculos de Sangue sobre você se dissolvem mais rápido do que o normal.', null, 'V5_Corebook_Extended.pdf', '181'),
('merit', 'Invinculável', 5, 5, 'Você não pode ser Vinculado por sangue, de nenhuma forma.', null, 'V5_Corebook_Extended.pdf', '181'),
('flaw', 'Vegano', 2, 2, 'Só se alimenta de sangue animal; beber sangue humano custa 2 pontos de Força de Vontade. Ventrue não pode escolher este Defeito.', null, 'V5_Corebook_Extended.pdf', '181'),
('flaw', 'Organovoro', 2, 2, 'Só sacia a Fome comendo carne e órgãos humanos ricos em sangue, nunca só sangue puro.', null, 'V5_Corebook_Extended.pdf', '181'),
('flaw', 'Sede de Matusalém', 1, 1, 'Sua Fome só é plenamente saciada por sangue de criaturas sobrenaturais; do contrário permanece sempre em pelo menos 1.', null, 'V5_Corebook_Extended.pdf', '181'),
('flaw', 'Exclusão de Presa', 1, 1, 'Se recusa a caçar um tipo específico de presa; alimentar-se dela causa Mácula como se tivesse violado um Princípio da crônica.', null, 'V5_Corebook_Extended.pdf', '181-182'),
('merit', 'Faro de Sangue', 1, 1, 'Sente a Ressonância do sangue de um humano sem precisar provar, desde que esteja perto o bastante para sentir o cheiro.', null, 'V5_Corebook_Extended.pdf', '182'),
('merit', 'Gula de Ferro', 3, 3, 'Pode se alimentar de sangue frio, rançoso ou fracionado, mesmo sem nenhuma Ressonância. Ventrue não pode escolher este Mérito.', null, 'V5_Corebook_Extended.pdf', '182'),
('flaw', 'Isca para Estaca', 2, 2, 'Uma estaca atravessando o coração causa Morte Final em vez de torpor.', null, 'V5_Corebook_Extended.pdf', '182'),
('flaw', 'Maldição Folclórica', 1, 1, 'Sofre dano Agravado de uma fraqueza folclórica específica escolhida na criação (luz ultravioleta, prata, água benta). Pode ser escolhido mais de uma vez, para fraquezas diferentes.', null, 'V5_Corebook_Extended.pdf', '182-183'),
('flaw', 'Bloqueio Folclórico', 1, 1, 'Precisa recuar ou gastar 1 ponto de Força de Vontade para superar um bloqueio folclórico específico (símbolos sagrados, água corrente visível, soleira sem convite, etc). Pode ser escolhido mais de uma vez, para bloqueios diferentes.', null, 'V5_Corebook_Extended.pdf', '183'),
('flaw', 'Estigma', 1, 1, 'Começa a sangrar pelas mãos, pés e testa ao chegar à Fome 4 — chama atenção e deixa rastros.', null, 'V5_Corebook_Extended.pdf', '183'),
('merit', 'Comer Comida', 2, 2, 'Consegue comer alimentos sólidos sem esforço e sem mal-estar, ainda que sem nenhuma nutrição real.', null, 'V5_Corebook_Extended.pdf', '183'),
-- Antecedentes (Backgrounds, p.184-194)
('background', 'Aliados', 1, 6, 'Mortais que apoiam você de boa vontade — família, amigos ou uma organização em dívida com você. Costumam aparecer cerca de uma vez por história.', null, 'V5_Corebook_Extended.pdf', '184-185'),
('flaw', 'Inimigos', 1, 4, 'O oposto de Aliados: alguém que trabalha ativamente contra você, pontuado dois níveis abaixo da Eficácia equivalente.', null, 'V5_Corebook_Extended.pdf', '184'),
('background', 'Contatos', 1, 3, 'Pessoas em boa posição para te dar informação ou favores numa área específica — um despachante de polícia, um corretor de armas, um assessor político.', null, 'V5_Corebook_Extended.pdf', '185-186'),
('background', 'Fama', 1, 5, 'Mortais conhecem seu nome e buscam notícias sobre você; reduz a Dificuldade de testes Sociais com seus fãs e facilita certas caçadas.', null, 'V5_Corebook_Extended.pdf', '186-187'),
('flaw', 'Infâmia', 1, 4, 'Você é famoso por algo terrível: aumenta a Dificuldade da maioria dos testes de reação ou chama a atenção de autoridades.', null, 'V5_Corebook_Extended.pdf', '187'),
('flaw', 'Segredo Sombrio', 1, 3, 'Uma versão mais branda da Infâmia — seus atos sombrios são conhecidos só por você e talvez um ou dois inimigos bem motivados.', null, 'V5_Corebook_Extended.pdf', '187'),
('background', 'Influência', 1, 5, 'Poder sobre um grupo ou região da cidade através de riqueza, cargo, chantagem ou manipulação sobrenatural.', null, 'V5_Corebook_Extended.pdf', '187-188'),
('flaw', 'Desprezado', 2, 2, 'Um grupo ou região inteira da cidade existe só para te sabotar: perde 2 dados para convencer um ator neutro a te apoiar.', null, 'V5_Corebook_Extended.pdf', '188'),
('flaw', 'Malvisto', 1, 1, 'Perde 1 dado em testes Sociais envolvendo qualquer grupo da cidade, exceto seus próprios Aliados e Contatos.', null, 'V5_Corebook_Extended.pdf', '188-189'),
('background', 'Refúgio', 1, 3, 'Tamanho, segurança e privacidade do seu esconderijo diurno; cada ponto soma dificuldade para quem tenta localizá-lo e dados para perceber perigo enquanto você está nele.', null, 'V5_Corebook_Extended.pdf', '188'),
('flaw', 'Sem Refúgio Fixo', 1, 1, 'Precisa de algum esforço real para encontrar um novo lugar seguro para passar o dia a cada amanhecer.', null, 'V5_Corebook_Extended.pdf', '188'),
('flaw', 'Refúgio Comprometido', 2, 2, 'Seu refúgio já foi invadido antes (talvez até antes de ser seu) — invasores ou espiões ganham 2 dados extras para localizá-lo ou vigiá-lo.', null, 'V5_Corebook_Extended.pdf', '189'),
('flaw', 'Refúgio Sinistro', 1, 1, 'Seu refúgio parece o covil de um assassino em série — testes Sociais para acalmar visitantes humanos sofrem penalidade de 2 dados.', null, 'V5_Corebook_Extended.pdf', '189'),
('flaw', 'Refúgio Assombrado', 1, 1, 'Há uma manifestação sobrenatural no seu refúgio que você não controla nem entende de verdade — penalidade de dado por ponto deste Defeito nos testes feitos ali.', null, 'V5_Corebook_Extended.pdf', '189'),
('merit', 'Arsenal Oculto', 1, 1, 'Cada ponto acrescenta ao refúgio um conjunto de armas guardado (uma pistola e uma arma longa, com munição).', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Cela', 1, 1, 'Seu refúgio tem um espaço trancado para prender até dois reféns, com Dificuldade de fuga 5.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Vigias', 1, 1, 'Segurança privada ou capangas guardam seu refúgio — cada ponto equivale a quatro guardas comuns e um chefe talentoso.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Laboratório', 1, 1, 'Refúgio equipado para Ciência, Tecnologia ou Alquimia de Sangue-Ralo — soma 1 dado por ponto numa especialidade relacionada.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Biblioteca', 1, 1, 'Refúgio com acervo dedicado a ocultismo, história ou lore vampírica — soma 1 dado por ponto em pesquisas relacionadas.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Localização Privilegiada', 1, 1, 'Refúgio numa área valorizada ou exclusiva da cidade — soma 2 dados a testes relacionados a essa posição.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Luxo', 1, 1, 'Decoração e itens caros dão 2 dados extras em testes Sociais com visitas mortais recebidas no refúgio.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Saída Secreta', 1, 1, 'Seu refúgio tem uma saída discreta — cada ponto soma 1 dado para evadir ou escapar de vigilância perto dele.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Sistema de Segurança', 1, 1, 'Cada ponto soma 1 dado para resistir a — ou perceber — uma invasão não autorizada do refúgio.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Sala de Cirurgia', 1, 1, 'Refúgio equipado como enfermaria de campo — soma 2 dados a testes de Medicina realizados ali.', null, 'V5_Corebook_Extended.pdf', '190'),
('merit', 'Proteção Mística', 1, 1, 'Uma barreira mágica protege o refúgio de forças sobrenaturais — cada ponto soma 1 dado para resistir a vigilância ou intrusão sobrenatural.', null, 'V5_Corebook_Extended.pdf', '190'),
('background', 'Rebanho', 1, 5, 'Um grupo de mortais dos quais você se alimenta sem preocupação; sacia Fome igual à sua pontuação de Rebanho a cada semana, sem teste.', null, 'V5_Corebook_Extended.pdf', '190-191'),
('flaw', 'Predador Óbvio', 2, 2, 'Humanos sentem medo instintivo de você: perde dados para caçar ou tranquilizar pessoas, e não pode manter um Rebanho.', null, 'V5_Corebook_Extended.pdf', '191'),
('background', 'Identidade Falsa', 1, 2, 'Documentação falsa capaz de resistir a verificações; sem nenhum ponto, você só sobrevive a uma checagem superficial, como numa blitz de trânsito.', null, 'V5_Corebook_Extended.pdf', '191-192'),
('flaw', 'Registro de Risco', 2, 2, 'Seus dados biométricos aparecem em bancos de inteligência como suspeito de terrorismo — qualquer investigador experiente te reconhece como algo fora do normal.', null, 'V5_Corebook_Extended.pdf', '192'),
('flaw', 'Cadáver Conhecido', 1, 1, 'As pessoas sabem que você morreu recentemente e reagem com choque e horror ao te ver.', null, 'V5_Corebook_Extended.pdf', '192'),
('background', 'Mawla', 1, 5, 'Um Cainita (ou grupo) que olha por você e oferece orientação, informação ou ajuda ocasional — com frequência, o próprio senhor, quando a relação é boa.', null, 'V5_Corebook_Extended.pdf', '192-193'),
('flaw', 'Adversário', 1, 5, 'Um Cainita que quer mal a você, ao seu senhor ou à sua linhagem — o reverso do Mawla.', null, 'V5_Corebook_Extended.pdf', '193'),
('background', 'Recursos', 1, 5, 'Renda e patrimônio que sustentam seu padrão de vida; pode secar, ser roubado ou simplesmente sumir ao longo da crônica.', null, 'V5_Corebook_Extended.pdf', '193'),
('flaw', 'Indigente', 1, 1, 'Você não tem dinheiro nem um lugar para morar.', null, 'V5_Corebook_Extended.pdf', '193'),
('background', 'Lacaios', 1, 3, 'Um ou mais servos leais — carniçais, dominados ou simplesmente apaixonados — que você precisa controlar de alguma forma (salário, sangue ou mesmerismo).', null, 'V5_Corebook_Extended.pdf', '194'),
('flaw', 'Perseguidores', 1, 1, 'Você atrai pessoas obcecadas por você; afastar uma não resolve — outra aparece logo depois.', null, 'V5_Corebook_Extended.pdf', '194'),
('background', 'Status', 1, 5, 'Sua reputação dentro de uma seita específica (Camarilla, Anarquistas, etc.); não se transfere para outra seita.', null, 'V5_Corebook_Extended.pdf', '194'),
('flaw', 'Execrado', 2, 2, 'Esta seita te odeia por completo e trabalha ativamente contra você.', null, 'V5_Corebook_Extended.pdf', '194'),
('flaw', 'Suspeito', 1, 1, 'Você não é bem visto nesta seita — sofre penalidade de 2 dados em testes Sociais envolvendo essa facção.', null, 'V5_Corebook_Extended.pdf', '194'),
-- Méritos/Defeitos de Sangue-Ralo (p.182-185) — sem custo em pontos no livro;
-- cada Defeito compensa um Mérito e vice-versa, por isso dots_min=dots_max=0.
('flaw', 'Dentes de Leite', 0, 0, 'Nunca desenvolveu presas funcionais — precisa cortar a presa ou usar uma seringa para se alimentar. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '182-183'),
('flaw', 'Temperamento Selvagem', 0, 0, 'Sofre da Fera como um vampiro completo e testa frenesi pelas regras normais. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '183'),
('flaw', 'Marcado pela Camarilla', 0, 0, 'Carrega uma marca física permanente que a Camarilla usa para te vigiar e lembrar do seu lugar. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '183-184'),
('flaw', 'Maldição de Clã (Sangue-Ralo)', 0, 0, 'Sofre a fraqueza de um clã (gravidade 1) herdada de resquícios do sangue do seu senhor. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184'),
('flaw', 'Carne Morta', 0, 0, 'Sua carne apodrece visivelmente, com cheiro e tom perceptíveis — penalidade de 1 dado em testes Sociais presenciais com mortais. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184'),
('flaw', 'Fragilidade Mortal', 0, 0, 'Não consegue Despertar o Sangue para se curar — cura como um mortal comum. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184'),
('flaw', 'Rejeitado pelos Anarquistas', 0, 0, 'Os Anarquistas da sua região sabem de você e preferem te evitar ou te entregar à Camarilla. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184'),
('flaw', 'Dependência de Vitae', 0, 0, 'Sem beber sangue vampírico o suficiente para saciar 1 de Fome por semana, perde acesso a Disciplinas e Alquimia de Sangue-Ralo. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184'),
('merit', 'Camaradas Anarquistas', 0, 0, 'Uma coterie Anarquista tolera ou até trata você com afeto — funciona como um Mawla Anarquista de 1 ponto. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184'),
('merit', 'Contato na Camarilla', 0, 0, 'Um recrutador da Camarilla te observa e promete uma chance de embrace completo em troca de informações suas e da sua coterie. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184'),
('merit', 'Sangue Encadeante', 0, 0, 'Pode criar Vínculos de Sangue e realizar o Abraço como um vampiro normal — qualquer vampiro criado assim também será Sangue-Ralo. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184'),
('merit', 'Bebedor Diurno', 0, 0, 'O sol reduz sua Saúde à metade em vez de causar dano direto, mas remove suas habilidades vampíricas enquanto durar a exposição. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '184-185'),
('merit', 'Afinidade com Disciplina', 0, 0, 'Ganha 1 ponto numa Disciplina escolhida na criação e pode comprar pontos adicionais nela por experiência, como um vampiro comum. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '185'),
('merit', 'Parece Vivo', 0, 0, 'Tem batimento cardíaco, pode comer e manter relações sexuais como um mortal; exames médicos comuns não notam nada estranho. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '185'),
('merit', 'Alquimista de Sangue-Ralo', 0, 0, 'Já começa com 1 ponto e 1 fórmula de Alquimia de Sangue-Ralo. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '185'),
('merit', 'Resiliência Vampírica', 0, 0, 'Sofre dano como um vampiro comum, tratando perfurações e cortes simples como dano superficial. (Sangue-Ralo, sem custo em pontos.)', 'thin_blood', 'V5_Corebook_Extended.pdf', '185');
