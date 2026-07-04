# Central de Viagem — v5.2 Calendário + Google Maps

Projeto estático em HTML, CSS e JavaScript para organizar a viagem Mendoza & Buenos Aires.

## Novidades da v5.2

- Integração prática com Google Agenda por link de criação de evento.
- Botão **Google Agenda** em dias, lugares e reservas.
- Geração de arquivo `.ics` para importar em outros calendários.
- Campos de horário início/fim nos lugares e reservas.
- Campo de localização para o evento do Google Agenda.
- Campo de ano da viagem para montar datas corretamente.
- Configurações para nome/link da agenda compartilhada.
- Melhor suporte a links do Google Maps.
- Botão para tentar extrair coordenadas quando a URL completa do Maps tiver `@latitude,longitude`.

## Como usar a agenda compartilhada

1. Crie uma agenda exclusiva no Google Agenda, por exemplo: `Viagem Mendoza & Buenos Aires 2026`.
2. Compartilhe com sua esposa com permissão para editar eventos.
3. Na Central de Viagem, cadastre os dias, lugares e reservas.
4. Use o botão **Google Agenda** em cada card.
5. O Google Agenda abre com título, data, local e observações preenchidas.
6. Antes de salvar, escolha a agenda da viagem.

## Como usar o Google Maps

- Em **Lugares**, cole o link compartilhado do Google Maps.
- O link curto `maps.app.goo.gl` funciona para abrir o Maps.
- Para aparecer como pino dentro do mapa da plataforma, preencha latitude e longitude.
- Se você colar uma URL completa do Maps com `@lat,lng`, clique em **Tentar preencher coordenadas pelo link**.

## Limitação atual

A plataforma ainda salva dados no navegador via `localStorage`. Para sincronizar automaticamente celular/notebook/família, a próxima etapa é conectar Google Sheets + Apps Script e Google Drive.
