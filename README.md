# Central de Viagem — Mendoza & Buenos Aires

Projeto estático em HTML, CSS e JavaScript para organizar uma viagem com:

- visão geral;
- roteiro por dia;
- períodos de manhã, tarde e noite;
- pendências;
- reservas;
- links úteis;
- documentos;
- progresso geral.

## Estrutura

```text
central-viagem-mendoza-buenos-aires/
├── index.html
├── style.css
├── app.js
├── .nojekyll
└── dados/
    └── viagem.json
```

## Como editar os dados da viagem

Abra o arquivo:

```text
dados/viagem.json
```

Edite:

- título;
- período;
- dias do roteiro;
- manhã/tarde/noite;
- reservas;
- links;
- documentos;
- pendências.

## Como testar no computador

Opção simples:

1. Abra a pasta do projeto.
2. Clique duas vezes no `index.html`.

Observação: alguns navegadores bloqueiam o carregamento do JSON via `file://`.
Por isso o `app.js` tem dados internos de fallback. No GitHub Pages o JSON carrega normalmente.

Opção melhor, com servidor local:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

## Como subir no GitHub Pages

1. Crie um repositório chamado `central-viagem-mendoza-buenos-aires`.
2. Envie todos estes arquivos para a raiz do repositório.
3. Vá em **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/root`.
6. Salve e aguarde a publicação.

## Observações

- O projeto é estático, então alterações feitas no navegador não salvam no GitHub automaticamente.
- O checklist marcado como concluído usa `localStorage`, ou seja, fica salvo só naquele navegador.
- Para atualizar oficialmente o roteiro, edite o arquivo `dados/viagem.json`.
