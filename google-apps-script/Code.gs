
/**
 * Central de Viagem — Backend Google Sheets + Drive + Agenda
 * Versão v7.3 — JSONP/CORS + upload automático no Drive
 *
 * Como usar:
 * 1) Crie uma Planilha Google chamada "Central de Viagem".
 * 2) Abra Extensões > Apps Script.
 * 3) Cole este arquivo em Code.gs.
 * 4) Troque API_KEY por uma chave sua e, se quiser, CALENDAR_ID pelo ID da agenda compartilhada.
 * 5) Execute setupCentralViagem() uma vez e autorize.
 * 6) Implante como App da Web: Executar como "Você"; Acesso "Qualquer pessoa com o link".
 * 7) Copie a URL /exec e cole na Central de Viagem, junto com a mesma API_KEY.
 */

const API_KEY = 'troque-esta-chave-familiar';
const CALENDAR_ID = ''; // Opcional: abc123@group.calendar.google.com. Vazio usa agenda padrão.
const DEFAULT_TIMEZONE = 'America/Sao_Paulo';
const JSON_CHUNK_SIZE = 40000;

const SHEETS = {
  config: 'Config',
  days: 'Dias',
  places: 'Lugares',
  reservations: 'Reservas',
  documents: 'Documentos',
  expenses: 'Despesas',
  tasks: 'Pendencias',
  snapshot: 'Sistema_JSON',
  log: 'Log'
};

function doGet(e) {
  return handleRequest_(e, 'GET');
}

function doPost(e) {
  return handleRequest_(e, 'POST');
}

function handleRequest_(e, method) {
  const params = (e && e.parameter) || {};
  const callback = params.callback || '';
  try {
    const action = params.action || 'ping';
    const token = params.token || '';
    if (token !== API_KEY) throw new Error('Chave de edição inválida. Confira API_KEY no Code.gs e na Central.');
    const payload = params.payload ? JSON.parse(params.payload) : {};

    if (action === 'ping') return json_({ ok: true, message: 'Conexão OK com Apps Script', method }, callback);
    if (action === 'setup') return json_(setupCentralViagem(payload.data), callback);
    if (action === 'saveAll') return json_(saveAll_(payload.data, payload.settings || {}), callback);
    if (action === 'getAll') return json_({ ok: true, data: readAll_() }, callback);
    if (action === 'createCalendarEvent') return json_(createCalendarEvent_(payload.event, payload.settings || {}, payload.trip || {}), callback);
    if (action === 'uploadFile') return json_(uploadFile_(payload), callback);

    throw new Error('Ação não reconhecida: ' + action);
  } catch (err) {
    return json_({ ok: false, error: err.message || String(err) }, callback);
  }
}

function setupCentralViagem(initialData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Use este Apps Script vinculado a uma Planilha Google.');
  ensureSheet_(SHEETS.config, ['chave', 'valor']);
  ensureSheet_(SHEETS.days, ['id','numero','label','data','titulo','cidade','manha','tarde','noite','hospedagem','deslocamento','observacoes']);
  ensureSheet_(SHEETS.places, ['id','nome','cidade','categoria','status','prioridade','dia_id','periodo','latitude','longitude','link_maps','localizacao','inicio','fim','observacoes']);
  ensureSheet_(SHEETS.reservations, ['id','tipo','titulo','status','cidade','data','hora_inicio','hora_fim','data_fim','valor','pago','dia_id','link','localizacao','observacoes']);
  ensureSheet_(SHEETS.documents, ['id','titulo','categoria','status','dia_id','link','drive_file_id','arquivo_nome','arquivo_tamanho','observacoes']);
  ensureSheet_(SHEETS.expenses, ['id','categoria','titulo','cidade','data','previsto','pago','status','pessoa','observacoes']);
  ensureSheet_(SHEETS.tasks, ['id','titulo','descricao','critico','concluido']);
  ensureSheet_(SHEETS.snapshot, ['parte','json']);
  ensureSheet_(SHEETS.log, ['quando','acao','detalhe']);
  writeConfig_('ultima_configuracao', new Date().toISOString());
  writeConfig_('calendar_id', CALENDAR_ID);
  if (initialData) saveAll_(initialData, {});
  log_('setup', 'Abas criadas/atualizadas');
  return { ok: true, message: 'Planilha preparada com sucesso' };
}

function saveAll_(data, settings) {
  if (!data) throw new Error('Nenhum dado recebido para salvar.');
  setupSheetsOnly_();
  writeJsonSnapshot_(data);
  writeReadableTables_(data);
  if (settings.calendarId) writeConfig_('calendar_id_frontend', settings.calendarId);
  if (settings.driveFolderId) writeConfig_('drive_folder_id_frontend', settings.driveFolderId);
  writeConfig_('ultima_sincronizacao', new Date().toISOString());
  log_('saveAll', 'Dados salvos pela Central de Viagem');
  return { ok: true, message: 'Dados salvos no Google Sheets' };
}

