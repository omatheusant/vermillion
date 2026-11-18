"use client";

import { useState } from "react";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { Button } from "@/components/ui/button";
import { updateChronicleSettingsAction } from "@/lib/council-actions";

const SECTS = [
  { value: "camarilla", label: "Camarilla" },
  { value: "anarch", label: "Anarquistas" },
  { value: "sabbat", label: "Sabá" },
  { value: "ashirra", label: "Ashirra" },
  { value: "independent", label: "Independente" },
];

interface Settings {
  clans_enabled: string[] | null;
  sects_enabled: string[];
  starting_budget: { merits: number; flaws: number; humanity: number };
}

export function ChronicleSettingsForm({
  chronicleId,
  initialSettings,
  clans,
}: {
  chronicleId: string;
  initialSettings: Record<string, unknown>;
  clans: { id: string; name: string }[];
}) {
  const [settings, setSettings] = useState<Settings>({
    clans_enabled: (initialSettings.clans_enabled as string[] | null) ?? null,
    sects_enabled: (initialSettings.sects_enabled as string[]) ?? [],
    starting_budget: (initialSettings.starting_budget as Settings["starting_budget"]) ?? {
      merits: 7,
      flaws: 2,
      humanity: 7,
    },
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string>();

  const allClansEnabled = settings.clans_enabled === null;

  function toggleSect(value: string) {
    setSettings((prev) => ({
      ...prev,
      sects_enabled: prev.sects_enabled.includes(value)
        ? prev.sects_enabled.filter((s) => s !== value)
        : [...prev.sects_enabled, value],
    }));
  }

  function toggleClan(id: string) {
    setSettings((prev) => {
      const current = prev.clans_enabled ?? clans.map((c) => c.id);
      const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
      return { ...prev, clans_enabled: next.length === clans.length ? null : next };
    });
  }

  async function handleSave() {
    setStatus("saving");
    const result = await updateChronicleSettingsAction(chronicleId, settings as unknown as Record<string, unknown>);
    if (result.error) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("saved");
  }

  return (
    <VelvetCard className="mt-4 space-y-5">
      <div>
        <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">Seitas habilitadas</h3>
        <div className="mt-2 flex flex-wrap gap-3">
          {SECTS.map((s) => (
            <label key={s.value} className="flex items-center gap-1.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={settings.sects_enabled.includes(s.value)}
                onChange={() => toggleSect(s.value)}
              />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">Clãs habilitados</h3>
        <p className="text-xs text-ink-muted">{allClansEnabled ? "Todos habilitados (padrão)." : ""}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {clans.map((clan) => (
            <label key={clan.id} className="flex items-center gap-1.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={allClansEnabled || (settings.clans_enabled?.includes(clan.id) ?? false)}
                onChange={() => toggleClan(clan.id)}
              />
              {clan.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-badge text-xs uppercase tracking-[0.1em] text-ink-muted">Orçamento inicial</h3>
        <div className="mt-2 grid grid-cols-3 gap-3">
          <label className="text-xs text-ink-muted">
            Vantagens
            <input
              type="number"
              value={settings.starting_budget.merits}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  starting_budget: { ...prev.starting_budget, merits: Number(e.target.value) },
                }))
              }
              className="mt-1 w-full rounded-sm border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            />
          </label>
          <label className="text-xs text-ink-muted">
            Defeitos
            <input
              type="number"
              value={settings.starting_budget.flaws}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  starting_budget: { ...prev.starting_budget, flaws: Number(e.target.value) },
                }))
              }
              className="mt-1 w-full rounded-sm border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            />
          </label>
          <label className="text-xs text-ink-muted">
            Humanidade
            <input
              type="number"
              value={settings.starting_budget.humanity}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  starting_budget: { ...prev.starting_budget, humanity: Number(e.target.value) },
                }))
              }
              className="mt-1 w-full rounded-sm border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            />
          </label>
        </div>
      </div>

      {error ? <p className="text-sm text-accent-crimson-bright">{error}</p> : null}

      <Button type="button" onClick={handleSave} disabled={status === "saving"}>
        {status === "saving" ? "Salvando..." : status === "saved" ? "Salvo" : "Salvar configuração"}
      </Button>
    </VelvetCard>
  );
}
