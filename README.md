# Central de Viagem — v7.5 Upload com confirmação visual

Versão focada em deixar o envio de documentos para o Google Drive mais transparente.

## O que mudou

- O botão do modal mostra `Salvar e enviar ao Drive` quando a nuvem está configurada.
- Ao clicar em salvar, o botão muda para `Processando...`, `Lendo arquivo...` e `Enviando ao Drive...`.
- O upload usa envio direto ao Apps Script para evitar duplicidade causada por CORS.
- Após o envio, a Central busca automaticamente o link salvo no Google Sheets.
- Se o link ainda não voltar imediatamente, o documento fica marcado como envio solicitado.
- Mantém a integração Google Sheets / Apps Script / Drive já validada.

## Importante

Depois de subir esta versão no GitHub, use Ctrl+F5 no navegador.

O Apps Script deve estar com o Code.gs da v7.3/v7.4 e a API_KEY correta.
