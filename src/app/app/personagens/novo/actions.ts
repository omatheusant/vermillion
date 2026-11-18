"use server";

import { redirect } from "next/navigation";
import { createCharacterDraft } from "@/lib/characters";

export async function startEmbraceAction() {
  const character = await createCharacterDraft("Personagem sem nome");
  redirect(`/app/personagens/${character.id}/editar/1`);
}