function readAll_() {
  setupSheetsOnly_();
  const data = readJsonSnapshot_();
  if (!data) throw new Error('Ainda não existe backup salvo em Sistema_JSON. Clique primeiro em Salvar na nuvem.');
  return data;
}

function createCalendarEvent_(event, settings, trip) {
  if (!event || !event.title) throw new Error('Evento inválido.');
  const timezone = (settings && settings.timezone) || DEFAULT_TIMEZONE;
  const calendarId = (settings && settings.calendarId) || CALENDAR_ID || readConfig_('calendar_id_frontend') || '';
  const calendar = calendarId ? CalendarApp.getCalendarById(calendarId) : CalendarApp.getDefaultCalendar();
  if (!calendar) throw new Error('Agenda não encontrada. Confira o ID da agenda compartilhada.');

  const year = (trip && trip.year) || new Date().getFullYear();
  const date = parseTripDate_(event.date, year);
  if (!date) throw new Error('Data inválida para o evento: ' + event.date);

  const options = { description: event.details || '', location: event.location || '' };
  let created;
  if (event.startTime) {
    const start = dateWithTime_(date, event.startTime);
    const end = dateWithTime_(date, event.endTime || addMinutesToTime_(event.startTime, 90));
    created = calendar.createEvent(event.title, start, end, options);
  } else {
    created = calendar.createAllDayEvent(event.title, date, options);
  }
  log_('createCalendarEvent', event.title);
  return { ok: true, message: 'Evento criado no Google Agenda', eventId: created.getId(), calendarUrl: 'https://calendar.google.com/calendar/u/0/r' };
}

function uploadFile_(payload) {
  if (!payload || !payload.base64 || !payload.fileName) throw new Error('Arquivo inválido.');
  const folderId = payload.folderId || readConfig_('drive_folder_id_frontend') || '';
  const folder = folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
  const bytes = Utilities.base64Decode(payload.base64);
  const blob = Utilities.newBlob(bytes, payload.mimeType || 'application/octet-stream', payload.fileName);
  const file = folder.createFile(blob);
  const result = { ok: true, message: 'Arquivo enviado ao Google Drive', fileId: file.getId(), fileUrl: file.getUrl(), name: file.getName() };

  // Atualiza automaticamente o documento dentro do backup JSON da viagem.
  // Assim, mesmo quando o navegador envia por no-cors e não consegue ler a resposta,
  // a Central consegue recuperar o link depois em "Carregar da nuvem".
  try {
    if (payload.documentId) {
      const data = readJsonSnapshot_() || {};
      data.documents = data.documents || [];
      let doc = data.documents.find(function(d){ return d.id === payload.documentId; });
      if (!doc) {
        doc = payload.documentData || { id: payload.documentId, title: payload.fileName, category: 'Documento', status: 'Pendente', dayId: '', notes: '' };
        data.documents.push(doc);
      }
      doc.driveFileId = file.getId();
      doc.link = file.getUrl();
      doc.uploadStatus = 'uploadedDrive';
      doc.file = { name: file.getName(), size: bytes.length, type: payload.mimeType || 'application/octet-stream', localOnly: false };
      writeJsonSnapshot_(data);
      writeReadableTables_(data);
    }
  } catch (err) {
    log_('uploadFile_snapshot_warning', err.message || String(err));
  }

  log_('uploadFile', payload.fileName);
  return result;
}

function setupSheetsOnly_() {
  ensureSheet_(SHEETS.config, ['chave', 'valor']);
  ensureSheet_(SHEETS.days, ['id','numero','label','data','titulo','cidade','manha','tarde','noite','hospedagem','deslocamento','observacoes']);
  ensureSheet_(SHEETS.places, ['id','nome','cidade','categoria','status','prioridade','dia_id','periodo','latitude','longitude','link_maps','localizacao','inicio','fim','observacoes']);
  ensureSheet_(SHEETS.reservations, ['id','tipo','titulo','status','cidade','data','hora_inicio','hora_fim','data_fim','valor','pago','dia_id','link','localizacao','observacoes']);
  ensureSheet_(SHEETS.documents, ['id','titulo','categoria','status','dia_id','link','drive_file_id','arquivo_nome','arquivo_tamanho','observacoes']);
  ensureSheet_(SHEETS.expenses, ['id','categoria','titulo','cidade','data','previsto','pago','status','pessoa','observacoes']);
  ensureSheet_(SHEETS.tasks, ['id','titulo','descricao','critico','concluido']);
  ensureSheet_(SHEETS.snapshot, ['parte','json']);
  ensureSheet_(SHEETS.log, ['quando','acao','detalhe']);
}

