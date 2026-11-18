import Link from "next/link";
import Image from "next/image";
import { GothicShell } from "@/components/vermillion/gothic-shell";
import { LoreDivider } from "@/components/vermillion/lore-divider";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { WaxSeal } from "@/components/vermillion/wax-seal";
import { PageTransition } from "@/components/vermillion/page-transition";
import { FilmGrainOverlay } from "@/components/vermillion/film-grain-overlay";
import { ParallaxLayer } from "@/components/vermillion/parallax-layer";

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

const FACTIONS = [
  {
    title: "A Camarilla",
    body: "Depois de 2012, quando a Segunda Inquisição devastou grande parte da sociedade vampírica londrina, a Camarilla reconstruiu seu domínio sobre a cidade — hierarquia, influência política, controle territorial. Hoje ela é a autoridade inconteste. Por baixo da aparência de ordem e unidade, porém, vivem rivalidades antigas, disputas de influência e alianças que nunca foram tão sólidas quanto parecem.",
  },
  {
    title: "Os Anarquistas",
    body: "Mantêm presença em territórios menores, com uma autonomia tolerada — desde que nunca ameacem diretamente a autoridade da Camarilla. A convivência é relativamente pacífica: a estabilidade da cidade beneficia também quem vive à margem de sua hierarquia.",
  },
  {
    title: "O Sabá",
    body: "Prepara uma expansão silenciosa. Aproveitando as fragilidades da Camarilla, a seita já estabelece influência em cidades menores ao redor de Londres, planejando uma ofensiva gradual contra um dos principais redutos de seus inimigos. Entre suas operações, há indícios de experimentos conduzidos por um poderoso ancião Tzimisce — suas verdadeiras intenções permanecem desconhecidas.",
  },
  {
    title: "A Segunda Inquisição",
    body: "A ameaça mais perigosa continua sendo a mesma de sempre. A sociedade vampírica se reorganizou, mas a lembrança das caçadas de 2012 segue viva. Operações clandestinas, agentes religiosos e organizações de inteligência continuam de prontidão — e qualquer violação significativa da Máscara pode despertar os caçadores outra vez, colocando toda a cidade em risco.",
  },
  {
    title: "A Máscara",
    body: "Para a população humana, vampiros continuam sendo criaturas de histórias, lendas e ficção — sua existência real preservada pela Máscara. Mas certas organizações religiosas, militares e de inteligência conhecem, ou suspeitam, a verdade, e investigam em segredo para encontrá-los e eliminá-los. Assim Londres vive sua aparente estabilidade: a Camarilla governa, os Anarquistas coexistem nas margens, o Sabá conspira nas sombras — e todos precisam evitar que a humanidade descubra o que de fato habita a cidade.",
  },
];

const DISCORD_INVITE_URL = "https://discord.gg/yFAhVJZHt3";

