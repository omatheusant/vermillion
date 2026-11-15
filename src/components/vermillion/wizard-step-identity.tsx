"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WizardShell } from "@/components/vermillion/wizard-shell";
import { VelvetCard } from "@/components/vermillion/velvet-card";
import { LoreTooltip } from "@/components/vermillion/lore-tooltip";
import { Button } from "@/components/ui/button";
import type { AutosaveState } from "@/components/vermillion/autosave-indicator";
import { getWizardSteps } from "@/lib/wizard-steps";

const identitySchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório."),
  socialName: z.string().optional(),
  apparentAge: z.string().optional(),
  nationality: z.string().optional(),
  occupation: z.string().optional(),
  concept: z.string().min(1, "Descreva o conceito do personagem."),
  ambition: z.string().optional(),
  desire: z.string().optional(),
  description: z.string().optional(),
});

type IdentityFormValues = z.infer<typeof identitySchema>;

/**
 * Demonstração funcional da Etapa 1 (Identidade e conceito) para a Fase
 * B — sem persistência real ainda (chega na Fase C). O autosave aqui é
 * simulado só para validar a UX; a implementação definitiva segue a ADR
 * 0003 (soft-lock + version).
 */
export function WizardStepIdentity() {
  const [autosaveState, setAutosaveState] = useState<AutosaveState>("idle");

  const form = useForm<IdentityFormValues>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      fullName: "",
      socialName: "",
      nationality: "",
      occupation: "",
      concept: "",
      ambition: "",
      desire: "",
      description: "",
    },
    mode: "onBlur",
  });

  const values = form.watch();
  const isDirty = form.formState.isDirty;

  useEffect(() => {
    if (!isDirty) return;
    setAutosaveState("saving");
    const timeout = setTimeout(() => setAutosaveState("saved"), 600);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- demo da Fase B; autosave real (com debounce/version) chega na Fase C via ADR 0003
  }, [JSON.stringify(values)]);

  return (
    <WizardShell
      steps={getWizardSteps({ 1: form.formState.isValid ? undefined : 1 })}
      currentStep={1}
      autosaveState={autosaveState}
      form={
        <form className="space-y-6">
          <div>
            <h1 className="font-display text-2xl text-foreground">
              Identidade e conceito
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Quem essa pessoa era antes do Abraço — e quem ela decidiu ser
              depois.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome completo" error={form.formState.errors.fullName?.message}>
              <input
                {...form.register("fullName")}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
              />
            </Field>
            <Field label="Nome social / apelido">
              <input
                {...form.register("socialName")}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
              />
            </Field>
            <Field label="Idade aparente">
              <input
                type="number"
                {...form.register("apparentAge")}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
              />
            </Field>
            <Field label="Nacionalidade">
              <input
                {...form.register("nationality")}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
              />
            </Field>
            <Field label="Ocupação mortal">
              <input
                {...form.register("occupation")}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
              />
            </Field>
          </div>

          <Field
            label="Conceito"
            error={form.formState.errors.concept?.message}
            help={
              <LoreTooltip summary="O conceito resume o personagem em uma frase — não precisa citar o clã." />
            }
          >
            <input
              {...form.register("concept")}
              className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Ambição">
              <textarea
                {...form.register("ambition")}
                rows={3}
                className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
              />
            </Field>
            <Field label="Desejo">
              <textarea
                {...form.register("desire")}
                rows={3}
                className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
              />
            </Field>
          </div>

          <Field label="Breve descrição">
            <textarea
              {...form.register("description")}
              rows={4}
              className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ornament-gold"
            />
          </Field>
        </form>
      }
      preview={
        <VelvetCard elevated className="sticky top-6">
          <p className="font-badge text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">
            Prévia do dossiê
          </p>
          <h2 className="mt-2 font-display text-2xl text-foreground">
            {values.fullName || "Nome ainda não escrito"}
          </h2>
          {values.socialName ? (
            <p className="text-sm italic text-ink-muted">
              &ldquo;{values.socialName}&rdquo;
            </p>
          ) : null}
          <p className="mt-3 text-sm text-ink-muted">
            {values.concept || "O conceito aparecerá aqui conforme você escreve."}
          </p>
          <dl className="mt-4 space-y-1 text-xs text-ink-muted">
            {values.apparentAge ? (
              <div className="flex justify-between">
                <dt>Idade aparente</dt>
                <dd className="text-foreground">{values.apparentAge}</dd>
              </div>
            ) : null}
            {values.nationality ? (
              <div className="flex justify-between">
                <dt>Nacionalidade</dt>
                <dd className="text-foreground">{values.nationality}</dd>
              </div>
            ) : null}
            {values.occupation ? (
              <div className="flex justify-between">
                <dt>Ocupação mortal</dt>
                <dd className="text-foreground">{values.occupation}</dd>
              </div>
            ) : null}
          </dl>
        </VelvetCard>
      }
      footer={
        <div className="flex items-center justify-between border-t border-border/70 pt-6">
          <Button variant="outline" type="button" disabled>
            Voltar
          </Button>
          <Button type="button" disabled={!form.formState.isValid}>
            Continuar
          </Button>
        </div>
      }
    />
  );
}

function Field({
  label,
  error,
  help,
  children,
}: {
  label: string;
  error?: string;
  help?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1.5 font-badge text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
        {label}
        {help}
      </span>
      {children}
      {error ? (
        <span role="alert" className="block text-xs text-accent-crimson-bright">
          {error}
        </span>
      ) : null}
    </label>
  );
}
