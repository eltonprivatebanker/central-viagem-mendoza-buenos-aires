# Central de Viagem — v4 Visual Map

Planner visual de viagem inspirado em plataformas como Wanderlog, mas estático e editável via GitHub Pages.

## Principais recursos

- Visão geral da viagem
- Itinerário dia a dia
- Lugares para visitar
- Mapa integrado com Leaflet/OpenStreetMap
- Vinculação de lugar ao dia e período da agenda
- Reservas
- Documentos com link externo
- Orçamento e despesas
- Exportar/importar JSON
- Salvamento automático no navegador via localStorage

## Limitação importante

O GitHub Pages é estático. Portanto, as edições feitas na tela ficam salvas no navegador usado, não no GitHub automaticamente.

Para sincronizar entre celular, notebook e família, evoluir depois para:

- Google Sheets + Apps Script
- Supabase
- Firebase
- GitHub API

## Como publicar

Suba estes arquivos na raiz do repositório:

- index.html
- style.css
- app.js
- README.md
- .nojekyll

Depois ative GitHub Pages na branch `main`, pasta `/root`.
