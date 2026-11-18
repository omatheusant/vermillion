-- Seed do catálogo de poderes de Disciplina, Tipos de Predador e uma
-- amostra de Vantagens/Defeitos — Fase D, ADR 0001/0005.
--
-- Fonte: players_guide.pdf (local, não versionado em git). Páginas
-- impressas citadas por entrada; nomes em PT-BR são tradução de
-- trabalho autoral do Vermillion (não oficial), incluindo "Rapidez"
-- para a Disciplina Celerity/Celeridade (nomenclatura da própria
-- crônica — ver docs/V5_RULES_MATRIX.md §2.1).
--
-- verification_status (ADR 0001):
--   verified_from_source: nome + nível + resumo conferidos contra o
--     texto integral da página citada (a maioria vem do capítulo
--     "Discipline Powers", p.69-98, que documenta só a partir do
--     nível 2 — ou das Ceremonies de Oblivion, p.96-97).
--   requires_reference: nome confirmado (citado nas fichas pré-prontas
--     "Iconic Characters"/"Instant Vampires", p.63-68, e cruzado com
--     outras páginas quando citado), mas o texto mecânico completo
--     (custo, dados, sistema) não foi lido nesta rodada — aparecem no
--     wizard desabilitados, "requer referência do narrador" (ADR 0001).

