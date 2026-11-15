import { GothicShell } from "@/components/vermillion/gothic-shell";
import { ComingSoon } from "@/components/vermillion/coming-soon";

export default function CadastroPage() {
  return (
    <GothicShell>
      <ComingSoon
        eyebrow="Autenticação"
        title="Cadastro"
        description="Criação de conta por email e senha (OAuth Discord opcional, ver ADR 0009) chega com a Fase C."
        phase="Fase C — Auth, migrations, RLS e persistência"
      />
    </GothicShell>
  );
}
