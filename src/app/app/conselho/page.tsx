import { GothicShell } from "@/components/vermillion/gothic-shell";
import { ComingSoon } from "@/components/vermillion/coming-soon";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/app" },
  { label: "Meu Grimório", href: "/app/personagens" },
];

export default function ConselhoPage() {
  return (
    <GothicShell navItems={NAV_ITEMS}>
      <ComingSoon
        eyebrow="Restrito a narradores"
        title="O Conselho"
        description="Fila de submissões, comparação com a revisão anterior, aprovação/devolução com justificativa e ajuste de configuração da crônica."
        phase="Fase E — Aprovação, publicação e Ficha Viva"
      />
    </GothicShell>
  );
}
