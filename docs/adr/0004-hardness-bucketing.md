# ADR 0004 — Bucketing de dureza

**Status:** Accepted (2026-05-12)

## Context

Na aba `DADOS MINERAIS`, dureza está como **número** (3, 4, 6, 7, …). Na UI, o usuário escolhe um de 4 ranges. O VBA `FilterMinerals` (extraído em `docs/vba-original.bas`) usa: **mínimo inclusivo (`>=`), máximo exclusivo (`<`)**.

## Decision

```
Bucket    | min (incl) | max (excl)
lt-2.5    |   0        |   2.5
2.5-5.5   |   2.5      |   5.5
5.5-7    |   5.5      |   7
gte-7     |   7        |   ∞
```

Implementado em `lib/hardness.ts`. Tests em `lib/hardness.test.ts` cobrem casos de borda (0, 2.5, 5.5, 7).

## Consequences

- ✅ Idêntico ao VBA → garante parity.
- ✅ Mineral com dureza exatamente 2,5 cai em `2.5-5.5` (inclusivo no min).
- ✅ Mineral com dureza exatamente 7 cai em `gte-7`.
