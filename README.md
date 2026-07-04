# Central de Viagem — v5 Sistema Completo

Projeto estático em HTML, CSS e JavaScript para organizar uma viagem com aparência de sistema visual inspirado em plataformas como Wanderlog.

## O que esta versão inclui

- Visão geral da viagem
- Itinerário por dia, com manhã/tarde/noite
- Cadastro, edição, duplicação, exclusão e reordenação de dias
- Lugares para visitar com cidade, categoria, status, prioridade, dia, período e coordenadas
- Mapa integrado com Leaflet/OpenStreetMap
- Reservas e compromissos
- Documentos e anexos
- Upload local de arquivos pequenos no navegador
- Links externos para Google Drive, Booking, Maps etc.
- Orçamento e despesas
- Pendências/checklist
- Exportar e importar backup JSON
- Área de configurações preparada para futura integração com Google Sheets + Apps Script

## Como publicar no GitHub Pages

1. Extraia o ZIP.
2. Entre no repositório `central-viagem-mendoza-buenos-aires`.
3. Clique em **Add file → Upload files**.
4. Suba os arquivos de dentro da pasta extraída.
5. Confirme em **Commit changes**.
6. Aguarde o GitHub Pages atualizar.

A página deve ficar disponível em:

```text
https://eltonprivatebanker.github.io/central-viagem-mendoza-buenos-aires/
```

## Importante sobre salvamento

Nesta fase, a página salva os dados no próprio navegador usando `localStorage`.

Isso significa:

- Editou no notebook: fica salvo no notebook.
- Abriu no celular: ainda não sincroniza automaticamente.
- Para migrar dados: use **Exportar backup** e **Importar backup**.

Para sincronização real entre celular, notebook e família, a próxima etapa é conectar com:

- Google Sheets para os dados;
- Google Drive para documentos;
- Apps Script como backend gratuito.

## Próxima etapa sugerida

Criar uma planilha com as abas:

```text
Config
Dias
Lugares
Agenda
Reservas
Documentos
Despesas
Pendencias
```

Depois criar um Apps Script para ler e gravar essas abas a partir da página.


## v5.1 — correção do modal inicial

Correção aplicada:
- o modal base de edição não aparece mais ao carregar a página;
- adicionado CSS `[hidden]{display:none!important;}` para impedir que `.modal-backdrop{display:grid}` sobrescreva o atributo `hidden`;
- `index.html` passou a chamar `style.css` e `app.js` com versão `v5-1-modal-fix`, reduzindo risco de cache antigo no GitHub Pages.
