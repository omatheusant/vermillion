import { GothicShell } from "@/components/vermillion/gothic-shell";
import { ComingSoon } from "@/components/vermillion/coming-soon";

export default function RecuperarSenhaPage() {
  return (
    <GothicShell>
      <ComingSoon
        eyebrow="Autenticação"
        title="Recuperar senha"
        description="Reset de senha por email via Supabase Auth chega com a Fase C."
        phase="Fase C — Auth, migrations, RLS e persistência"
      />
    </GothicShell>
  );
}