function SectionGlow({ tone = "crimson" }: { tone?: "crimson" | "wine" }) {
  const color = tone === "crimson" ? "var(--accent-crimson-deep)" : "var(--surface-wine)";
  return (
    <ParallaxLayer speed={0.12} className="pointer-events-none absolute inset-x-0 -top-1/4 h-[150%]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 32%, color-mix(in oklab, ${color} 22%, transparent), transparent 70%)`,
        }}
      />
    </ParallaxLayer>
  );
}

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
      {/* Hero — fotografia real (public/hero.webp, Londres 2026) com
          parallax de 1 camada e escurecimento controlado por CSS. */}
      <section className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden border-b border-border/70">
        <ParallaxLayer speed={0.18} className="absolute inset-x-0 -top-[12%] h-[124%]">
          <Image src="/hero.webp" alt="" fill priority sizes="100vw" className="object-contain" />
        </ParallaxLayer>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 60% at 50% 48%, color-mix(in oklab, var(--bg-obsidian) 88%, black) 0%, transparent 65%)," +
              "linear-gradient(to bottom, color-mix(in oklab, var(--bg-obsidian) 70%, black) 0%, transparent 25%, transparent 65%, color-mix(in oklab, var(--bg-obsidian) 82%, black) 100%)," +
              "color-mix(in oklab, var(--bg-obsidian) 48%, transparent)",
          }}
        />

        <FilmGrainOverlay opacity={0.05} />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 py-12 text-center md:py-16">
          <PageTransition>
            <Image
              src="/vermillion-wordmark.webp"
              alt="Vermillion"
              width={1915}
              height={821}
              priority
              className="h-auto w-full max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md"
            />
          </PageTransition>
          <PageTransition delay={0.08}>
            <p className="font-display text-2xl text-ink-muted md:text-3xl">
              A eternidade tem um preço. E Londres cobra em sangue.
            </p>
          </PageTransition>
          <PageTransition delay={0.16}>
            <p className="max-w-xl text-balance text-sm text-ink-muted md:text-base">
              Sob as luzes de Londres, uma sociedade imortal governa nas sombras. Entre intrigas,
              alianças e uma guerra silenciosa prestes a despertar, cada escolha pode custar sua
              humanidade. Qual será o seu legado?
            </p>
          </PageTransition>
          <PageTransition delay={0.24}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className="hover-glow-cta rounded-sm bg-primary px-6 py-3 font-badge text-xs uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/80"
              >
                Iniciar o Abraço
              </Link>
              <Link
                href="#cenario"
                className="rounded-sm border border-border px-6 py-3 font-badge text-xs uppercase tracking-[0.14em] text-ink-muted transition-colors hover:border-ornament-gold/60 hover:text-foreground"
              >
                Explorar o Universo
              </Link>
            </div>
          </PageTransition>
        </div>
      </section>

      {/* O que é Vermillion */}
      <section className="relative overflow-hidden border-b border-border/70">
        <SectionGlow tone="wine" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <LoreDivider className="mb-10" animateOnMount />
          <h2 className="font-display text-3xl text-foreground">Vermillion</h2>
          <p className="mt-6 text-pretty text-ink-muted">
            Vermillion é uma crônica de interpretação por texto, jogada em um servidor de Discord,
            ambientada na Londres de 2026. Usamos as regras de Vampiro: A Máscara, 5ª edição — mas
            a crônica em si é nossa: suas ruas, suas facções, suas intrigas e seus anoiteceres são
            obra de quem narra e joga aqui.
          </p>
          <p className="mt-4 text-pretty text-ink-muted">
            Este site é o arquivo oficial da crônica: onde cada jogador cria seu personagem,
            acompanha sua Ficha Viva através da história, e onde o Conselho de narradores revisa e
            aprova cada novo nome antes que ele entre para a galeria dos condenados.
          </p>
        </div>
      </section>

      {/* O Cenário */}
      <section id="cenario" className="relative overflow-hidden border-b border-border/70">
        <SectionGlow tone="crimson" />
        <div className="relative mx-auto max-w-3xl px-6 py-24">
          <div className="text-center">
            <h2 className="font-display text-3xl text-foreground md:text-4xl">Londres, 2026</h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-ink-muted">
              Uma cidade que aprendeu a temer a própria sombra — e a viver dentro dela mesmo
              assim.
            </p>
          </div>
          <LoreDivider className="my-10" />
          <div className="space-y-8">
            {FACTIONS.map((faction) => (
              <div key={faction.title}>
                <h3 className="font-display text-xl text-foreground">{faction.title}</h3>
                <p className="mt-2 text-pretty text-sm text-ink-muted md:text-base">{faction.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Vampiro: A Máscara */}
      <section className="relative overflow-hidden border-b border-border/70">
        <SectionGlow tone="wine" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl text-foreground">Vampiro: A Máscara</h2>
          <p className="mt-6 text-pretty text-ink-muted">
            Vampiro: A Máscara é um RPG de horror pessoal e político: jogadores interpretam
            vampiros que lutam contra a própria Fome e tentam preservar a Humanidade — ou o que
            sobrou dela — em meio a sociedades secretas, intrigas de poder e a ameaça constante de
            serem descobertos.
          </p>
          <p className="mt-4 text-pretty text-ink-muted">
            Vermillion usa a 5ª edição do sistema para contar sua própria história. Nenhuma regra
            é reinventada aqui, mas também não reproduzimos o manual original — cada resumo de
            clã, Disciplina ou mérito usado no site tem sua fonte registrada.
          </p>
        </div>
      </section>

      {/* Linha editorial — agora sobre o site, não a crônica */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center font-display text-2xl text-foreground">Como o arquivo funciona</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
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

      {/* @here — convite para o Discord */}
      <section className="relative overflow-hidden border-t border-border/70">
        <SectionGlow tone="crimson" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
          <h2 className="font-display text-3xl text-foreground">
            <span className="font-badge text-2xl tracking-[0.02em] text-ornament-gold">@here</span> — a crônica
            está aberta.
          </h2>
          <p className="max-w-xl text-pretty text-ink-muted">
            Vermillion é jogado em tempo real, em texto, dentro de um servidor de Discord — é lá
            que a história acontece de verdade. Este site é só o arquivo; a crônica é o Discord.
            Se você quer um lugar à mesa, comece por lá.
          </p>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="hover-glow-cta rounded-sm bg-primary px-6 py-3 font-badge text-xs uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/80"
          >
            Entrar no Discord
          </a>
        </div>
      </section>

      {/* Sobre o criador */}
      <section className="border-t border-border/70 bg-surface-ebony/50">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
          <WaxSeal size="sm" />
          <p className="max-w-xl text-pretty text-sm text-ink-muted">
            Vermillion é escrita e mantida por um grupo de narradores-desenvolvedores, como projeto
            de fã sem fins lucrativos. Este site é o arquivo oficial da crônica — nenhuma parte do
            material original de Vampiro: A Máscara é reproduzida integralmente, apenas resumos
            autorais, sempre com referência à fonte.
          </p>
        </div>
      </section>
    </GothicShell>
  );
}
