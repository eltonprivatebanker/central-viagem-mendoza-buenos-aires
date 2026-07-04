# Central de Viagem — v6 Google Sheets + Agenda

Sistema visual editável para planejar viagem com roteiro, lugares, mapa, reservas, documentos, orçamento e pendências.

## Novidades da v6

- Edição continua acontecendo pela própria tela.
- Integração opcional com Google Sheets via Apps Script.
- Botões para salvar/carregar dados da nuvem.
- Botão para criar evento direto na agenda compartilhada.
- Upload de documento para pasta do Google Drive via Apps Script.
- Arquivo `google-apps-script/Code.gs` incluído no ZIP.
- Guia completo em `INSTRUCOES_GOOGLE_SHEETS_E_AGENDA.md`.

## Estrutura

```text
index.html
style.css
app.js
dados/viagem.json
google-apps-script/Code.gs
google-apps-script/appsscript.json
INSTRUCOES_GOOGLE_SHEETS_E_AGENDA.md
.nojekyll
```

## Publicação

Suba `index.html`, `style.css`, `app.js`, `dados/` e `.nojekyll` no GitHub Pages.

Os arquivos da pasta `google-apps-script/` são para copiar no Apps Script, não precisam ser usados pelo GitHub Pages.
