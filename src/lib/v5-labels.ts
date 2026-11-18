import type { AttributeId, SkillId } from "@/domain/v5";

/** Rótulos PT-BR compartilhados entre wizard, Ficha Viva e Conselho. */
export const ATTRIBUTE_LABELS: Record<AttributeId, string> = {
  strength: "Força",
  dexterity: "Destreza",
  stamina: "Vigor",
  charisma: "Carisma",
  manipulation: "Manipulação",
  composure: "Compostura",
  intelligence: "Inteligência",
  wits: "Raciocínio",
  resolve: "Determinação",
};

export const SKILL_LABELS: Record<SkillId, string> = {
  athletics: "Atletismo",
  brawl: "Briga",
  craft: "Ofício",
  drive: "Condução",
  firearms: "Armas de Fogo",
  larceny: "Roubo",
  melee: "Luta Armada",
  stealth: "Furtividade",
  survival: "Sobrevivência",
  animal_ken: "Trato com Animais",
  etiquette: "Etiqueta",
  insight: "Percepção",
  intimidation: "Intimidação",
  leadership: "Liderança",
  performance: "Performance",
  persuasion: "Persuasão",
  streetwise: "Manha de Rua",
  subterfuge: "Subterfúgio",
  academics: "Acadêmicos",
  awareness: "Prontidão",
  finance: "Finanças",
  investigation: "Investigação",
  medicine: "Medicina",
  occult: "Ocultismo",
  politics: "Política",
  science: "Ciência",
  technology: "Tecnologia",
};

export const DISCIPLINE_LABELS: Record<string, string> = {
  animalism: "Animalismo",
  auspex: "Auspícios",
  blood_sorcery: "Feitiçaria de Sangue",
  celerity: "Rapidez",
  dominate: "Dominação",
  fortitude: "Fortitude",
  obfuscate: "Ofuscação",
  oblivion: "Oblívio",
  potence: "Potência",
  presence: "Presença",
  protean: "Metamorfose",
  thin_blood_alchemy: "Alquimia de Sangue-Ralo",
};

export const SECT_LABELS: Record<string, string> = {
  camarilla: "Camarilla",
  anarch: "Anarquistas",
  sabbat: "Sabá",
  ashirra: "Ashirra",
  independent: "Independente",
};

export const LINEAGE_LABELS: Record<string, string> = {
  clan: "Clã",
  caitiff: "Caitiff",
  thin_blood: "Sangue-Ralo",
};
