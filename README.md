# Central de Viagem — Mendoza & Buenos Aires v2 Editável

Projeto estático em HTML, CSS e JavaScript para organizar uma viagem com:

- visão geral;
- roteiro por dia;
- períodos de manhã, tarde e noite;
- pendências;
- reservas;
- links úteis;
- documentos;
- progresso geral.

## Novidade da v2

Agora a página permite editar pela própria tela:

- editar dados da capa;
- adicionar, editar e excluir pendências;
- adicionar, editar e excluir dias/eventos do roteiro;
- adicionar, editar e excluir reservas;
- adicionar, editar e excluir links úteis;
- adicionar, editar e excluir documentos;
- marcar pendências como concluídas;
- exportar JSON com a versão editada;
- importar JSON salvo anteriormente;
- resetar a base local.

## Como funciona o salvamento

Como o GitHub Pages é estático, a página não consegue alterar automaticamente o arquivo `dados/viagem.json` dentro do repositório.

Por isso, as edições feitas na tela são salvas no próprio navegador usando `localStorage`.

Isso significa:

- ao atualizar a página, os dados continuam salvos naquele navegador;
- os dados não aparecem automaticamente em outro computador/celular;
- para guardar uma cópia, use **Exportar JSON**;
- para levar os dados para outro navegador, use **Importar JSON**;
- para atualizar a base oficial do GitHub, substitua o arquivo `dados/viagem.json` pelo JSON exportado.

## Estrutura

```txt
central-viagem-mendoza-buenos-aires/
├── index.html
├── style.css
├── app.js
├── .nojekyll
└── dados/
    └── viagem.json
```

## Como publicar no GitHub Pages

1. Envie todos os arquivos para a raiz do repositório.
2. Vá em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/root`.
5. Salve e aguarde a publicação.

## Próxima evolução possível

Para virar um sistema completo, com dados sincronizados entre celular e computador, será necessário usar um backend, por exemplo:

- Supabase;
- Firebase;
- Google Sheets + Apps Script;
- GitHub API com autenticação.

Esta v2 é a melhor evolução sem backend: visual, editável e persistente no navegador.
