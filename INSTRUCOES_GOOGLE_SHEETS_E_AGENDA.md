# Instruções — v7.6

## 1. GitHub Pages

Suba todos os arquivos desta pasta na raiz do repositório, substituindo os atuais.
Depois aguarde o GitHub Pages publicar e use Ctrl+F5.

## 2. Apps Script

Abra o Apps Script da planilha e substitua o conteúdo de `Código.gs` pelo arquivo:

`google-apps-script/Code.gs`

Confirme a chave:

```javascript
const API_KEY = 'mendoza-2026-elton-familia';
```

Depois faça:

1. Salvar
2. Implantar → Gerenciar implantações
3. Editar implantação atual
4. Versão → Nova versão
5. Implantar

Configuração esperada:

- Executar como: Eu
- Quem pode acessar: Qualquer pessoa

## 3. Drive

A Central vai salvar arquivos automaticamente dentro das subpastas já criadas na pasta principal da viagem. Se alguma subpasta não existir, o Apps Script cria.
