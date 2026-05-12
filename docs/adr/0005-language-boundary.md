# ADR 0005 — Boundary de idioma: PT-BR no UI, inglês em código

**Status:** Accepted (2026-05-12)

## Context

UI deve ser 100% PT-BR (palavras do sogro). Código deve ser 100% inglês (manutenção, IA, contribuidores futuros).

## Decision

- **Inglês:** identificadores TS/Python, comentários, commits, ADRs, JSON keys, README.
- **PT-BR:** strings exibidas ao usuário, valores do dataset, nomes de minerais (preservar `CINÁBRIO`, `ZIRCAO`, `BÓRAX`).
- **Detecção de PT-BR para lint:** presença de caracteres acentuados (`/[áéíóúâêôãõç]/i`) ou palavras conhecidas (`Pesquisar`, `Limpar`, `Voltar`, `Imprimir`, `Nenhum`). Não tentar detectar inglês — falso-positivo infinito.

## Consequences

- ✅ Verificável por regex simples sobre fontes `.ts`/`.tsx`/`.py`.
- ✅ Allowlist clara para casos legítimos (mineral names em tests, etc.).
- ⚠️ Acrônimos como `URL`, `PDF` passam livres (são ASCII e não-acentuados).
