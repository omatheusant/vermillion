-- Catálogo de referência — docs/DATA_MODEL.md §4.
-- Conteúdo autoral da crônica Vermillion (texto de Lord Nariffin, narrador,
-- enviado via Discord em 14/11/2026) — não é tradução nem reprodução do
-- Players Guide; é a descrição própria desta crônica para cada clã,
-- incluindo a nomenclatura local "Rapidez" para a Disciplina conhecida
-- na fonte oficial como Celeridade/Celerity (ver docs/V5_RULES_MATRIX.md
-- §2 para a tabela verificada contra a fonte local, mantida como
-- referência cruzada). Caitiff e Sangue-Ralo são linhagens sem clã fixo
-- (coluna characters.lineage) e por isso NÃO têm linha em reference_clans
-- — são tratadas no wizard/Códice como opções próprias, não como entradas
-- de catálogo (ADR 0004 para o escopo de Sangue-Ralo).

create table reference_disciplines (
  id text primary key,
  name text not null,
  clans text[] not null default '{}',
  source_document text,
  source_page text,
  created_at timestamptz not null default now()
);

create table reference_clans (
  id text primary key,
  name text not null,
  epithet text,
  flavor_text text,
  strengths_summary text,
  bane_summary text,
  compulsion_summary text,
  disciplines text[] not null default '{}',
  -- Afiliações típicas, meramente informativas — a seleção de seita no
  -- wizard nunca é restrita ou forçada por clã (documento mestre §
  -- "Seitas/afiliação política").
  typical_affiliations text[] not null default '{}',
  source_document text not null,
  source_page text,
  created_at timestamptz not null default now()
);

create type reference_verification_status as enum ('verified_from_source', 'requires_reference');

create table reference_powers (
  id uuid primary key default gen_random_uuid(),
  discipline_id text not null references reference_disciplines(id),
  level smallint not null check (level between 1 and 5),
  name text not null,
  summary text not null,
  prerequisites text,
  amalgam text,
  -- ADR 0001: só entram no wizard como selecionáveis pelo jogador quando
  -- verified_from_source; requires_reference é placeholder de progressão.
  verification_status reference_verification_status not null default 'requires_reference',
  source_document text,
  source_page text,
  created_at timestamptz not null default now()
);

create index idx_reference_powers_discipline on reference_powers(discipline_id);

create type reference_advantage_kind as enum ('merit', 'flaw', 'background');

create table reference_advantages (
  id uuid primary key default gen_random_uuid(),
  kind reference_advantage_kind not null,
  name text not null,
  dots_min smallint not null default 1,
  dots_max smallint not null default 5,
  summary text not null,
  lineage_restriction text,
  source_document text,
  source_page text,
  created_at timestamptz not null default now()
);

create table reference_predator_types (
  id text primary key,
  name text not null,
  disciplines text[] not null default '{}',
  summary text not null,
  source_document text,
  source_page text,
  created_at timestamptz not null default now()
);

