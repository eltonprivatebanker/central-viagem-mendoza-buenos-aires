# Central de Viagem — v7.10

## Atualização obrigatória do Apps Script

Esta versão adiciona suporte a documentos grandes via Google Drive.

1. Abra o Apps Script vinculado à planilha.
2. Substitua todo o `Código.gs` pelo arquivo `google-apps-script/Code.gs`.
3. Confirme a chave:

```js
const API_KEY = 'mendoza-2026-elton-familia';
```

4. Clique em Salvar.
5. Vá em **Implantar > Gerenciar implantações > Editar**.
6. Selecione **Nova versão** e clique em **Implantar**.
7. Confirme: **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**.

## Fluxo para documentos

- Até 8 MB: upload automático pela Central.
- Acima de 8 MB: a Central abre a subpasta correta do Drive para você arrastar o arquivo.
- Depois use **Buscar no Drive** ou **Colar link** para criar o botão de consulta rápida.
