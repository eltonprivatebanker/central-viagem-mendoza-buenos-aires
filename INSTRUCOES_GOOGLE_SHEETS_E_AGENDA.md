# Integração Google Sheets + Google Agenda + Drive — Central de Viagem v6

Esta versão usa:

- GitHub Pages: interface visual.
- Google Sheets: banco de dados gratuito da viagem.
- Apps Script: ponte segura para ler/salvar dados, enviar arquivos ao Drive e criar eventos na agenda.
- Google Agenda: agenda compartilhada da viagem.
- Google Drive: pasta dos documentos da viagem.

## 1. Criar a Planilha Google

1. Acesse sheets.google.com.
2. Crie uma planilha chamada `Central de Viagem — Mendoza & Buenos Aires`.
3. Na planilha, clique em `Extensões → Apps Script`.

## 2. Colar o backend Apps Script

1. Apague o conteúdo padrão do arquivo `Code.gs`.
2. Copie todo o conteúdo do arquivo `google-apps-script/Code.gs` deste ZIP.
3. Cole no Apps Script.
4. Troque esta linha:

```js
const API_KEY = 'troque-esta-chave-familiar';
```

por uma chave sua, por exemplo:

```js
const API_KEY = 'mendoza-2026-familia';
```

Use uma chave simples, mas que só você e sua esposa saibam.

## 3. Criar agenda exclusiva da viagem

1. Acesse calendar.google.com pelo computador.
2. Em `Outras agendas`, clique no `+`.
3. Escolha `Criar nova agenda`.
4. Nome sugerido: `Viagem Mendoza & Buenos Aires 2026`.
5. Compartilhe com sua esposa.
6. Permissão sugerida: `Fazer alterações nos eventos`.
7. Nas configurações da agenda, copie o `ID da agenda`.
8. Cole esse ID em:
   - `Code.gs`, na constante `CALENDAR_ID`; ou
   - na própria Central de Viagem, em `Configurações → ID da agenda compartilhada`.

## 4. Criar pasta no Google Drive

1. No Google Drive, crie uma pasta: `Viagem Mendoza & Buenos Aires 2026`.
2. Compartilhe a pasta com sua esposa.
3. Copie o link da pasta.
4. Cole na Central em `Configurações → Link ou ID da pasta do Drive`.

## 5. Executar setup

No Apps Script:

1. Selecione a função `setupCentralViagem`.
2. Clique em `Executar`.
3. Autorize os acessos solicitados.

Isso cria as abas:

```text
Config
Dias
Lugares
Reservas
Documentos
Despesas
Pendencias
Sistema_JSON
Log
```

## 6. Implantar como App da Web

1. Clique em `Implantar → Nova implantação`.
2. Tipo: `App da Web`.
3. Executar como: `Eu`.
4. Quem pode acessar: `Qualquer pessoa com o link`.
5. Clique em `Implantar`.
6. Copie a URL que termina em `/exec`.

## 7. Configurar na Central

Na Central de Viagem:

1. Abra `Configurações`.
2. Em `Modo de sincronização`, escolha `Google Sheets + Apps Script`.
3. Cole a URL `/exec`.
4. Cole a mesma chave que você colocou em `API_KEY`.
5. Cole o ID da agenda e o link/ID da pasta do Drive.
6. Clique em `Salvar`.
7. Clique em `Testar conexão`.
8. Clique em `Preparar planilha`.
9. Clique em `Salvar na nuvem`.

## Observações importantes

- A Central continua editável na tela.
- O Google Sheets passa a guardar os dados para abrir em outros aparelhos.
- O Google Drive guarda documentos enviados.
- O Google Agenda recebe eventos importantes.
- Arquivos grandes podem demorar ou falhar no envio pelo Apps Script; para arquivos pesados, o mais seguro é subir manualmente no Drive e colar o link no documento.
