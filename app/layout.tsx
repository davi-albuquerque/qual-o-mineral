import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Qual o Mineral",
  description: "Identificador mineralógico — versão web do programa do Prof. Gustavo Gurgel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Qual o Mineral
            </Link>
            <nav className="text-sm text-zinc-600 flex gap-4">
              <Link href="/" className="hover:text-zinc-900">Pesquisar</Link>
              <Link href="/minerais" className="hover:text-zinc-900">Todos os Minerais</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8">{children}</main>
        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-4 text-sm text-zinc-500">
            By <span className="font-medium text-zinc-700">Gustavo Gurgel</span> —
            Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
