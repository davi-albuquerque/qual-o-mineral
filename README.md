# Qual o Mineral

Identificador mineralógico — versão web do programa Excel mantido pelo Prof. **Gustavo Gurgel**.

> Status atual: **tracer bullet**. Apenas QUARTZO está disponível enquanto a pipeline completa de extração roda.

## Para o usuário final

Acesse `https://qual-o-mineral.vercel.app` (em breve).
Selecione as características observadas. Clique em **Pesquisar**.

## Para desenvolvimento

Pré-requisitos:
- Node.js ≥ 22
- Python 3 (apenas para a pipeline de extração local)
- LibreOffice (apenas para a pipeline; instalável via `brew install --cask libreoffice`)

Setup:

```bash
make install
make dev   # http://localhost:3000
```

Comandos:

```bash
make extract    # gera dataset local (.xlsm + .XLS → JSON)
make validate   # checa schema + integridade
make test       # roda todos os tests
make build      # build de produção
make typecheck  # TS strict
```

## Arquitetura

```
app/                     # Next.js App Router (PT-BR UI)
components/              # React components
lib/                     # Lógica pura (filtro, slug, hardness)
types/mineral.ts         # Single source of truth para tipos
data/                    # JSON gerado pela pipeline (commitado)
scripts/                 # Pipeline Python (roda local)
docs/adr/                # Architecture Decision Records
docs/vba-original.bas    # Macro VBA original (referência)
```

Decisões de arquitetura: ver `docs/adr/`.

## Língua

- **Código + commits + comentários:** inglês.
- **UI + dados + nomes de minerais:** PT-BR.
- Detalhes em `docs/adr/0005-language-boundary.md`.

## License

Conteúdo das fichas técnicas: © Gustavo Gurgel — todos os direitos reservados.
Código: MIT (a confirmar).
