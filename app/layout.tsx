import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Qual o Mineral",
  description:
    "Identificador mineralógico — versão web do programa do Prof. Gustavo Gurgel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
            <Link
              href="/"
              className="font-serif text-2xl tracking-tight text-[var(--color-ink)]"
            >
              Qual o Mineral
            </Link>
            <nav className="flex gap-6 text-sm text-[var(--color-muted)]">
              <Link
                href="/"
                className="transition-colors hover:text-[var(--color-ink)]"
              >
                Pesquisar
              </Link>
              <Link
                href="/minerais"
                className="transition-colors hover:text-[var(--color-ink)]"
              >
                Todos os Minerais
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">
          {children}
        </main>
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto max-w-5xl px-6 py-5 text-sm text-[var(--color-muted)]">
            By{" "}
            <span className="font-medium text-[var(--color-ink)]">
              Gustavo Gurgel
            </span>{" "}
            — Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
