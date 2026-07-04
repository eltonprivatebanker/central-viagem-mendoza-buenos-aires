# Central de Viagem — v6.2 Google Sheets + Agenda + Mapa corrigido

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


## v6.2 — Mapa corrigido

Esta versão corrige o carregamento visual do mapa interno:

- troca a camada visual para Carto/OSM Voyager, mais estável para uso no painel;
- recalcula automaticamente o tamanho do Leaflet com `invalidateSize()`;
- adiciona `ResizeObserver` para mudanças no painel;
- inclui botão **Recarregar** no mapa;
- melhora o carregamento após troca de abas, redimensionamento e atualização dos lugares.

O mapa interno continua gratuito e não usa API do Google Maps. Links do Google Maps seguem funcionando nos lugares cadastrados.


## v6.2

Correção adicional do mapa: inclui fallback local das regras críticas do Leaflet no `style.css`, troca para tiles OSM diretos e adiciona recálculo/redesenho reforçado para evitar blocos soltos/quebrados.