insert into reference_powers (discipline_id, level, name, summary, amalgam, prerequisites, verification_status, source_document, source_page) values
-- Animalismo
('animalism', 1, 'Vínculo com o Fâmulo', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('animalism', 2, 'Mensageiro Animal', 'O fâmulo do vampiro carrega uma mensagem curta a um alvo designado; quem está por perto ouve a mensagem como se fosse a voz do mestre do fâmulo.', 'Auspícios 1', null, 'verified_from_source', 'players_guide.pdf', '69'),
('animalism', 3, 'Comando do Mensageiro', 'Permite usar Compelir ou Mesmerizar através de uma mensagem carregada pelo fâmulo, impondo a vontade do vampiro sobre o alvo da mensagem.', 'Dominação 1', 'Mensageiro Animal, Compelir ou Mesmerizar', 'verified_from_source', 'players_guide.pdf', '69'),
('animalism', 3, 'Praga de Feras', 'O vampiro marca um alvo, fazendo com que animais e vermes da região o persigam e atrapalhem durante a noite toda.', null, null, 'verified_from_source', 'players_guide.pdf', '69'),
('animalism', 4, 'Comandar o Rebanho', 'O vampiro influencia o humor geral dos animais numa área ampla, de indiferença sonolenta a agressão generalizada.', null, null, 'verified_from_source', 'players_guide.pdf', '70'),
('animalism', 5, 'Acalmar o Temperamento Bestial', 'O vampiro exerce influência sutil sobre a Fera de todos os vampiros próximos, podendo instigar ou reprimir os instintos vampíricos de todos ao redor.', null, null, 'verified_from_source', 'players_guide.pdf', '70'),

-- Auspícios
('auspex', 1, 'Sentir o Invisível', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('auspex', 2, 'Panaceia', 'O vampiro acalma a turbulência mental ou emocional do alvo, restaurando um pouco de sua firmeza — especialmente eficaz em mortais.', 'Fortitude 1', null, 'verified_from_source', 'players_guide.pdf', '70'),
('auspex', 2, 'Revelar Temperamento', 'O vampiro sente a Ressonância do alvo, incluindo Discrasias no sangue, e se o alvo é vampiro, a Ressonância da última pessoa de quem ele se alimentou.', null, null, 'verified_from_source', 'players_guide.pdf', '70'),
('auspex', 3, 'Falha Fatal', 'Observando o trabalho sutil da entropia, o vampiro identifica uma falha nas defesas do alvo — uma rachadura na fachada mental ou uma fraqueza física real.', 'Oblívio 1', null, 'verified_from_source', 'players_guide.pdf', '71'),
('auspex', 5, 'Aliviar a Alma Bestial', 'O vampiro compartilha parte de sua serenidade moral com um Amaldiçoado arrependido, restaurando certo alívio de remorso e contendo a Fera — ao custo de acorrentar parte da mente do usuário à do sujeito.', 'Dominação 3', 'Panaceia', 'verified_from_source', 'players_guide.pdf', '71'),

-- Feitiçaria de Sangue
('blood_sorcery', 1, 'Um Gosto de Sangue', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('blood_sorcery', 2, 'Vasculhar Segredos', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),

-- Rapidez (Celerity/Celeridade — nomenclatura da crônica)
('celerity', 1, 'Graça Felina', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('celerity', 1, 'Reflexos Rápidos', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('celerity', 2, 'Trabalho Relâmpago', 'O vampiro realiza tarefas demoradas (reparos, escrita, construção) com velocidade sobrenatural — a concentração necessária impede usar essa velocidade em ataque.', null, null, 'verified_from_source', 'players_guide.pdf', '72'),
('celerity', 3, 'Esquiva Tecida', 'O vampiro percebe projéteis (facas, balas) como lentos o bastante para desviar com facilidade, sem sofrer penalidade por múltiplos ataques à distância.', null, 'Reflexos Rápidos', 'verified_from_source', 'players_guide.pdf', '72'),
('celerity', 4, 'Borrão Veloz', 'O movimento do vampiro vira um borrão trêmulo, dificultando enormemente acertá-lo mesmo em ataques surpresa ou quando ele não está se defendendo ativamente.', null, null, 'verified_from_source', 'players_guide.pdf', '72'),
('celerity', 5, 'Golpe Invisível', 'Combina desaparecer da vista com velocidade sobrenatural para se mover instantaneamente até um inimigo e desferir um golpe fatal.', 'Ofuscação 4', 'Golpe inicial de Rapidez (Blink)', 'verified_from_source', 'players_guide.pdf', '73'),

-- Dominação
('dominate', 1, 'Compelir', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('dominate', 1, 'Nublar Memória', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('dominate', 1, 'Devoção Servil', 'Vítimas já sob o domínio mental do vampiro têm a mente fortalecida contra interferência de outros Amaldiçoados.', 'Fortitude 1', null, 'verified_from_source', 'players_guide.pdf', '73'),
('dominate', 2, 'Favor do Domador', 'Um escravo condicionado com um Laço de Sangue tem mais dificuldade de agir contra o mestre — testes de resistência ao Laço sofrem penalidade.', null, null, 'verified_from_source', 'players_guide.pdf', '74'),
('dominate', 2, 'Implantar Sugestão', 'O vampiro muda temporariamente a personalidade ou as opiniões de um alvo, fazendo-o desejar, abandonar ou desconfiar de algo específico.', 'Presença 1', null, 'verified_from_source', 'players_guide.pdf', '74'),
('dominate', 2, 'Mesmerizar', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('dominate', 4, 'Domínio Ancestral', 'Vampiros de grande idade e potência conseguem exercer a vontade através do Sangue, sem precisar de contato visual ou comunicação verbal, compelindo um descendente de sangue.', 'Feitiçaria de Sangue 2', 'Mesmerizar', 'verified_from_source', 'players_guide.pdf', '74'),

-- Fortitude
('fortitude', 1, 'Resiliência', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('fortitude', 1, 'Mente Inabalável', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('fortitude', 2, 'Perseverança da Terra', 'O vampiro se torna quase impossível de mover enquanto ativo, ancorando-se na permanência da terra — não o torna resistente a dano.', null, null, 'verified_from_source', 'players_guide.pdf', '74'),
('fortitude', 2, 'Vitae Revigorante', 'O vampiro fortalece a capacidade do próprio sangue de curar feridas e doenças — seres vivos que bebem sua vitae se recuperam com velocidade surpreendente.', 'Auspícios 1', null, 'verified_from_source', 'players_guide.pdf', '75'),
('fortitude', 3, 'Valeren', 'O vampiro projeta sua Fortitude para fora, usando o poder do próprio sangue para curar o corpo ferido de outro vampiro.', 'Auspícios 1', null, 'verified_from_source', 'players_guide.pdf', '75'),
('fortitude', 4, 'Escamas da Górgona', 'A Ressonância do sangue mais recente concede ao vampiro imunidades ou resistências específicas contra poderes de outros Amaldiçoados ou fraquezas comuns da espécie.', null, null, 'verified_from_source', 'players_guide.pdf', '75'),

-- Ofuscação
('obfuscate', 1, 'Silêncio da Morte', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('obfuscate', 1, 'Manto de Sombras', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('obfuscate', 2, 'Quimerismo', 'O vampiro cria alucinações breves e vívidas que distraem e atraem a atenção de quem é afetado — qualquer sentido, mas sempre breve.', 'Presença 1', null, 'verified_from_source', 'players_guide.pdf', '76'),
('obfuscate', 2, 'Passagem Invisível', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('obfuscate', 3, 'Fata Morgana', 'O vampiro cria alucinações elaboradas que fazem qualquer um nas proximidades ver, ouvir e sentir o que o usuário desejar — sem limite de número de vítimas simultâneas.', 'Presença 2', null, 'verified_from_source', 'players_guide.pdf', '77'),
('obfuscate', 3, 'Labirinto Mental', 'Remove todo o senso de direção e localização de uma vítima, prendendo-a em seu ambiente atual — um lar, uma boate, uma masmorra vampírica.', 'Dominação 1', null, 'verified_from_source', 'players_guide.pdf', '77'),
('obfuscate', 4, 'Máscara Mental', 'O vampiro cria a ilusão de uma persona completamente diferente, escondendo pensamentos e sentimentos reais de quem usa habilidades sobrenaturais para ler sua mente ou aura.', 'Dominação 2', null, 'verified_from_source', 'players_guide.pdf', '78'),

-- Oblívio
('oblivion', 1, 'Cinzas às Cinzas', 'Permite destruir um cadáver (fresco ou antigo) introduzindo vitae do vampiro em seu corpo — não funciona em vampiros.', null, null, 'verified_from_source', 'players_guide.pdf', '85'),
('oblivion', 1, 'O Grilhão Vinculante', 'O vampiro identifica objetos ou locais importantes para fantasmas — esses "grilhões" funcionam como âncoras que prendem os mortos à existência.', null, null, 'verified_from_source', 'players_guide.pdf', '85'),
('oblivion', 1, 'Visão do Oblívio', 'Os olhos do vampiro ficam negros, permitindo enxergar na escuridão total e perceber fantasmas que não estejam ativamente se escondendo.', null, null, 'verified_from_source', 'players_guide.pdf', '85'),
('oblivion', 1, 'Manto de Sombra', 'Aplicando sutilmente a influência do Oblívio sobre sombras ambientes, o usuário disfarça sua aparência ou parece mais sinistro e ameaçador.', null, null, 'verified_from_source', 'players_guide.pdf', '85'),
('oblivion', 2, 'Predição Fatal', 'O vampiro tece fios invisíveis de entropia sobre um alvo mortal, aumentando a chance de ele sofrer dano ou morte dentro de um dia — sem poder interagir com a vítima.', 'Auspícios 2', null, 'verified_from_source', 'players_guide.pdf', '87'),
('oblivion', 2, 'Projeção de Sombra', 'Conjura uma sombra sobrenatural do corpo do vampiro, usada como base para manifestar outros poderes de Oblívio mesmo sem sombras ambientes disponíveis.', null, null, 'verified_from_source', 'players_guide.pdf', '87'),
('oblivion', 2, 'Onde o Véu Se Afina', 'Vampiros afinados com o Oblívio sentem onde o véu entre o mundo dos vivos e o mundo dos mortos está mais fraco numa área.', null, null, 'verified_from_source', 'players_guide.pdf', '87'),
('oblivion', 4, 'Prender o Espírito', 'Cerimônia que prende um fantasma já compelido a um local ou pessoa específica, usando o grilhão do fantasma, sacrifício humano e sal.', null, 'Praga Necrótica', 'verified_from_source', 'players_guide.pdf', '96'),
('oblivion', 4, 'Rasgar o Véu', 'Cerimônia que cria uma fenda no véu pela qual fantasmas podem atravessar, reduzindo temporariamente a densidade do véu num local.', null, 'Praga Necrótica', 'verified_from_source', 'players_guide.pdf', '97'),
('oblivion', 5, 'Bênção Lazarena', 'Cerimônia que permite trazer de volta um corpo recém-morto à vida — ainda que não exatamente como os vivos o lembravam.', null, 'Desejo Cumprido', 'verified_from_source', 'players_guide.pdf', '97'),

-- Potência
('potence', 1, 'Corpo Letal', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('potence', 1, 'Salto Voador', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('potence', 2, 'Garra Implacável', 'O aperto do vampiro fica impossivelmente forte — uma vez segurando algo, é quase impossível de soltar, exceto por desmembramento.', null, null, 'verified_from_source', 'players_guide.pdf', '79'),
('potence', 3, 'Demolidor', 'Permite exercer força violenta e indiscriminada sobre um objeto estático para esmagar, destruir ou arrombar — inútil em combate pela demora.', null, 'Destreza (Prowess)', 'verified_from_source', 'players_guide.pdf', '79'),
('potence', 4, 'Queda Esmagadora', 'Ao usar o Salto Voador, o vampiro pode parar abruptamente no local, causando dano a quem estiver próximo do pouso.', null, 'Salto Voador', 'verified_from_source', 'players_guide.pdf', '79'),
('potence', 5, 'Martelo Sutil', 'Todo o corpo do vampiro passa a projetar a soma de sua força — um toque de dedo equivale a um soco de corpo inteiro.', null, null, 'verified_from_source', 'players_guide.pdf', '79'),

-- Presença
('presence', 1, 'Deslumbrar', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('presence', 1, 'Intimidar', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('presence', 1, 'Olhos da Serpente', 'Os olhos do vampiro viram órbitas fendidas como as de uma serpente, capazes de paralisar um mortal (ou até outro vampiro) que encare seu olhar.', 'Metamorfose 1', null, 'verified_from_source', 'players_guide.pdf', '80'),
('presence', 2, 'Melpomineia', 'A voz do usuário se torna como a de uma sereia, capaz de encantar ou aterrorizar por si só, sem exigir presença física nem contato visual.', null, null, 'verified_from_source', 'players_guide.pdf', '80'),
('presence', 2, 'Beijo Persistente', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '68'),
('presence', 3, 'Voz Projetada', 'O vampiro faz sua voz emanar de qualquer ponto à vista, como sussurro ou grito, podendo até deixá-la ecoando num local para atrair ou assustar.', 'Auspícios 1', null, 'verified_from_source', 'players_guide.pdf', '80'),
('presence', 4, 'Impregnar o Edifício', 'Enquanto presente num prédio, o vampiro estende poderes de Presença através da própria estrutura — qualquer um dentro ou olhando para o prédio é afetado.', null, null, 'verified_from_source', 'players_guide.pdf', '80'),

-- Metamorfose
('protean', 1, 'Olhos da Fera', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('protean', 1, 'Peso da Pena', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('protean', 2, 'Armas Ferais', null, null, null, 'requires_reference', 'players_guide.pdf (Iconic Characters)', '67'),
('protean', 2, 'Vicissitude', 'Rara fora do clã Tzimisce, permite exigir obediência da própria carne — pele, músculos e até ossos podem ser esculpidos ou deformados, ao custo de pontos de Atributo Físico.', 'Dominação 2', null, 'verified_from_source', 'players_guide.pdf', '82'),
('protean', 3, 'Escultura de Carne', 'Estende a maestria sobre a carne para o corpo de outros — poder temido, com reputação de tortura desumana, mas também usado para adaptar servos e aliados.', 'Dominação 2', 'Vicissitude', 'verified_from_source', 'players_guide.pdf', '82');

-- Tipos de Predador — verificado (Vampire Traits and Types Summary
-- Sheet, impressa 63). As duas Disciplinas de cada tipo são sugestão de
-- escolha, não bônus automático — documento mestre: "não aplicar
-- bônus indevidos" antes de verificar o texto mecânico completo.
-- Três tipos têm bônus de ficha pré-pronta confirmados (Alleycat,
-- Bagger, Siren, p.66) e entram com summary mais específico.
insert into reference_predator_types (id, name, disciplines, summary, source_document, source_page) values
('alleycat', 'Alleycat', array['celerity','potence'], 'Toma sangue por força ou ameaça. Exemplo de ficha pronta confirma: Potência 1 (Corpo Letal) + Antecedente Contatos (Criminosos) 3.', 'players_guide.pdf', '63'),
('bagger', 'Bagger', array['blood_sorcery','obfuscate'], 'Adquire sangue preservado ou morto em vez de caçar. Exemplo de ficha pronta confirma: Ofuscação 1 (Manto de Sombras) + Mérito de alimentação Iron Gullet 3 + Defeito Inimigo 2.', 'players_guide.pdf', '63'),
('blood_leech', 'Blood Leech', array['celerity','protean'], 'Alimenta-se de outros vampiros.', 'players_guide.pdf', '63'),
('cleaver', 'Cleaver', array['dominate','animalism'], 'Toma sangue secretamente da própria família mortal.', 'players_guide.pdf', '63'),
('consensualist', 'Consensualist', array['auspex','fortitude'], 'Toma sangue com consentimento.', 'players_guide.pdf', '63'),
('extortionist', 'Extortionist', array['dominate','potence'], 'Força mortais a pagar em sangue por serviços ou proteção.', 'players_guide.pdf', '63'),
('farmer', 'Farmer', array['animalism','protean'], 'Alimenta-se de animais.', 'players_guide.pdf', '63'),
('graverobber', 'Graverobber', array['fortitude','oblivion'], 'Ronda hospitais e necrotérios em busca de vítimas.', 'players_guide.pdf', '63'),
('grim_reaper', 'Grim Reaper', array['auspex','oblivion'], 'Alimenta-se de quem está prestes a morrer.', 'players_guide.pdf', '63'),
('montero', 'Montero', array['dominate','obfuscate'], 'Usa capangas/retentores para conduzir a presa até si.', 'players_guide.pdf', '63'),
('osiris', 'Osiris', array['blood_sorcery','presence'], 'Alimenta-se do próprio culto ou seguidores.', 'players_guide.pdf', '63'),
('pursuer', 'Pursuer', array['animalism','auspex'], 'Estuda e persegue a vítima antes de atacar.', 'players_guide.pdf', '63'),
('sandman', 'Sandman', array['auspex','obfuscate'], 'Alimenta-se de vítimas adormecidas.', 'players_guide.pdf', '63'),
('scene_queen', 'Scene Queen', array['dominate','potence'], 'Alimenta-se da própria subcultura ou grupo exclusivo.', 'players_guide.pdf', '63'),
('siren', 'Siren', array['fortitude','presence'], 'Alimenta-se seduzindo as vítimas. Exemplo de ficha pronta confirma: Presença 1 (Deslumbrar) + Mérito de Visual Beautiful 2 + Defeito Inimigo 1.', 'players_guide.pdf', '63'),
('trapdoor', 'Trapdoor', array['protean','obfuscate'], 'Fica à espreita no próprio ninho e atrai a presa até ele.', 'players_guide.pdf', '63');

-- Vantagens/Defeitos — amostra verificada (ADR 0005: só migration,
-- sem UI de admin no MVP). Méritos/Defeitos específicos de Caitiff
-- (impressa 126-128) e amostra genérica (impressa 118, já registrada
-- em docs/V5_RULES_MATRIX.md §8).
insert into reference_advantages (kind, name, dots_min, dots_max, summary, lineage_restriction, source_document, source_page) values
('merit', 'Rosto Famoso', 1, 1, 'Mérito de Visual (Looks) — rosto amplamente reconhecido socialmente.', null, 'players_guide.pdf', '118'),
('merit', 'Ingênue', 1, 1, 'Mérito de Visual (Looks).', null, 'players_guide.pdf', '118'),
('merit', 'Traço Marcante', 1, 1, 'Mérito de Visual (Looks) — uma característica física distintiva e memorável.', null, 'players_guide.pdf', '118'),
('merit', 'Reconhecimento de Vaso', 1, 1, 'Mérito de alimentação (Feeding) — reconhece vasos/presas ideais com facilidade.', null, 'players_guide.pdf', '118'),
('merit', 'Segredos da Cidade', 1, 1, 'Mérito do tipo Antecedente — conhecimento privilegiado de segredos urbanos.', null, 'players_guide.pdf', '118'),
('merit', 'Tio Presas', 3, 3, 'Caitiff tem acesso fácil a uma coorte local de 3 a 5 Sangue-Ralo, tratada como grupo de Aliados (ainda que morto-vivo). Não pode ser escolhido com Liquidator.', 'caitiff', 'players_guide.pdf', '127'),
('flaw', 'Sangue Corruptor', 2, 2, 'Caitiff: ao Abraçar ou matar mortais por alimentação, eles retornam como corpos desesperados e famintos (tratados como Carniçal ou, em casos raros, Espectro Vivente).', 'caitiff', 'players_guide.pdf', '127'),
('flaw', 'Maldição do Clã', 2, 2, 'Caitiff sofre a fraqueza (bane) do clã do próprio senhor, com severidade reduzida pela metade (arredondado para baixo, mínimo 1).', 'caitiff', 'players_guide.pdf', '127'),
('flaw', 'Peão de Dívida', 2, 2, 'Caitiff deve favores (boons) a um vampiro de Status alto, cobrados sem critério e quase impossíveis de quitar; recusa pode render o Defeito Execrado ou mesmo um Blood Hunt.', 'caitiff', 'players_guide.pdf', '127'),
('flaw', 'Liquidator', 1, 1, 'Sangue-Ralo chamam o Caitiff de traidor e evitam contato; penalidade de dois dados em testes sociais contra Sangue-Ralo. Não pode ser escolhido com Tio Presas.', 'caitiff', 'players_guide.pdf', '127'),
('flaw', 'Sangue Confuso', 1, 1, 'O sangue do Caitiff não reconhece a própria natureza — mesmo já possuindo uma Disciplina, precisa beber o sangue de alguém que a possua para comprar novos pontos nela.', 'caitiff', 'players_guide.pdf', '127'),
('flaw', 'Presságio Ambulante', 2, 2, 'Premonições e adivinhações alheias na área do Caitiff tendem a apontar para ele como fonte de desgraça, atraindo a atenção de oráculos e supersticiosos.', 'caitiff', 'players_guide.pdf', '127'),
('flaw', 'Marcado por Palavras', 1, 1, 'O corpo do Caitiff carrega textos antigos de lore vampírica, atraindo forças que querem usar ou destruir esse conhecimento.', 'caitiff', 'players_guide.pdf', '128');
