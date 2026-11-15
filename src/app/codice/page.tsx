import { GothicShell } from "@/components/vermillion/gothic-shell";
import { ComingSoon } from "@/components/vermillion/coming-soon";

const NAV_ITEMS = [
  { label: "Início", href: "/" },
  { label: "Os Condenados", href: "/personagens" },
];

export default function CodicePage() {
  return (
    <GothicShell navItems={NAV_ITEMS}>
      <ComingSoon
        eyebrow="Compêndio"
        title="O Códice"
        description="Resumos autorais de clãs, Disciplinas, Atributos e Perícias, cada um com referência de página — populado a partir das migrations de reference_content na Fase D."
        phase="Fase D — Criador V5 completo"
      />
    </GothicShell>
  );
}
