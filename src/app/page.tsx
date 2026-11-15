import Link from "next/link";
import { GothicShell } from "@/components/vermillion/gothic-shell";
import { VermillionWordmark } from "@/components/vermillion/vermillion-wordmark";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { WaxSeal } from "@/components/vermillion/wax-seal";
import { PageTransition } from "@/components/vermillion/page-transition";

const NAV_ITEMS = [
  { label: "O Códice", href: "/codice" },
  { label: "Os Condenados", href: "/personagens" },
];

const EDITORIAL_LINES = [
  {
    title: "O Abraço",
    description:
      "Um roteiro de criação em dez etapas, com prévia viva do dossiê a cada decisão — nunca uma ficha em branco intimidando sozinha.",
  },
  {
    title: "Ficha Viva",
    description:
      "Atributos, Disciplinas, Humanidade e História num único arquivo que acompanha o personagem da criação à publicação.",
  },
  {
    title: "O Conselho",
    description:
      "Narradores revisam, comentam e aprovam com justificativa registrada — nunca uma aprovação forjada ou silenciosa.",
  },
];

export default function LandingPage() {
  return (
    <GothicShell
      navItems={NAV_ITEMS}
      actions={
        <Link
          href="/entrar"
          className="rounded-sm border border-border px-4 py-1.5 font-badge text-xs uppercase tracking-[0.12em] text-ink-muted transition-colors hover:border-ornament-gold/60 hover:text-foreground"
        >
          Entrar
        </Link>
      }
    >
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in oklab, var(--accent-crimson-deep) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-28 text-center md:py-36">
          <PageTransition>
            <VermillionWordmark size="xl" />
          </PageTransition>
          <PageTransition delay={0.08}>
            <p className="font-display text-2xl text-ink-muted md:text-3xl">
              Toda eternidade começa com um nome.
            </p>
          </PageTransition>
          <PageTransition delay={0.16}>
            <p className="max-w-xl text-balance text-sm text-ink-muted md:text-base">
              Vermillion é o arquivo digital de criaturas da noite: o lugar
              onde personagens de uma crônica de Vampiro: A Máscara nascem,
              são revisados por um Conselho e, enfim, entram para a galeria
              dos condenados.
            </p>
          </PageTransition>
          <PageTransition delay={0.24}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className="rounded-sm bg-primary px-6 py-3 font-badge text-xs uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Entre na noite
              </Link>
              <Link
                href="/codice"
                className="rounded-sm border border-border px-6 py-3 font-badge text-xs uppercase tracking-[0.14em] text-ink-muted transition-colors hover:border-ornament-gold/60 hover:text-foreground"
              >
                Conheça a crônica
              </Link>
            </div>
          </PageTransition>
        </div>
      </section>

      {/* Manifesto */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <LoreDivider className="mb-10" />
        <h2 className="font-display text-3xl text-foreground">
          Um arquivo, não uma planilha.
        </h2>
        <p className="mt-6 text-pretty text-ink-muted">
          Toda crônica de texto acumula fichas espalhadas em documentos,
          mensagens perdidas e planilhas improvisadas. Vermillion existe para
          que cada personagem recém-abraçado tenha um lugar único — vivo
          durante o jogo, auditável pelos narradores, e silencioso sobre o
          que precisa continuar em segredo.
        </p>
        <p className="mt-4 text-pretty text-ink-muted">
          Nenhuma regra da 5ª edição de Vampiro é reinventada aqui. O que o
          Vermillion adiciona é curadoria: um wizard que explica o que está
          calculando, uma Ficha Viva que não deixa números soltos sem
          origem, e uma galeria pública que só mostra o que cada jogador
          decidiu revelar.
        </p>
        <LoreDivider className="mt-10" />
      </section>

      {/* Linha editorial */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {EDITORIAL_LINES.map((line) => (
            <VelvetCard key={line.title}>
              <h3 className="font-display text-xl text-foreground">
                {line.title}
              </h3>
              <p className="mt-3 text-sm text-ink-muted">{line.description}</p>
            </VelvetCard>
          ))}
        </div>
      </section>

      {/* Sobre o criador */}
      <section className="border-t border-border/70 bg-surface-ebony/50">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
          <WaxSeal size="sm" />
          <p className="max-w-xl text-pretty text-sm text-ink-muted">
            Vermillion é mantido por um único narrador-desenvolvedor para a
            própria crônica de Discord, como projeto de fã sem fins
            lucrativos. Nenhuma parte do material original de Vampiro: A
            Máscara é reproduzida integralmente — apenas resumos autorais,
            sempre com referência à fonte.
          </p>
        </div>
      </section>
    </GothicShell>
  );
}
