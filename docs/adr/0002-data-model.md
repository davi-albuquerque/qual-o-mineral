# ADR 0002 — Modelo de dados: chave/label, sem banco

**Status:** Accepted (2026-05-12)

## Context

UI é PT-BR (rótulos do sogro). Código é inglês. Nomes de minerais têm acento (CINÁBRIO, BÓRAX). URLs precisam ser ASCII.

## Decision

- Cada opção (Brilho, Cor, Habito etc.) é `{ key: ASCII, label: PT-BR }`.
- Código branca em `key`. UI renderiza `label`.
- Slug de URL = `slugify(name)` — NFD + strip diacritics + lowercase + hífen.
- `types/mineral.ts` é a única fonte de verdade. JSON Schema é gerado a partir dele.

## Consequences

- ✅ URLs limpas: `/mineral/quartzo`, `/mineral/cinabrio`.
- ✅ Comparação em código nunca depende de string PT-BR cru — só de keys ASCII.
- ⚠️ Toda nova opção precisa de `key` definida explicitamente.
- ⚠️ Slug round-trip test obrigatório (sem colisões nos 196 minerais).
