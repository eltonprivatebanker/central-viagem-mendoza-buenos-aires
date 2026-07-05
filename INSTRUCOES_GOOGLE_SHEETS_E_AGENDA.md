# Instruções — Google Sheets, Drive e Agenda

Esta versão usa o mesmo Google Sheets e a mesma URL `/exec` já configurados.

## Atualização necessária para upload automático

Como a v7.3 passou a gravar automaticamente o arquivo no Google Drive e atualizar o link no documento, atualize também o Apps Script:

1. Abra a Planilha Google da viagem.
2. Vá em **Extensões → Apps Script**.
3. Abra `Código.gs`.
4. Apague o conteúdo antigo.
5. Cole o conteúdo de `google-apps-script/Code.gs` desta pasta.
6. Verifique a chave:

```js
const API_KEY = 'mendoza-2026-elton-familia';
```

7. Clique em **Salvar**.
8. Vá em **Implantar → Gerenciar implantações → Editar**.
9. Em versão, escolha **Nova versão**.
10. Clique em **Implantar**.

## Como usar documentos

Na Central:

1. Abra **Documentos**.
2. Clique em **+ Documento**.
3. Escolha um arquivo.
4. Clique em **Salvar**.
5. A Central envia o arquivo para a pasta do Drive configurada e preenche o link automaticamente.

Arquivos recomendados: PDF, imagem, Word, Excel, até 8 MB.