function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  const current = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader = current.join('') === '' || current[0] !== headers[0];
  if (needsHeader) {
    sh.clear();
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function clearAndWrite_(sheetName, headers, rows) {
  const sh = ensureSheet_(sheetName, headers);
  sh.clearContents();
  sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  if (rows.length) sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sh.autoResizeColumns(1, headers.length);
}

function writeReadableTables_(data) {
  clearAndWrite_(SHEETS.days, ['id','numero','label','data','titulo','cidade','manha','tarde','noite','hospedagem','deslocamento','observacoes'], (data.days || []).map(d => [d.id,d.number,d.label,d.date,d.title,d.city,d.morning,d.afternoon,d.night,d.lodging,d.transport,d.notes]));
  clearAndWrite_(SHEETS.places, ['id','nome','cidade','categoria','status','prioridade','dia_id','periodo','latitude','longitude','link_maps','localizacao','inicio','fim','observacoes'], (data.places || []).map(p => [p.id,p.name,p.city,p.category,p.status,p.priority,p.dayId,p.period,p.lat,p.lng,p.url,p.location,p.startTime,p.endTime,p.notes]));
  clearAndWrite_(SHEETS.reservations, ['id','tipo','titulo','status','cidade','data','hora_inicio','hora_fim','data_fim','valor','pago','dia_id','link','localizacao','observacoes'], (data.reservations || []).map(r => [r.id,r.type,r.title,r.status,r.city,r.date,r.time,r.endTime,r.endDate,r.amount,r.paid,r.dayId,r.link,r.location,r.notes]));
  clearAndWrite_(SHEETS.documents, ['id','titulo','categoria','status','dia_id','link','drive_file_id','arquivo_nome','arquivo_tamanho','observacoes'], (data.documents || []).map(d => [d.id,d.title,d.category,d.status,d.dayId,d.link,d.driveFileId || '',d.file ? d.file.name : '',d.file ? d.file.size : '',d.notes]));
  clearAndWrite_(SHEETS.expenses, ['id','categoria','titulo','cidade','data','previsto','pago','status','pessoa','observacoes'], (data.expenses || []).map(e => [e.id,e.category,e.title,e.city,e.date,e.expected,e.paid,e.status,e.person,e.notes]));
  clearAndWrite_(SHEETS.tasks, ['id','titulo','descricao','critico','concluido'], (data.tasks || []).map(t => [t.id,t.title,t.description,Boolean(t.critical),Boolean(t.done)]));
}

function writeJsonSnapshot_(data) {
  const sh = ensureSheet_(SHEETS.snapshot, ['parte', 'json']);
  sh.clearContents();
  sh.getRange(1,1,1,2).setValues([['parte','json']]).setFontWeight('bold');
  const json = JSON.stringify(data);
  const rows = [];
  for (let i = 0; i < json.length; i += JSON_CHUNK_SIZE) rows.push([rows.length + 1, json.slice(i, i + JSON_CHUNK_SIZE)]);
  if (rows.length) sh.getRange(2, 1, rows.length, 2).setValues(rows);
}

function readJsonSnapshot_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEETS.snapshot);
  if (!sh || sh.getLastRow() < 2) return null;
  const values = sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues();
  const text = values.sort((a,b) => Number(a[0]) - Number(b[0])).map(r => r[1]).join('');
  return text ? JSON.parse(text) : null;
}

function writeConfig_(key, value) {
  const sh = ensureSheet_(SHEETS.config, ['chave', 'valor']);
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === key) { sh.getRange(i + 1, 2).setValue(value); return; }
  }
  sh.appendRow([key, value]);
}
function readConfig_(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEETS.config);
  if (!sh) return '';
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) if (values[i][0] === key) return values[i][1] || '';
  return '';
}
function log_(action, detail) {
  const sh = ensureSheet_(SHEETS.log, ['quando','acao','detalhe']);
  sh.appendRow([new Date(), action, detail || '']);
}
function json_(obj, callback) {
  const text = JSON.stringify(obj);
  if (callback && /^[a-zA-Z_$][\w$]*(\.[a-zA-Z_$][\w$]*)*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + text + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}
function parseTripDate_(value, year) {
  if (!value) return null;
  const s = String(value).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
  if (m) return new Date(Number(m[3] || year), Number(m[2]) - 1, Number(m[1]));
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function dateWithTime_(date, timeText) {
  const [h, m] = String(timeText || '09:00').split(':').map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h || 0, m || 0, 0);
}
function addMinutesToTime_(timeText, minutes) {
  const [h, m] = String(timeText || '09:00').split(':').map(Number);
  const d = new Date(2000, 0, 1, h || 0, m || 0, 0);
  d.setMinutes(d.getMinutes() + minutes);
  return Utilities.formatDate(d, DEFAULT_TIMEZONE, 'HH:mm');
}
