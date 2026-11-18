"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export interface AuthActionState {
  error?: string;
  success?: string;
}

const signInSchema = z.object({
  email: z.string().min(1, "Email é obrigatório.").email("Email inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
  redirecionarPara: z.string().optional(),
});

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirecionarPara: formData.get("redirecionarPara"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Email ou senha incorretos." };
  }

  redirect(parsed.data.redirecionarPara || "/app");
}

const usernameSchema = z
  .string()
  .min(3, "Nome de usuário precisa de ao menos 3 caracteres.")
  .max(32, "Nome de usuário pode ter no máximo 32 caracteres.")
  .regex(/^[a-z0-9_-]+$/, "Use apenas letras minúsculas, números, hífen e underscore.");

const signUpSchema = z
  .object({
    username: usernameSchema,
    email: z.string().min(1, "Email é obrigatório.").email("Email inválido."),
    password: z.string().min(8, "Senha precisa de ao menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const siteUrl = await getSiteUrl();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/app`,
    },
  });

  if (error) {
    if (error.code === "user_already_exists" || error.message.toLowerCase().includes("already registered")) {
      return { error: "Já existe uma conta com este email." };
    }
    if (error.message.toLowerCase().includes("username")) {
      return { error: "Este nome de usuário já está em uso." };
    }
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  if (data.session) {
    redirect("/app");
  }

  return {
    success: "Conta criada. Verifique seu email para confirmar o cadastro antes de entrar.",
  };
}

const requestResetSchema = z.object({
  email: z.string().min(1, "Email é obrigatório.").email("Email inválido."),
});

export async function requestPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = requestResetSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const siteUrl = await getSiteUrl();
  const supabase = await createClient();
  // Sempre responde com a mesma mensagem de sucesso, exista ou não a
  // conta — evita enumeração de emails cadastrados.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/redefinir-senha`,
  });

  return {
    success: "Se este email existir na nossa crônica, você receberá um link para redefinir a senha.",
  };
}

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "Senha precisa de ao menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export async function updatePasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: "Não foi possível redefinir a senha. Solicite um novo link." };
  }

  redirect("/app");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
