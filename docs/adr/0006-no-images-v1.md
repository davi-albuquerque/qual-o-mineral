# ADR 0006 — Imagens omitidas em v1

**Status:** Accepted (2026-05-12)

## Context

Os `.XLS` originais contêm fotos de espécimes minerais embedadas. PRD pede para "nunca abrir imagens" no pipeline — risco de erro de leitura e custo de processamento.

## Decision

- v1 é texto-only. Pipeline ignora qualquer Drawing que não seja text box.
- Quando o sogro pedir, faremos um v2 com curadoria manual de fotos (upload separado, não extração automática).

## Consequences

- ✅ Pipeline simples, rápido, sem dependência de bibliotecas de imagem.
- ⚠️ Fichas que referenciam "ver figura X" no texto manterão a referência (texto fiel ao original) mas sem imagem visível.
