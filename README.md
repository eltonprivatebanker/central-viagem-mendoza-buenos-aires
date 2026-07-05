# Central de Viagem — v7.3 Upload automático para Drive

Versão focada em melhorar documentos/anexos.

## O que mudou

- Ao anexar um arquivo em **Documentos**, a Central tenta enviar automaticamente para a pasta do Google Drive configurada.
- O link do Drive passa a ser preenchido automaticamente no documento, sem precisar colar manualmente.
- Se o navegador bloquear a leitura da resposta por CORS, o Apps Script atualiza o backup da planilha e a Central tenta recuperar o link alguns segundos depois.
- O botão manual virou **Reenviar ao Drive**, usado apenas se algum envio falhar.
- A tela do documento explica quando o arquivo está local, em processamento ou salvo no Drive.

## Importante

Para esta versão funcionar completamente, atualize também o Apps Script:

1. Abra sua planilha.
2. Vá em **Extensões → Apps Script**.
3. Substitua o conteúdo de `Código.gs` pelo arquivo `google-apps-script/Code.gs` desta versão.
4. Confirme a chave:

```js
const API_KEY = 'mendoza-2026-elton-familia';
```

5. Clique em **Salvar**.
6. Vá em **Implantar → Gerenciar implantações → Editar**.
7. Escolha **Nova versão** e clique em **Implantar**.

A integração Google Sheets/Drive já configurada continua a mesma.
