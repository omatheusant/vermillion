import { GothicShell } from "@/components/vermillion/gothic-shell";
import { ComingSoon } from "@/components/vermillion/coming-soon";

export default function EntrarPage() {
  return (
    <GothicShell>
      <ComingSoon
        eyebrow="Autenticação"
        title="Entrar"
        description="O formulário de login por email e senha chega com a Fase C, junto das migrations e do RLS que protegem cada personagem."
        phase="Fase C — Auth, migrations, RLS e persistência"
      />
    </GothicShell>
  );
}
