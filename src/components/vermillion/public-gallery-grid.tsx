"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { LINEAGE_LABELS } from "@/lib/v5-labels";
import type { PublicCharacterCard } from "@/lib/public-gallery";

export function PublicGalleryGrid({ characters }: { characters: PublicCharacterCard[] }) {
  const [search, setSearch] = useState("");
  const [clanFilter, setClanFilter] = useState<string>("all");

  const clanOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of characters) {
      if (c.clanId && c.clanName) seen.set(c.clanId, c.clanName);
    }
    return [...seen.entries()];
  }, [characters]);

  const filtered = characters.filter((c) => {
    const matchesClan = clanFilter === "all" || c.clanId === clanFilter || c.lineage === clanFilter;
    const matchesSearch =
      search.trim().length === 0 ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.concept ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesClan && matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Buscar por nome ou conceito</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou conceito..."
            className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por clã</span>
          <select
            value={clanFilter}
            onChange={(e) => setClanFilter(e.target.value)}
            className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
          <option value="all">Todos os clãs</option>
          {clanOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
          <option value="caitiff">Caitiff</option>
          <option value="thin_blood">Sangue-Ralo</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">Nenhum personagem encontrado.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((character) => (
            <Link key={character.id} href={`/personagens/${character.slug}`} className="block">
              <VelvetCard className="hover-lift-glow h-full">
                <h3 className="font-display text-xl text-foreground">{character.name}</h3>
                <p className="mt-0.5 font-badge text-[0.65rem] uppercase tracking-[0.1em] text-ink-muted">
                  {character.lineage === "clan" ? character.clanName : LINEAGE_LABELS[character.lineage]}
                  {character.apparentAge ? ` · ${character.apparentAge} anos aparentes` : ""}
                </p>
                {character.concept ? <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{character.concept}</p> : null}
                {character.ownerUsername ? (
                  <p className="mt-3 text-xs text-ink-muted">por @{character.ownerUsername}</p>
                ) : null}
              </VelvetCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
