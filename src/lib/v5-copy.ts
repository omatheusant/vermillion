import type { AttributeId, SkillId } from "@/domain/v5";

/**
 * Textos curtos para os tooltips "?" (LoreTooltip) do wizard — resumo
 * autoral próprio, nunca cópia literal de parágrafo (docs/LEGAL.md §3).
 * Fonte: V5_Corebook_Extended.pdf, capítulo "Core Traits"/"Beliefs"
 * (p.155-173) — arquivo nunca versionado em git (.gitignore), igual ao
 * players_guide.pdf. Fica em código (não em reference_content) porque é
 * copy institucional da UI, não catálogo que o narrador precise editar
 * sem deploy (ADR 0005).
 */
export const SOURCE_DOCUMENT = "V5_Corebook_Extended.pdf";

export interface SourcedCopy {
  summary: string;
  sourcePage: string;
}

export const ATTRIBUTE_COPY: Record<AttributeId, SourcedCopy> = {
  strength: { summary: "Quanto você levanta, a força de seus golpes e o quanto consegue forçar o próprio corpo morto.", sourcePage: "155" },
  dexterity: { summary: "Agilidade, graça e reflexos — de desviar de um ataque a trabalhos manuais delicados sob pressão.", sourcePage: "155-156" },
  stamina: { summary: "Resistência física a dano e fadiga. Vigor + 3 define sua Saúde.", sourcePage: "156" },
  charisma: { summary: "Carisma e apelo natural — magnetismo que atrai pessoas e facilita a alimentação. Não depende de beleza física (isso é a Vantagem Visual).", sourcePage: "156" },
  manipulation: { summary: "Capacidade de distorcer a vontade dos outros, mentir com convicção e manipular sem ser notado.", sourcePage: "156" },
  composure: { summary: "Autocontrole emocional sob pressão. Compostura + Determinação define sua Força de Vontade.", sourcePage: "156" },
  intelligence: { summary: "Raciocínio lógico, pesquisa e capacidade de analisar informação.", sourcePage: "156" },
  wits: { summary: "Rapidez de reação e percepção de curto prazo diante de pouca informação.", sourcePage: "156-157" },
  resolve: { summary: "Foco e determinação mental. Compostura + Determinação define sua Força de Vontade.", sourcePage: "157" },
};

