# ADR 0003 — LibreOffice headless para extrair texto dos `.XLS`

**Status:** Accepted (2026-05-12)

## Context

Cada `.XLS` legado tem **uma única célula** com texto (o título). Todo o conteúdo da ficha técnica vive em **caixas de texto (Drawing/Shape) BIFF8/Escher** dentro do arquivo. O PRD original propôs `xlrd + strings` — verificado: xlrd lê só células, e `strings` produz texto fragmentado com acentos quebrados.

## Decision

- Cada `.XLS` é convertido com `soffice --headless --convert-to xlsx`.
- O `.xlsx` resultante contém `xl/drawings/drawing1.xml` com o texto limpo em UTF-8.
- Parser percorre `<a:p>` (parágrafos) → concatena `<a:t>` (runs) → decodifica HTML entities.
- Cabeçalhos de seção são detectados por regex (Cristalografia, Propriedades físicas, Composição, Ensaios, Aspectos diagnósticos, Variedades, Gênese, Ocorrência, Uso, Nome, Espécies semelhantes), inclusive mid-paragraph.
- `xlrd` continua sendo usado **apenas** para ler células do `.xlsm` principal (aba DADOS MINERAIS).

## Consequences

- ✅ 12.991 caracteres limpos extraídos de QUARTZO.XLS — verificado.
- ✅ Acentos preservados (CINÁBRIO, ZIRCAO, BÓRAX).
- ⚠️ LibreOffice é dependência local. Não roda no Vercel/CI.
- ⚠️ Pipeline roda **localmente** no Mac do Davi. JSON é commitado no repo.
