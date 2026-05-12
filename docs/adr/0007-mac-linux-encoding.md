# ADR 0007 — Encoding de nomes de arquivo (NFD/NFC)

**Status:** Accepted (2026-05-12)

## Context

Davi trabalha em macOS, Vercel/CI rodam Linux. Arquivos com acento (`GÊLO.XLS`, `ÓXIDOS.XLS`, `CINÁBRIO.XLS`) podem virar fantasma se commitados em NFD (decomposed) e checados em NFC (composed).

## Decision

- `git config core.precomposeunicode true` no repo local (já configurado).
- Nomes de arquivo gerados pelo pipeline (em `data/minerals/`) são **slugs ASCII** (`cinabrio.json`, `bórax.json` → `borax.json`). Sem acento, sem ambiguidade.
- Conteúdo dos arquivos preserva acentos (UTF-8 NFC).

## Consequences

- ✅ Cross-platform sem surpresas.
- ✅ URLs limpas.
- ⚠️ Mapping slug ↔ name original deve ser explícito em `data/filter-index.json`.
