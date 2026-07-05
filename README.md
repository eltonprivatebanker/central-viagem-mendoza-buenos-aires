# Central de Viagem — v6.5 Fluidez + Cidades pré-validadas

Versão para testar melhorias de uso depois da integração com Google Sheets funcionar.

## O que mudou

- Cadastro de lugar ficou mais simples e fluido.
- Campo de cidade virou lista pré-validada com:
  - Cascavel — Brasil
  - Foz do Iguaçu — Brasil
  - Puerto Iguazú — Argentina
  - Buenos Aires — Argentina
  - Mendoza — Argentina
  - Aconcágua / Alta Montanha — Argentina
  - Potrerillos / Cacheuta — Argentina
- O modal de lugar mostra primeiro só o essencial:
  - nome do lugar;
  - cidade/região;
  - dia;
  - período;
  - link do Google Maps;
  - observações.
- Categoria, status, prioridade, horários e coordenadas foram movidos para "Avançado".
- Adicionada lista de sugestões de lugares por cidade/região.
- O mapa foi ajustado para reduzir piscadas/recarregamentos desnecessários.
- Ordenação do itinerário agora prioriza a data, quando disponível.

## Apps Script

A pasta `google-apps-script` mantém o backend v6.4 compatível com JSONP/CORS.
Se o seu Apps Script já está funcionando e mostra "Conexão OK com Apps Script", não precisa trocar o código agora.

## Subida no GitHub

Envie todos os arquivos desta pasta para a raiz do repositório, substituindo os atuais. Depois aguarde o GitHub Pages atualizar e use Ctrl+F5 no navegador.
