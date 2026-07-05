# Central de Viagem — v6.7 Ajuste fino desktop + mapa estável

Versão criada para testar os refinamentos pós-integração:

- mantém a integração Google Sheets/Apps Script já validada;
- melhora a estabilidade do mapa no desktop;
- troca o marcador padrão quebrado do Leaflet por marcadores CSS próprios;
- reduz o efeito de mapa piscando/recalculando a cada renderização;
- mantém o refino visual desktop da v6.6;
- preserva a tela de configurações simples da v6.3/v6.4.

## Como subir no GitHub

Envie todos os arquivos desta pasta para a raiz do repositório, substituindo os atuais. Depois aguarde o GitHub Pages atualizar e use Ctrl+F5 no navegador.

## Apps Script

Não precisa refazer a integração se a conexão já estava OK. Só atualize o Apps Script novamente se você quiser substituir o backend pelo arquivo incluído em `google-apps-script/Code.gs`.
