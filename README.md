# Central de Viagem — v6.8 Limpeza de dados + visão geral profissional

Versão criada após a integração Google Sheets funcionar de verdade.

## O que mudou

- Mantém a integração já validada com Google Sheets/Apps Script.
- Corrige o período oficial da viagem quando ele foi sobrescrito para 26/07 a 05/08.
- Normaliza cidades/regiões para evitar duplicidade como `MENDOZA` e `Mendoza`.
- Unifica `Aconcágua` em `Aconcágua / Alta Montanha`.
- Deixa o resumo operacional mais limpo, mostrando apenas cidades com dados.
- Checklist da visão geral fica compacto, com pendências críticas em destaque.
- Adiciona botão para limpar itens de teste/demonstração.
- Mapa mantém marcadores numerados e card de detalhe mais limpo.
- Preserva os ajustes de desktop da v6.6/v6.7.

## Como subir

Envie todos os arquivos desta pasta para a raiz do repositório, substituindo os atuais. Depois aguarde o GitHub Pages atualizar e use Ctrl+F5 no navegador.

## Apps Script

Não precisa alterar o Apps Script se a conexão já está OK. Esta versão altera apenas a interface e a limpeza/normalização dos dados antes de salvar.
