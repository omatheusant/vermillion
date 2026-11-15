import { GothicShell } from "@/components/vermillion/gothic-shell";
import { ComingSoon } from "@/components/vermillion/coming-soon";

const NAV_ITEMS = [
  { label: "Início", href: "/" },
  { label: "O Códice", href: "/codice" },
];

export default function GaleriaPage() {
  return (
    <GothicShell navItems={NAV_ITEMS}>
      <ComingSoon
        eyebrow="Galeria pública"
        title="Os Condenados"
        description="Só fichas publicadas e aprovadas aparecem aqui, com filtro por clã e busca — chega junto da publicação, na Fase E."
        phase="Fase E — Aprovação, publicação e Ficha Viva"
      />
    </GothicShell>
  );
}
