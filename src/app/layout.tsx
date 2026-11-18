import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Cinzel } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cinzel = Cinzel({
  variable: "--font-badge",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Vermillion — Toda eternidade começa com um nome",
    template: "%s · Vermillion",
  },
  description:
    "Vermillion é uma crônica de Vampiro: A Máscara (5ª edição) ambientada na Londres contemporânea de 2026, jogada por texto em um servidor de Discord. Este site é o arquivo digital da crônica: criação, progressão e publicação de personagens.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${manrope.variable} ${cinzel.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
