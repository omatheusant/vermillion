import Link from "next/link";
import { GothicShell } from "@/components/vermillion/gothic-shell";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { StatusBadge } from "@/components/vermillion/status-badge";
import { SignOutButton } from "@/components/vermillion/auth/sign-out-button";
import { ChronicleSettingsForm } from "@/components/vermillion/chronicle-settings-form";
import { requireCouncilStaff, getReviewQueue } from "@/lib/council";
import { getClanCatalog } from "@/lib/wizard";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/app" },
  { label: "Meu Grimório", href: "/app/personagens" },
];

export default async function ConselhoPage() {
  const { supabase, chronicle } = await requireCouncilStaff();
  const queue = await getReviewQueue(supabase, chronicle.id);
  const clans = await getClanCatalog(supabase);

  return (
    <GothicShell navItems={NAV_ITEMS} actions={<SignOutButton />}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">Restrito a narradores</p>
          <h1 className="mt-2 font-display text-3xl text-foreground md:text-4xl">O Conselho</h1>
          <p className="mt-2 text-sm text-ink-muted">{chronicle.name}</p>
        </header>

        <section>
          <h2 className="font-display text-xl text-foreground">Fila de avaliação</h2>
          {queue.length === 0 ? (
            <VelvetCard className="mt-4">
              <p className="text-sm text-ink-muted">Nenhum personagem aguardando avaliação no momento.</p>
            </VelvetCard>
          ) : (
            <div className="mt-4 space-y-3">
              {queue.map((character) => (
                <Link key={character.id} href={`/app/conselho/${character.id}`} className="block">
                  <VelvetCard className="hover-lift-glow flex items-center justify-between">
                    <div>
                      <p className="font-display text-lg text-foreground">{character.name}</p>
                      <p className="text-xs text-ink-muted">
                        por {character.ownerUsername} · {character.clan_id ?? character.lineage}
                      </p>
                    </div>
                    <StatusBadge status={character.status} />
                  </VelvetCard>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-foreground">Configuração da crônica</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Clãs/seitas habilitados e ponto inicial — o teto de 3 personagens é fixo e não aparece aqui (ADR 0002).
          </p>
          <ChronicleSettingsForm
            chronicleId={chronicle.id}
            initialSettings={chronicle.settings as Record<string, unknown>}
            clans={clans.map((c) => ({ id: c.id, name: c.name }))}
          />
        </section>
      </div>
    </GothicShell>
  );
}
