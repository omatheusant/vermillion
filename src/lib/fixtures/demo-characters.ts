import type { CharacterSummary } from "@/types/character";

/**
 * Dados de demonstração para a Fase B (protótipo sem banco). Nunca usar
 * estes fixtures como fallback silencioso em código conectado ao
 * Supabase — toda tela real busca dados de verdade a partir da Fase C.
 */
export const DEMO_CHARACTERS: CharacterSummary[] = [
  {
    id: "demo-1",
    name: "Lucrécia Valmont",
    clanName: "Toreador",
    lineage: "clan",
    apparentAge: 27,
    concept: "Curadora de galeria obcecada pela beleza que não envelhece",
    status: "approved",
    completion: 100,
    creationStep: 9,
  },
  {
    id: "demo-2",
    name: "Erasmo Cardoso",
    clanName: "Nosferatu",
    lineage: "clan",
    apparentAge: 41,
    concept: "Ex-jornalista investigativo escondido nos túneis do metrô",
    status: "submitted",
    completion: 92,
    creationStep: 9,
  },
  {
    id: "demo-3",
    name: "Iris Bittencourt",
    clanName: null,
    lineage: "thin_blood",
    apparentAge: 23,
    concept: "Química forense que ainda sente o sol como um peso, não uma dor",
    status: "draft",
    completion: 46,
    creationStep: 4,
  },
];
