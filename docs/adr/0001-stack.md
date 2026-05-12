# ADR 0001 — Stack: Next.js 16 + JSON estático + Vercel

**Status:** Accepted (2026-05-12)

## Context

196 minerais é um dataset pequeno e estável. O programa é só leitura para o usuário final. O autor (sogro) não edita pela web em v1.

## Decision

- **Frontend:** Next.js 16 App Router + TypeScript strict + Tailwind.
- **Data:** JSON estático bundlado no build. Sem banco de dados.
- **Hosting:** Vercel (free tier).
- **Pipeline de extração:** Python local, JSON commitado.

## Consequences

- ✅ Deploy é uma operação de segundos. Sem servidor para administrar.
- ✅ JSON commitado é diff-amigável — o sogro vê mudanças em PR.
- ✅ Sem dependência de runtime backend; o site funciona offline se servido como HTML.
- ⚠️ Atualizar o dataset = `make extract && git push`. Não é em tempo real.
- ⚠️ Ferramentas binárias (LibreOffice) ficam fora do CI/Vercel — só rodam local.