-- Disciplinas citadas pelos 14 clãs da crônica + Alquimia de Sangue-Ralo
-- (exclusiva de Sangue-Ralo, tratada fora do catálogo de Disciplinas de
-- clã — ADR 0004). Nomes conforme docs/V5_RULES_MATRIX.md §3.
insert into reference_disciplines (id, name, clans, source_document, source_page) values
  ('animalism', 'Animalismo', array['gangrel','nosferatu','ravnos','tzimisce'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('auspex', 'Auspícios', array['hecata','malkavian','toreador','tremere','salubri'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('blood_sorcery', 'Feitiçaria de Sangue', array['banu_haqim','tremere'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('celerity', 'Rapidez', array['banu_haqim','brujah','toreador'], 'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)', null),
  ('dominate', 'Dominação', array['malkavian','salubri','tremere','tzimisce','ventrue','lasombra'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('fortitude', 'Fortitude', array['gangrel','hecata','salubri','ventrue'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('obfuscate', 'Ofuscação', array['malkavian','nosferatu','ravnos','banu_haqim','ministry'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('oblivion', 'Oblívio', array['hecata','lasombra'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('potence', 'Potência', array['brujah','lasombra','nosferatu'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('presence', 'Presença', array['brujah','ministry','ravnos','toreador','ventrue'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('protean', 'Metamorfose', array['gangrel','ministry','tzimisce'], 'players_guide.pdf (Summary Sheet)', '62-64'),
  ('thin_blood_alchemy', 'Alquimia de Sangue-Ralo', array[]::text[], 'players_guide.pdf', '98-105');

insert into reference_clans (id, name, flavor_text, strengths_summary, bane_summary, disciplines, typical_affiliations, source_document) values
(
  'brujah', 'Brujah',
  'Há sangue que ferve mesmo depois que o coração deixa de bater. Os Brujah são a chama da revolta, os punhos erguidos contra os tiranos e as vozes que desafiam os tronos da eternidade. Foram filósofos, guerreiros e sonhadores, mas os séculos transformaram muitos de seus ideais em fúria. Onde existe uma corrente, haverá um Brujah disposto a quebrá-la.' || E'\n\n' ||
  'Entretanto, a mesma paixão que lhes concede força também os condena. A raiva é uma amante cruel, e poucos entre eles conseguem resistir aos seus encantos. Lutam pela liberdade de todos, mas permanecem escravos da própria natureza.',
  'Velocidade, força física e carisma sobrenatural. Excelentes combatentes e agitadores políticos.',
  'Temperamento violento. Possuem maior dificuldade para resistir ao frenesi de fúria.',
  array['celerity','potence','presence'],
  array['anarch','independent'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'gangrel', 'Gangrel',
  'Muito antes das cidades erguerem suas torres, a noite já pertencia aos predadores. Os Gangrel conhecem essa verdade melhor do que qualquer outro clã. São filhos das florestas, companheiros das feras e viajantes de terras esquecidas. Enquanto outros vampiros disputam palácios e coroas, eles encontram seu reino sob o céu estrelado, onde apenas os mais fortes sobrevivem.' || E'\n\n' ||
  'Mas a natureza sempre cobra seu preço. A cada vez que cedem à fera interior, tornam-se um pouco mais semelhantes às criaturas que tanto compreendem. Talvez, no fim, descubram que a diferença entre homem e animal nunca foi tão grande assim.',
  'Resistência, transformação animal e domínio de criaturas. Especialistas em sobrevivência.',
  'Desenvolvem características animalescas quando entram em frenesi, prejudicando determinados atributos.',
  array['animalism','fortitude','protean'],
  array['anarch','independent'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'malkavian', 'Malkavian',
  'Há verdades que a mente humana jamais deveria compreender. Os Malkavianos contemplam essas verdades através de um espelho quebrado, enxergando padrões onde outros veem apenas caos. Profetas, visionários e portadores de segredos impossíveis, caminham entre o conhecimento e o delírio, sussurrando respostas para perguntas que ainda não foram feitas.' || E'\n\n' ||
  'Contudo, todo conhecimento exige um sacrifício. Suas mentes carregam uma fratura que nem mesmo a eternidade pode curar. Talvez sejam loucos, talvez sejam os únicos capazes de enxergar o mundo como realmente é. A tragédia está em nunca saber ao certo.',
  'Percepção sobrenatural, leitura de pensamentos, dominação mental e ocultação.',
  'Uma percepção fraturada da realidade, que pode prejudicar determinadas categorias de testes.',
  array['auspex','dominate','obfuscate'],
  array['camarilla'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'nosferatu', 'Nosferatu',
  'A eternidade não oferece beleza a todos os seus escolhidos. Sob as ruas iluminadas, entre túneis esquecidos e paredes úmidas, vivem aqueles cuja aparência revela a monstruosidade que os demais escondem. Os Nosferatu são sombras entre as sombras, observadores silenciosos que conhecem os segredos mais íntimos de reis, mendigos e assassinos.' || E'\n\n' ||
  'Condenados a carregar no rosto a marca de sua maldição, aprenderam que a informação pode ser mais poderosa que qualquer espada. Enquanto os belos governam os salões, os deformados escutam através das paredes. E, na noite certa, um segredo pode derrubar um império.',
  'Espionagem, invisibilidade sobrenatural, força física e redes de informação.',
  'Aparência monstruosa que dificulta interações sociais e exige cuidado constante com a Máscara.',
  array['animalism','obfuscate','potence'],
  array['camarilla','anarch'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'toreador', 'Toreador',
  'Mesmo na morte, alguns corações continuam apaixonados pela beleza. Os Toreador são amantes da arte, da paixão e de tudo aquilo que torna a existência digna de contemplação. Entre pinturas imortais, melodias esquecidas e rostos de perfeição passageira, procuram desesperadamente algo capaz de preencher o vazio deixado pela própria humanidade.' || E'\n\n' ||
  'Mas a beleza é uma prisão construída com pétalas de rosa. Aquilo que os fascina também pode dominá-los, e cada maravilha contemplada serve como lembrança cruel de tudo que perderam. São eternos admiradores de uma vida que já não lhes pertence.',
  'Sedução, influência social, sentidos aguçados e velocidade sobrenatural.',
  'Sofrem em ambientes esteticamente desagradáveis, com penalidades relacionadas à sua sensibilidade estética.',
  array['auspex','celerity','presence'],
  array['camarilla'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'tremere', 'Tremere',
  'Existem aqueles que recebem a imortalidade como uma maldição, e aqueles que ousam roubá-la dos próprios deuses. Os Tremere pertencem aos últimos. Eruditos, alquimistas e mestres das artes ocultas, transformaram o sangue em instrumento de poder e conhecimento. Para eles, os mistérios da noite não existem para serem temidos, mas para serem decifrados e dominados.' || E'\n\n' ||
  'Entretanto, a ambição possui raízes profundas, e o poder conquistado através da traição raramente permanece incontestado. Entre juramentos quebrados e antigas hierarquias em ruínas, os feiticeiros descobriram que até mesmo os maiores mestres podem perder o controle sobre suas próprias criações.',
  'Feitiçaria de Sangue, rituais, conhecimento ocultista e manipulação mental.',
  'Sangue deficiente para estabelecer Laços de Sangue, enfraquecendo uma importante ferramenta de controle.',
  array['auspex','dominate','blood_sorcery'],
  array['camarilla','anarch'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'ventrue', 'Ventrue',
  'Alguns nascem para governar. Outros simplesmente se recusam a aceitar qualquer posição inferior. Os Ventrue caminham pela eternidade como reis sem coroas, comandando impérios financeiros, instituições e cortes vampíricas com a mesma naturalidade com que respiravam em vida. Para eles, o poder não é um privilégio, mas uma responsabilidade que somente os dignos deveriam carregar.' || E'\n\n' ||
  'Por trás de sua elegância, entretanto, existe uma arrogância tão antiga quanto suas linhagens. Seu sangue exige distinção até mesmo na alimentação, recusando aquilo que considera indigno. São senhores de incontáveis vidas, mas prisioneiros dos próprios padrões de excelência.',
  'Liderança, influência econômica, dominação mental e resistência sobrenatural.',
  'Alimentação seletiva. Cada Ventrue consegue obter sustento apenas de um tipo específico de sangue.',
  array['dominate','fortitude','presence'],
  array['camarilla'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'banu_haqim', 'Banu Haqim',
  'Nas sombras da história, onde os culpados acreditam estar seguros, caminham aqueles que trazem a sentença na ponta de uma lâmina. Os Banu Haqim são juízes, estudiosos e executores, herdeiros de uma tradição que mistura disciplina, fé e justiça. Não procuram necessariamente a aprovação dos poderosos, pois acreditam responder a princípios mais antigos que qualquer trono.' || E'\n\n' ||
  'Mas a justiça pode se tornar indistinguível da vingança quando é aplicada por mãos sedentas. O sangue dos próprios vampiros os tenta com uma intensidade terrível, transformando cada julgamento em uma batalha contra a fome. Afinal, quem poderá julgar os juízes quando eles próprios sucumbirem?',
  'Assassinato, velocidade, furtividade e Feitiçaria de Sangue.',
  'O sangue de outros vampiros é especialmente tentador, podendo provocar frenesi de fome.',
  array['blood_sorcery','celerity','obfuscate'],
  array['camarilla'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'lasombra', 'Lasombra',
  'O poder verdadeiro não precisa de luz para ser reconhecido. Os Lasombra compreenderam isso há séculos, moldando sua existência através da ambição, da disciplina e da conquista. São nobres da escuridão, manipuladores de homens e monstros, capazes de fazer das próprias sombras uma extensão de sua vontade. Para eles, a fraqueza não merece compaixão, mas superação.' || E'\n\n' ||
  'Contudo, a escuridão que comandam também os reclama como seus. Espelhos e máquinas parecem rejeitar sua presença, como se o próprio mundo hesitasse em reconhecê-los. Talvez seja esse o preço de desejar tanto o poder: conquistar tudo, apenas para descobrir que a própria existência começa a desaparecer.',
  'Manipulação das sombras, dominação mental, força física e liderança implacável.',
  'Imagens e gravações distorcidas, completa ausência de reflexo, além de uma sensibilidade ainda maior à luz solar.',
  array['dominate','oblivion','potence'],
  array['camarilla','sabbat'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'hecata', 'Hecata',
  'A morte deveria ser o fim de todas as histórias. Para os Hecata, ela é apenas o começo de uma conversa. Herdeiros de antigas famílias, cultos e tradições necromânticas, caminham entre os vivos e os mortos como mercadores de segredos proibidos. Onde outros enxergam túmulos silenciosos, eles encontram portas esperando para serem abertas.' || E'\n\n' ||
  'Mas ninguém contempla o abismo impunemente. Sua própria mordida transforma o prazer da alimentação em sofrimento, lembrando que sua intimidade com a morte jamais será gentil. Conhecem os mistérios do além como poucos, mas talvez sejam justamente aqueles que mais deveriam temer o que existe do outro lado.',
  'Necromancia, comunicação com espíritos, resistência e conhecimento sobre a morte.',
  'Sua mordida é extremamente dolorosa, dificultando a alimentação discreta.',
  array['auspex','fortitude','oblivion'],
  array['independent'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'ministry', 'Ministério',
  'Toda alma possui um desejo secreto, uma pequena fraqueza escondida atrás de virtudes e promessas. O Ministério conhece essas fraquezas e sabe exatamente como despertá-las. Sacerdotes da tentação, pregadores da libertação e mestres da corrupção, oferecem aos perdidos aquilo que mais desejam ouvir: que não existe pecado em abraçar a própria natureza.' || E'\n\n' ||
  'Entretanto, nem mesmo os tentadores escapam de suas correntes. A luz lhes causa um sofrimento particular, como se a própria existência rejeitasse aquilo que poderia revelar seus segredos. Pregam a liberdade através da transgressão, mas poucos percebem quando a libertação se transforma em uma nova forma de escravidão.',
  'Manipulação religiosa, sedução, furtividade e poderes de transformação.',
  'Vulnerabilidade sobrenatural à luz intensa, incluindo iluminação artificial forte.',
  array['obfuscate','presence','protean'],
  array['anarch'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'ravnos', 'Ravnos',
  'A noite é vasta demais para pertencer a um único lugar. Os Ravnos são viajantes de estradas esquecidas, mestres das ilusões e contadores de histórias que jamais deveriam ser tomadas como verdades absolutas. Sua existência é feita de movimento, astúcia e liberdade, deixando atrás de si apenas lembranças incertas e perguntas sem resposta.' || E'\n\n' ||
  'Mas há uma chama cruel escondida em seu sangue, uma herança que os impede de encontrar repouso duradouro. São condenados a seguir adiante, mesmo quando tudo que desejam é permanecer. Talvez por isso compreendam melhor que qualquer outro clã a tragédia de possuir a eternidade sem jamais encontrar um lar.',
  'Ilusões, enganação, mobilidade, furtividade e manipulação de animais.',
  'Não podem permanecer dormindo repetidamente no mesmo lugar sem sofrer os efeitos de sua maldição sobrenatural.',
  array['animalism','obfuscate','presence'],
  array['independent','anarch'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'tzimisce', 'Tzimisce',
  'Há criaturas que aceitam os limites impostos pela natureza. Os Tzimisce não estão entre elas. Senhores de castelos esquecidos, mestres da carne e escultores de horrores inimagináveis, enxergam o corpo como uma obra inacabada, esperando pelas mãos de um artista suficientemente ousado. Para eles, a perfeição não é encontrada: é construída, mesmo que através da dor.' || E'\n\n' ||
  'Entretanto, aqueles que desejam possuir tudo acabam possuídos por suas próprias obsessões. Suas terras, seus tesouros e seus domínios tornam-se correntes invisíveis, prendendo-os àquilo que reivindicam como seu. São dragões sobre montanhas de ouro, incapazes de abandonar o próprio tesouro.',
  'Transformação da carne, controle territorial, dominação e metamorfose monstruosa.',
  'Precisam descansar próximos de algo que consideram sua posse ou domínio, conforme as exigências de sua maldição.',
  array['animalism','dominate','protean'],
  array['sabbat','independent'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
),
(
  'salubri', 'Salubri',
  'Entre os incontáveis monstros que caminham pela noite, existem aqueles que ainda ousam procurar a redenção. Os Salubri são herdeiros de uma linhagem quase esquecida, marcada pelo conhecimento, pela compaixão e por um misterioso terceiro olho. Curandeiros e buscadores da iluminação, carregam a esperança de que até mesmo uma alma condenada possa encontrar algum significado na eternidade.' || E'\n\n' ||
  'Mas a bondade é uma virtude perigosa entre predadores. Perseguidos, difamados e desejados pelo próprio sangue, os Salubri aprenderam que a misericórdia pode custar mais que a crueldade. Talvez sejam santos entre monstros, ou apenas monstros que ainda não desistiram de ser santos.',
  'Percepção sobrenatural, poderes de cura e resistência.',
  'Seu sangue é particularmente tentador para outros vampiros, e a utilização de Disciplinas pode provocar o aparecimento de seu terceiro olho e lágrimas de sangue.',
  array['auspex','dominate','fortitude'],
  array['independent'],
  'Crônica Vermillion — texto autoral do narrador (Discord, 14/11/2026)'
);
