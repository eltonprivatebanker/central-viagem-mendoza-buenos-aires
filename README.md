# Central de Viagem — Mendoza & Buenos Aires — v3 Sistema

Projeto estático em HTML, CSS e JavaScript para organizar a viagem com aparência de sistema.

## O que esta versão permite

- Editar a capa da viagem pela própria tela.
- Adicionar, editar, duplicar, mover, excluir e renumerar dias do roteiro.
- Editar a agenda de cada dia por manhã, tarde e noite.
- Adicionar, editar e excluir pendências.
- Adicionar, editar e excluir reservas/deslocamentos.
- Adicionar, editar e excluir links úteis.
- Adicionar documentos, anexar arquivos do computador e baixar depois.
- Exportar/importar JSON dos dados textuais.
- Salvar as alterações no próprio navegador.

## Importante sobre os arquivos enviados

Como o GitHub Pages é um site estático, ele não grava arquivos de volta no GitHub sozinho.

Nesta versão, quando você envia um PDF/imagem/arquivo na área de documentos, ele fica salvo no navegador/aparelho usando IndexedDB. Isso permite baixar depois no mesmo navegador.

Limitações:

- Se abrir em outro computador/celular, o arquivo enviado localmente não aparece.
- O JSON exportado guarda os dados e metadados, mas não leva o arquivo anexado junto.
- Para acesso familiar em vários aparelhos, use links externos de Google Drive/OneDrive ou evolua para backend como Supabase/Firebase/Google Sheets + Apps Script.

## Estrutura

```text
index.html
style.css
app.js
.nojekyll
dados/
  viagem.json
```

## Como publicar no GitHub Pages

1. Envie os arquivos para a raiz do repositório.
2. Vá em Settings → Pages.
3. Escolha Deploy from a branch.
4. Selecione main e /(root).
5. Salve e aguarde a publicação.

## Como editar no site

1. Clique em **Editar** no topo.
2. Nos cartões do roteiro, clique em **Editar agenda**.
3. Edite Dia 01, data, cidade, título, manhã, tarde e noite.
4. Use as setas ↑ ↓ para reorganizar a ordem.
5. Use **Renumerar dias** para atualizar Dia 01, Dia 02, Dia 03 conforme a ordem atual.

## Próxima evolução possível

Para transformar em sistema multiusuário real:

- Google Sheets + Apps Script para dados simples;
- Supabase para banco e armazenamento de arquivos;
- Firebase para autenticação, banco e storage;
- GitHub API para gravar JSON no repositório com login/token.
