# Central de Viagem — v6.4 CORS/JSONP

Versão focada em corrigir o erro de conexão:

`NetworkError when attempting to fetch resource.`

## O que mudou

- O teste de conexão com Apps Script passou a usar JSONP, evitando bloqueio CORS no GitHub Pages.
- O `google-apps-script/Code.gs` também foi atualizado para responder JSONP quando receber `callback`.
- O campo de URL ficou mais tolerante: aceita link completo, código `AKfy...` ou trecho `/macros/s/AKfy...`.
- A gravação continua usando Apps Script; se o navegador bloquear a leitura da resposta por CORS, a plataforma envia a solicitação e orienta conferir a planilha.

## Importante

Depois de subir esta versão no GitHub, você também precisa atualizar o código no Apps Script:

1. Abra o Apps Script.
2. Substitua o conteúdo do `Código.gs` pelo arquivo `google-apps-script/Code.gs` desta versão.
3. Troque `API_KEY` para a sua chave.
4. Salve.
5. Vá em `Implantar → Gerenciar implantações → Editar → Nova versão → Implantar`.

## Campos da plataforma

URL do Apps Script:

```text
https://script.google.com/macros/s/SEU_CODIGO/exec
```

Chave de edição:

```text
A mesma API_KEY do Código.gs
```

Pasta do Drive:

```text
ID da pasta do Drive da viagem
```
