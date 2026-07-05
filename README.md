# Central de Viagem — v7.6 Upload em subpastas do Drive

Versão focada no envio automático de documentos para a subpasta correta do Google Drive.

## O que mudou

- Ao anexar arquivo em Documentos, a Central salva na subpasta correspondente à categoria.
- Exemplos:
  - Documentos pessoais → `01 - Documentos pessoais`
  - Deslocamentos / bilhetes / voos → `02 - Voos e deslocamentos`
  - Hospedagem → `03 - Hotéis`
  - Passeios / ingressos → `05 - Passeios e ingressos`
  - Seguro → `06 - Seguro viagem`
  - Orçamento / comprovantes → `07 - Orçamento e comprovantes`
- Se a subpasta não existir, o Apps Script cria automaticamente.
- A tela mostra o destino previsto antes de salvar.
- A planilha passa a registrar também a pasta de destino do Drive.

## Importante

Para usar esta versão, suba os arquivos no GitHub **e** atualize o `google-apps-script/Code.gs` no Apps Script.
Depois publique uma **Nova versão** da implantação.
