import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Cache Components desligado por ora: a maior parte das rotas (/app/**)
  // é dados por usuário autenticado (Fase C+), então forçar contornos de
  // Suspense/"use cache" agora seria prematuro. Revisitar quando os
  // padrões de fetch reais existirem.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
