"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { StatusBadge } from "@/components/vermillion/status-badge";
import { DropCapLore } from "@/components/vermillion/drop-cap-lore";
import { TrackMeter } from "@/components/vermillion/track-meter";
import { XpLedger, type XpLedgerEntry } from "@/components/vermillion/xp-ledger";
import { ATTRIBUTE_LABELS, SKILL_LABELS, DISCIPLINE_LABELS, SECT_LABELS, LINEAGE_LABELS } from "@/lib/v5-labels";
import { ATTRIBUTE_CATEGORY, ATTRIBUTE_IDS, type AttributeId } from "@/domain/v5";
import type { Tables } from "@/lib/supabase/database.types";

export interface CharacterSheetData {
  character: Pick<Tables<"characters">, "name" | "clan_id" | "lineage" | "status" | "visibility" | "sect" | "ruleset_version" | "slug">;
  clanName: string | null;
  details: Tables<"character_details"> | null;
  attributes: Pick<Tables<"character_attributes">, "attribute_id" | "value">[];
  skills: Pick<Tables<"character_skills">, "skill_id" | "value">[];
  specializations: Pick<Tables<"character_specializations">, "id" | "skill_id" | "label" | "is_free">[];
  disciplines: Pick<Tables<"character_disciplines">, "id" | "discipline_id" | "value" | "source" | "notes">[];
  merits: Pick<Tables<"character_advantages">, "id" | "kind" | "custom_label" | "dots" | "source">[];
  flaws: Pick<Tables<"character_flaws">, "id" | "custom_label" | "dots" | "source">[];
  convictions: Pick<Tables<"character_convictions">, "id" | "label">[];
  touchstones: Pick<Tables<"character_touchstones">, "id" | "conviction_id" | "name" | "bond" | "meaning" | "is_private">[];
  tracks: Tables<"character_tracks"> | null;
  xpEntries?: XpLedgerEntry[];
}

/**
 * Dossiê completo do personagem — só para dono/staff (Ficha Viva e
 * Conselho). A galeria pública usa um componente separado e mais
 * simples porque a separação de campos privados tem que ser estrutural
 * (nunca "esconder visualmente" dado que já chegou ao client).
 */
