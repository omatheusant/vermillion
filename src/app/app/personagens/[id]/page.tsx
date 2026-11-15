import { GothicShell } from "@/components/vermillion/gothic-shell";
import { ComingSoon } from "@/components/vermillion/coming-soon";

const NAV_ITEMS = [{ label: "Meu Grimório", href: "/app/personagens" }];

export default async function FichaVivaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return (
    <GothicShell navItems={NAV_ITEMS}>
      <ComingSoon
        eyebrow="Ficha Viva"
        title="Em construção"
        description="Cabeçalho cinematográfico, tabs de Perfil/Atributos/Perícias/Disciplinas/Vantagens/Condição/História/Evolução — chega com a Fase E, conectada a dados reais."
        phase="Fase E — Aprovação, publicação e Ficha Viva"
      />
    </GothicShell>
  );
}
