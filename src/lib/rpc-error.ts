/**
 * Tradução de erros de RPC do Postgres para mensagem PT-BR exibível ao
 * jogador. Fica fora de wizard-actions.ts (que é "use server" — todo
 * export de um módulo "use server" precisa ser Server Action/async;
 * esta é uma função pura e síncrona, usada por várias actions).
 */
export function mapRpcError(error: { code?: string; message: string }): string {
  if (error.code === "P0003") {
    return "Esta etapa foi salva em outro lugar enquanto você editava. Recarregue a página antes de continuar.";
  }
  if (error.code === "42501") {
    return "Você não tem permissão para editar este personagem.";
  }
  return error.message || "Não foi possível salvar. Tente novamente.";
}