export function CharacterSheet({ data }: { data: CharacterSheetData }) {
  const { character, clanName, details, attributes, skills, specializations, disciplines, merits, flaws, convictions, touchstones, tracks, xpEntries } = data;

  const attributeByd = Object.fromEntries(attributes.map((a) => [a.attribute_id, a.value])) as Record<AttributeId, number>;
  const lineageLabel = character.lineage === "clan" ? (clanName ?? character.clan_id ?? "—") : LINEAGE_LABELS[character.lineage];

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-6">
        <div>
          <p className="font-badge text-xs uppercase tracking-[0.2em] text-ink-muted">{lineageLabel}</p>
          <h1 className="mt-1 font-display text-3xl text-foreground md:text-4xl">{character.name}</h1>
          {details?.concept ? <p className="mt-1 text-sm text-ink-muted">{details.concept}</p> : null}
        </div>
        <StatusBadge status={character.status} />
      </header>

      <Tabs defaultValue="perfil" className="mt-6">
        <TabsList variant="line">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="atributos">Atributos</TabsTrigger>
          <TabsTrigger value="pericias">Perícias</TabsTrigger>
          <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
          <TabsTrigger value="vantagens">Vantagens</TabsTrigger>
          <TabsTrigger value="condicao">Condição</TabsTrigger>
          <TabsTrigger value="historia">História</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-4 space-y-3">
          <Field label="Nome social" value={details?.social_name} />
          <Field label="Idade aparente" value={details?.apparent_age?.toString()} />
          <Field label="Nacionalidade" value={details?.nationality} />
          <Field label="Ocupação mortal" value={details?.occupation} />
          <Field label="Ambição" value={details?.ambition} />
          <Field label="Desejo" value={details?.desire} />
          {character.sect ? <Field label="Seita" value={SECT_LABELS[character.sect]} /> : null}
          <hr className="border-border/50" />
          <p className="font-badge text-[0.65rem] uppercase tracking-[0.1em] text-accent-crimson-bright">Privado</p>
          <Field label="Nome real" value={details?.real_name} />
          <Field label="Idade real" value={details?.real_age?.toString()} />
          <Field label="Senhor(a)" value={details?.sire_name} />
          <Field label="Data do Abraço" value={details?.embrace_date ?? undefined} />
        </TabsContent>

        <TabsContent value="atributos" className="mt-4 space-y-4">
          {(["physical", "social", "mental"] as const).map((category) => (
            <div key={category}>
              <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">
                {category === "physical" ? "Físicos" : category === "social" ? "Sociais" : "Mentais"}
              </h3>
              <dl className="mt-2 space-y-1">
                {ATTRIBUTE_IDS.filter((id) => ATTRIBUTE_CATEGORY[id] === category).map((id) => (
                  <div key={id} className="flex justify-between text-sm">
                    <dt className="text-ink-muted">{ATTRIBUTE_LABELS[id]}</dt>
                    <dd className="text-foreground">{attributeByd[id] ?? 0}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pericias" className="mt-4 space-y-3">
          <dl className="space-y-1">
            {skills
              .filter((s) => s.value > 0)
              .map((s) => (
                <div key={s.skill_id} className="flex justify-between text-sm">
                  <dt className="text-ink-muted">{SKILL_LABELS[s.skill_id as keyof typeof SKILL_LABELS] ?? s.skill_id}</dt>
                  <dd className="text-foreground">{s.value}</dd>
                </div>
              ))}
          </dl>
          {specializations.length > 0 ? (
            <div>
              <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">Especializações</h3>
              <ul className="mt-1 text-sm text-ink-muted">
                {specializations.map((spec) => (
                  <li key={spec.id}>
                    {SKILL_LABELS[spec.skill_id as keyof typeof SKILL_LABELS] ?? spec.skill_id}: {spec.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="disciplinas" className="mt-4">
          <dl className="space-y-1">
            {disciplines.map((d) => (
              <div key={d.id} className="flex justify-between text-sm">
                <dt className="text-ink-muted">{DISCIPLINE_LABELS[d.discipline_id] ?? d.discipline_id}</dt>
                <dd className="text-foreground">{d.value}</dd>
              </div>
            ))}
            {disciplines.length === 0 ? <p className="text-sm text-ink-muted">Nenhuma Disciplina registrada.</p> : null}
          </dl>
        </TabsContent>

        <TabsContent value="vantagens" className="mt-4 space-y-4">
          <div>
            <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">Vantagens</h3>
            <ul className="mt-1 space-y-1 text-sm">
              {merits.map((m) => (
                <li key={m.id} className="flex justify-between">
                  <span className="text-ink-muted">{m.custom_label ?? "Vantagem"}</span>
                  <span className="text-foreground">{m.dots}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">Defeitos</h3>
            <ul className="mt-1 space-y-1 text-sm">
              {flaws.map((f) => (
                <li key={f.id} className="flex justify-between">
                  <span className="text-ink-muted">{f.custom_label ?? "Defeito"}</span>
                  <span className="text-foreground">{f.dots}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="condicao" className="mt-4 space-y-4">
          {tracks ? (
            <>
              <TrackMeter label="Saúde" max={tracks.health_max} superficial={tracks.health_superficial} aggravated={tracks.health_aggravated} />
              <TrackMeter
                label="Força de Vontade"
                max={tracks.willpower_max}
                superficial={tracks.willpower_superficial}
                aggravated={tracks.willpower_aggravated}
              />
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Humanidade</span>
                <span className="text-foreground">{tracks.humanity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Fome</span>
                <span className="text-foreground">{tracks.hunger}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Potência de Sangue</span>
                <span className="text-foreground">{tracks.blood_potency}</span>
              </div>
            </>
          ) : null}
          <div>
            <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">Convicções e Pilares</h3>
            <ul className="mt-2 space-y-2">
              {convictions.map((c) => {
                const touchstone = touchstones.find((t) => t.conviction_id === c.id);
                return (
                  <li key={c.id} className="text-sm">
                    <p className="text-foreground">{c.label}</p>
                    {touchstone ? (
                      <p className="text-ink-muted">
                        Pilar: {touchstone.name} {touchstone.is_private ? "(privado)" : ""}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="historia" className="mt-4 space-y-4">
          <Field label="Aparência" value={details?.appearance} block />
          <Field label="Personalidade" value={details?.personality} block />
          <p className="font-badge text-[0.65rem] uppercase tracking-[0.1em] text-accent-crimson-bright">Privado</p>
          <Field label="História humana" value={details?.human_history} block dropCap />
          <Field label="Relato do Abraço" value={details?.embrace_account} block />
          <Field label="Vida após o Abraço" value={details?.after_embrace} block />
          <Field label="Refúgio" value={details?.haven_notes} block />
          <Field label="Relações" value={details?.relationships} block />
          <Field label="Pertences" value={details?.possessions} block />
          <Field label="Notas privadas" value={details?.private_notes} block />
        </TabsContent>

        <TabsContent value="evolucao" className="mt-4">
          <p className="mb-3 text-xs text-ink-muted">Versão do ruleset: {character.ruleset_version}</p>
          <XpLedger entries={xpEntries ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, block, dropCap }: { label: string; value?: string | null; block?: boolean; dropCap?: boolean }) {
  if (!value) return null;
  return (
    <VelvetCard className={block ? "block" : "flex items-center justify-between"}>
      <p className="font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      {block && dropCap ? (
        <DropCapLore className="mt-2">{value}</DropCapLore>
      ) : (
        <p className={block ? "mt-1 text-sm text-foreground" : "text-sm text-foreground"}>{value}</p>
      )}
    </VelvetCard>
  );
}