export const SKILL_COPY: Record<SkillId, SourcedCopy> = {
  athletics: { summary: "Correr, saltar, escalar e nadar — também substitui outra perícia de combate físico, mas sem causar dano.", sourcePage: "159-160" },
  brawl: { summary: "Golpear com os próprios punhos, pés ou garras, sem arma em mãos.", sourcePage: "160" },
  craft: { summary: "Criar e consertar objetos, da arte à função — de olaria a reforçar o próprio refúgio.", sourcePage: "160" },
  drive: { summary: "Dirigir com perícia, inclusive em perseguições e sob condições adversas.", sourcePage: "160" },
  firearms: { summary: "Familiaridade com armas de fogo — manejo, limpeza e recarga rápida.", sourcePage: "160-162" },
  larceny: { summary: "Arrombar fechaduras, desativar alarmes, furtar e avaliar falhas de segurança.", sourcePage: "163" },
  melee: { summary: "Lutar com armas de mão — facas, correntes, tacos e estacas.", sourcePage: "163-164" },
  stealth: { summary: "Perseguir um alvo, espionar e se camuflar sem ser notado.", sourcePage: "164" },
  survival: { summary: "Sobreviver ao ar livre e em condições adversas — orientação, abrigo improvisado, rastreamento.", sourcePage: "164" },
  animal_ken: { summary: "Acalmar, treinar ou provocar animais, e prever como vão reagir.", sourcePage: "164" },
  etiquette: { summary: "Reconhecer e seguir as convenções sociais da cena — tanto entre mortais quanto entre Kindred.", sourcePage: "164-165" },
  insight: { summary: "Ler linguagem corporal, perceber mentiras e entender o que motiva as pessoas.", sourcePage: "165" },
  intimidation: { summary: "Intimidar, coagir e ameaçar para conseguir o que quer socialmente.", sourcePage: "165" },
  leadership: { summary: "Liderar um grupo, inspirar aliados e comandar em momentos de crise.", sourcePage: "165-166" },
  performance: { summary: "Qualquer arte de palco — dança, música, comédia, oratória.", sourcePage: "166" },
  persuasion: { summary: "Convencer alguém com argumentos e apelo emocional, sem forçar nem enganar.", sourcePage: "166" },
  streetwise: { summary: "Transitar pela cultura das ruas e do submundo — gírias, contatos, código de conduta.", sourcePage: "166" },
  subterfuge: { summary: "Mentir de forma convincente, inventar desculpas boas e disfarçar intenções.", sourcePage: "166-168" },
  academics: { summary: "Educação formal e pesquisa em humanidades — história, literatura, direito.", sourcePage: "168" },
  awareness: { summary: "Perceber o que está fora do lugar — um som estranho, um objeto escondido, um perfume no ar.", sourcePage: "168" },
  finance: { summary: "Entender e manipular mercados, investimentos e a riqueza alheia.", sourcePage: "168-169" },
  investigation: { summary: "Resolver mistérios, notar pistas e rastrear pessoas desaparecidas.", sourcePage: "169" },
  medicine: { summary: "Diagnosticar e tratar ferimentos e doenças, usar equipamento médico.", sourcePage: "169-170" },
  occult: { summary: "Conhecimento do mundo místico — rituais, lendas, lore vampírica.", sourcePage: "170" },
  politics: { summary: "Diplomacia e burocracia, entre mortais e entre Kindred — quem manda em quê e por quê.", sourcePage: "170-171" },
  science: { summary: "Princípios científicos — da biologia à física — e sua aplicação prática.", sourcePage: "171" },
  technology: { summary: "Operar e entender a tecnologia do momento — hoje, sobretudo computadores e redes.", sourcePage: "171" },
};

export const WILLPOWER_COPY: SourcedCopy = {
  summary: "Compostura + Determinação. Um reservatório que você gasta para rerrolar dados, resistir a coação sobrenatural ou agir sob pressão extrema — recupera-se descansando ou agindo de acordo com suas Convicções e Ambição.",
  sourcePage: "157",
};

export const CONVICTION_COPY: SourcedCopy = {
  summary: "Um valor humano que o personagem ainda tenta seguir mesmo depois da morte (ex.: \"Nunca matar o inocente\"). Escolha de 1 a 3.",
  sourcePage: "172",
};

export const TOUCHSTONE_COPY: SourcedCopy = {
  summary: "Uma pessoa viva que ainda representa, para o personagem, o valor de uma Convicção. Se o Pilar for perdido, a Convicção correspondente também se perde.",
  sourcePage: "173",
};

export const TOUCHSTONE_BOND_COPY: SourcedCopy = {
  summary: "Como o personagem se relaciona com esse Pilar (ex.: filho, ex-amor, mentor). Não é o mesmo que Vínculo de Sangue (Blood Bond) — aqui é só a ligação emocional/narrativa.",
  sourcePage: "173",
};

export const AMBITION_COPY: SourcedCopy = {
  summary: "O objetivo de longo prazo do personagem — o que o mantém em movimento ao longo da crônica.",
  sourcePage: "173",
};

export const DESIRE_COPY: SourcedCopy = {
  summary: "Uma vontade mais imediata e de curto prazo — vingança, satisfação, resolver algo pendente agora.",
  sourcePage: "173-174",
};

export const ADVANTAGES_BUDGET_COPY: SourcedCopy = {
  summary: "Vantagens (Méritos/Antecedentes) custam pontos de um orçamento; Defeitos custam pontos de outro orçamento separado e menor — escolher um Defeito não libera mais pontos de Vantagem.",
  sourcePage: "179",
};

export const SECT_COPY: SourcedCopy = {
  summary: "Sua filiação política entre os vampiros (Camarilla, Anarquistas, Sabá...). Opcional na criação — nenhum clã obriga a uma seita específica.",
  sourcePage: "49-56",
};
