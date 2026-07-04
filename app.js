const FALLBACK_DATA = {
  "viagem": {
    "titulo": "Mendoza & Buenos Aires em família",
    "subtitulo": "Roteiro visual com dias, reservas, pendências, documentos e links úteis.",
    "periodo": "27/07 a 10/08",
    "origem": "Puerto Iguazú / Foz do Iguaçu",
    "pessoas": "Família",
    "observacao": "Base inicial editável. Atualize pela própria tela conforme reservas forem fechadas."
  },
  "kpis": [
    {"rotulo":"Dias de viagem","valor":"15","detalhe":"Base inicial do roteiro"},
    {"rotulo":"Cidades","valor":"2","detalhe":"Buenos Aires e Mendoza"},
    {"rotulo":"Reservas","valor":"4","detalhe":"Voos, hotéis e carro"},
    {"rotulo":"Pendências","valor":"6","detalhe":"Atualize o checklist"}
  ],
  "tarefas": [
    {"id":"hotel-ba","titulo":"Confirmar hotel em Buenos Aires","descricao":"Validar localização, política de cancelamento e café da manhã.","status":"pending","critica":true},
    {"id":"hotel-mendoza","titulo":"Confirmar hotel em Mendoza","descricao":"Priorizar base confortável para vinícolas e passeios com criança.","status":"pending","critica":true},
    {"id":"carro","titulo":"Aluguel de carro em Mendoza","descricao":"Conferir seguro, cadeirinha, retirada e devolução.","status":"pending","critica":false},
    {"id":"docs","titulo":"Separar documentos","descricao":"RG/passaporte, reservas, seguro viagem e comprovantes em PDF.","status":"pending","critica":true},
    {"id":"vinicolas","titulo":"Selecionar vinícolas","descricao":"Escolher experiências com boa logística e horários adequados.","status":"pending","critica":false},
    {"id":"kids","titulo":"Programação do Oliver","descricao":"Intercalar passeios leves, parques e pausas durante o dia.","status":"done","critica":false}
  ],
  "dias": [
    {
      "id":"dia-1",
      "dia":"Dia 1",
      "data":"27/07",
      "cidade":"Deslocamento",
      "titulo":"Saída e chegada",
      "manha":"Conferência de documentos, malas e deslocamento inicial.",
      "tarde":"Embarque/viagem. Guardar comprovantes e horários no celular.",
      "noite":"Chegada, check-in e jantar leve próximo ao hotel.",
      "link":""
    },
    {
      "id":"dia-2",
      "dia":"Dia 2",
      "data":"28/07",
      "cidade":"Buenos Aires",
      "titulo":"Primeiro contato com a cidade",
      "manha":"Café sem pressa e passeio leve pela região do hotel.",
      "tarde":"Puerto Madero, livraria, cafés ou passeio panorâmico.",
      "noite":"Jantar reservado ou opção próxima ao hotel."
    },
    {
      "id":"dia-3",
      "dia":"Dia 3",
      "data":"29/07",
      "cidade":"Buenos Aires",
      "titulo":"Bairros clássicos",
      "manha":"Recoleta e pontos próximos.",
      "tarde":"Palermo, parques e pausa para o Oliver.",
      "noite":"Restaurante ou experiência cultural leve."
    },
    {
      "id":"dia-4",
      "dia":"Dia 4",
      "data":"30/07",
      "cidade":"Buenos Aires",
      "titulo":"Dia flexível",
      "manha":"Passeio pendente ou atividade indoor se o clima não ajudar.",
      "tarde":"Compras, cafés ou museu.",
      "noite":"Organizar malas para deslocamento."
    },
    {
      "id":"dia-5",
      "dia":"Dia 5",
      "data":"31/07",
      "cidade":"Mendoza",
      "titulo":"Chegada em Mendoza",
      "manha":"Deslocamento para aeroporto/rodoviária conforme decisão.",
      "tarde":"Chegada, retirada do carro e check-in.",
      "noite":"Jantar tranquilo e revisão dos passeios."
    },
    {
      "id":"dia-6",
      "dia":"Dia 6",
      "data":"01/08",
      "cidade":"Mendoza",
      "titulo":"Vinícolas e paisagem",
      "manha":"Vinícola 1 com reserva confirmada.",
      "tarde":"Almoço em vinícola ou passeio cênico.",
      "noite":"Retorno cedo e descanso."
    },
    {
      "id":"dia-7",
      "dia":"Dia 7",
      "data":"02/08",
      "cidade":"Mendoza",
      "titulo":"Montanha / neve",
      "manha":"Saída para rota de montanha, conforme clima e estrada.",
      "tarde":"Paradas panorâmicas e atividade leve.",
      "noite":"Jantar próximo e checklist do dia seguinte."
    }
  ],
  "reservas": [
    {"id":"reserva-1","tipo":"Voo / deslocamento","nome":"Origem → Buenos Aires","detalhe":"Inserir código/localizador e horários.","status":"pending"},
    {"id":"reserva-2","tipo":"Hospedagem","nome":"Hotel Buenos Aires","detalhe":"Adicionar endereço, check-in e link da reserva.","status":"pending"},
    {"id":"reserva-3","tipo":"Deslocamento","nome":"Buenos Aires → Mendoza","detalhe":"Definir voo, ônibus ou carro conforme logística.","status":"pending"},
    {"id":"reserva-4","tipo":"Hospedagem","nome":"Hotel Mendoza","detalhe":"Adicionar endereço, estacionamento e café da manhã.","status":"pending"}
  ],
  "links": [
    {"id":"link-1","titulo":"Mapa geral da viagem","descricao":"Cole aqui o link do Google Maps com pontos salvos.","url":"#"},
    {"id":"link-2","titulo":"Planilha de orçamento","descricao":"Cole aqui o link do Google Sheets, se usar base externa.","url":"#"},
    {"id":"link-3","titulo":"Pasta de documentos","descricao":"Cole aqui o link do Google Drive com PDFs e comprovantes.","url":"#"}
  ],
  "documentos": [
    {"id":"documento-1","nome":"Documentos pessoais","detalhe":"RG/passaporte de todos","status":"pending"},
    {"id":"documento-2","nome":"Seguro viagem","detalhe":"Apólice e telefones de suporte","status":"pending"},
    {"id":"documento-3","nome":"Reservas de hotel","detalhe":"PDFs e comprovantes","status":"pending"},
    {"id":"documento-4","nome":"Ingressos/passeios","detalhe":"Voucher, horários e contatos","status":"pending"}
  ]
};

const STORAGE_KEY = "central_viagem_data_v3";
const EDIT_MODE_KEY = "central_viagem_edit_mode_v3";
const LEGACY_CHECKED_KEY = "trip_checked_tasks";
const FILE_DB_NAME = "central_viagem_arquivos_v1";
const FILE_STORE_NAME = "arquivos";

let state = {
  data: null,
  taskFilter: "all",
  cityFilter: "all",
  editMode: localStorage.getItem(EDIT_MODE_KEY) === "true",
  currentEditor: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

async function loadData(){
  let baseData = structuredCloneSafe(FALLBACK_DATA);

  try{
    const response = await fetch("dados/viagem.json", {cache:"no-store"});
    if(!response.ok) throw new Error("Não foi possível carregar dados/viagem.json");
    baseData = await response.json();
  }catch(error){
    console.warn("Usando dados internos de fallback:", error);
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try{
      state.data = JSON.parse(saved);
    }catch(error){
      console.warn("Dados salvos inválidos. Voltando para a base do projeto.", error);
      state.data = baseData;
    }
  }else{
    state.data = baseData;
    applyLegacyCheckedTasks();
  }

  ensureDataShape();
  render();
  showToast(saved ? "Dados locais carregados." : "Base inicial carregada.");
}

function structuredCloneSafe(value){
  return JSON.parse(JSON.stringify(value));
}

function ensureDataShape(){
  const data = state.data || {};
  data.viagem = data.viagem || {};
  data.kpis = Array.isArray(data.kpis) ? data.kpis : [];
  data.tarefas = Array.isArray(data.tarefas) ? data.tarefas : [];
  data.dias = Array.isArray(data.dias) ? data.dias : [];
  data.reservas = Array.isArray(data.reservas) ? data.reservas : [];
  data.links = Array.isArray(data.links) ? data.links : [];
  data.documentos = Array.isArray(data.documentos) ? data.documentos : [];

  data.tarefas.forEach((item, index) => item.id = item.id || `task-${index + 1}-${uid()}`);
  data.dias.forEach((item, index) => item.id = item.id || `day-${index + 1}-${uid()}`);
  data.reservas.forEach((item, index) => item.id = item.id || `booking-${index + 1}-${uid()}`);
  data.links.forEach((item, index) => item.id = item.id || `link-${index + 1}-${uid()}`);
  data.documentos.forEach((item, index) => {
    item.id = item.id || `doc-${index + 1}-${uid()}`;
    item.url = item.url || "";
    item.status = item.status || "pending";
    item.arquivo = item.arquivo || null;
  });

  state.data = data;
}

function applyLegacyCheckedTasks(){
  try{
    const checkedTasks = JSON.parse(localStorage.getItem(LEGACY_CHECKED_KEY) || "{}");
    if(!checkedTasks || !state.data?.tarefas) return;

    state.data.tarefas = state.data.tarefas.map(task => {
      if(checkedTasks[task.id]) return {...task, status:"done"};
      return task;
    });
  }catch(error){
    console.warn("Não foi possível migrar checklist antigo.", error);
  }
}

function saveData(message = "Alteração salva neste navegador."){
  ensureDataShape();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  render();
  showToast(message);
}

function getTasks(){
  return (state.data.tarefas || []).map(task => ({...task, status: task.status || "pending"}));
}

function getProgress(){
  const tasks = getTasks();
  if(!tasks.length) return {done:0,total:0,percent:0,pending:0,criticalPending:0};

  const done = tasks.filter(task => task.status === "done").length;
  const pending = tasks.length - done;
  const criticalPending = tasks.filter(task => task.critica && task.status !== "done").length;
  const percent = Math.round((done / tasks.length) * 100);

  return {done,total:tasks.length,percent,pending,criticalPending};
}

function statusLabel(status, critical=false){
  if(status === "done") return "Concluído";
  if(critical) return "Crítico";
  return "Pendente";
}

function statusClass(status, critical=false){
  if(status === "done") return "done";
  if(critical) return "critical";
  return "pending";
}

function renderHero(){
  const viagem = state.data.viagem || {};
  const progress = getProgress();

  $("#tripTitle").textContent = viagem.titulo || "Central de Viagem";
  $("#tripSubtitle").textContent = viagem.subtitulo || "";
  $("#tripMeta").innerHTML = [
    ["📅", viagem.periodo],
    ["📍", viagem.origem],
    ["👨‍👩‍👦", viagem.pessoas],
    ["🧭", viagem.observacao]
  ].filter(([,value]) => value).map(([icon,value]) => `<span class="pill">${icon} ${escapeHtml(value)}</span>`).join("");

  $("#progressPercent").textContent = `${progress.percent}%`;
  $("#progressBar").style.width = `${progress.percent}%`;

  const text = progress.pending === 0
    ? "Tudo marcado como concluído."
    : `${progress.pending} pendência(s) abertas, sendo ${progress.criticalPending} crítica(s).`;

  $("#progressText").textContent = text;
}

function renderKpis(){
  const progress = getProgress();
  const dataKpis = state.data.kpis || [];

  const autoKpis = [
    {rotulo:"Progresso", valor:`${progress.percent}%`, detalhe:`${progress.done} de ${progress.total} tarefas concluídas`}
  ];

  $("#kpiGrid").innerHTML = [...autoKpis, ...dataKpis].slice(0, 4).map(kpi => `
    <article class="kpi">
      <span>${escapeHtml(kpi.rotulo)}</span>
      <strong>${escapeHtml(kpi.valor)}</strong>
      <small>${escapeHtml(kpi.detalhe || "")}</small>
    </article>
  `).join("");
}

function renderTasks(){
  updateFilterButtons();

  const tasks = getTasks().filter(task => {
    if(state.taskFilter === "all") return true;
    if(state.taskFilter === "critical") return task.critica && task.status !== "done";
    if(state.taskFilter === "done") return task.status === "done";
    if(state.taskFilter === "pending") return task.status !== "done";
    return true;
  });

  $("#taskBoard").innerHTML = tasks.map(task => {
    const cls = statusClass(task.status, task.critica);
    return `
      <article class="task ${task.critica && task.status !== "done" ? "is-critical" : ""}">
        <div class="task-top">
          <h3>${escapeHtml(task.titulo)}</h3>
          <span class="status ${cls}">${statusLabel(task.status, task.critica)}</span>
        </div>
        <p>${escapeHtml(task.descricao || "")}</p>
        <label>
          <input type="checkbox" data-task-check="${escapeAttribute(task.id)}" ${task.status === "done" ? "checked" : ""} />
          Marcar como concluído
        </label>
        ${editControls("task", task.id)}
      </article>
    `;
  }).join("") || `<p class="empty">Nenhuma pendência neste filtro.</p>`;
}

function renderCityFilter(){
  const select = $("#cityFilter");
  const cities = [...new Set((state.data.dias || []).map(day => day.cidade).filter(Boolean))];

  const current = state.cityFilter;
  select.innerHTML = `<option value="all">Todas</option>` + cities.map(city => (
    `<option value="${escapeAttribute(city)}">${escapeHtml(city)}</option>`
  )).join("");
  select.value = cities.includes(current) ? current : "all";
  if(select.value === "all") state.cityFilter = "all";
}

function renderTimeline(){
  const days = (state.data.dias || []).filter(day => {
    return state.cityFilter === "all" || day.cidade === state.cityFilter;
  });

  $("#timeline").innerHTML = days.map(day => `
    <article class="day-card">
      <header class="day-head">
        <div>
          <h3>${escapeHtml(day.dia)} · ${escapeHtml(day.titulo || "")}</h3>
          <small>${escapeHtml(day.data || "")}</small>
        </div>
        <div class="day-actions">
          <span class="city-tag">${escapeHtml(day.cidade || "Roteiro")}</span>
          ${dayEditControls(day.id)}
        </div>
      </header>
      <div class="period-grid">
        ${periodBlock("Manhã", day.manha)}
        ${periodBlock("Tarde", day.tarde)}
        ${periodBlock("Noite", day.noite, day.link)}
      </div>
    </article>
  `).join("") || `<p class="empty">Nenhum dia encontrado para esta cidade.</p>`;
}

function periodBlock(title, text, link){
  return `
    <div class="period">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(text || "A definir.")}</p>
      ${link ? `<a href="${safeHref(link)}" target="_blank" rel="noopener">Abrir link</a>` : ""}
    </div>
  `;
}

function renderBookings(){
  $("#bookingList").innerHTML = (state.data.reservas || []).map(item => `
    <article class="booking">
      <div class="booking-top">
        <strong>${escapeHtml(item.nome)}</strong>
        <span class="status ${statusClass(item.status)}">${statusLabel(item.status)}</span>
      </div>
      <span>${escapeHtml(item.tipo || "")}</span>
      <span>${escapeHtml(item.detalhe || "")}</span>
      ${editControls("booking", item.id)}
    </article>
  `).join("") || `<p class="empty">Nenhuma reserva cadastrada.</p>`;

  $("#linksList").innerHTML = (state.data.links || []).map(link => `
    <article class="link-card">
      <strong>${escapeHtml(link.titulo)}</strong>
      <span>${escapeHtml(link.descricao || "")}</span>
      <a href="${safeHref(link.url || "#")}" target="_blank" rel="noopener">Abrir</a>
      ${editControls("link", link.id)}
    </article>
  `).join("") || `<p class="empty">Nenhum link cadastrado.</p>`;
}

function renderDocuments(){
  $("#documentGrid").innerHTML = (state.data.documentos || []).map(doc => `
    <article class="document">
      <div class="document-top">
        <strong>${escapeHtml(doc.nome)}</strong>
        <span class="status ${statusClass(doc.status)}">${statusLabel(doc.status)}</span>
      </div>
      <span>${escapeHtml(doc.detalhe || "")}</span>
      ${doc.url ? `<a class="document-link" href="${safeHref(doc.url)}" target="_blank" rel="noopener">Abrir link externo</a>` : ""}
      ${documentAttachmentBlock(doc)}
      ${editControls("document", doc.id)}
      ${documentFileControls(doc)}
    </article>
  `).join("") || `<p class="empty">Nenhum documento cadastrado.</p>`;
}

function documentAttachmentBlock(doc){
  if(!doc.arquivo?.fileId) return `<div class="file-empty">Nenhum arquivo enviado ainda.</div>`;

  return `
    <div class="file-box">
      <span class="file-icon">📎</span>
      <div>
        <strong>${escapeHtml(doc.arquivo.nome || "Arquivo")}</strong>
        <small>${escapeHtml(formatBytes(doc.arquivo.tamanho || 0))}${doc.arquivo.enviadoEm ? ` · ${escapeHtml(doc.arquivo.enviadoEm)}` : ""}</small>
      </div>
    </div>
  `;
}

function documentFileControls(doc){
  const hasFile = Boolean(doc.arquivo?.fileId);
  return `
    <div class="file-actions">
      ${hasFile ? `<button type="button" class="mini-button" data-action="downloadDocument" data-id="${escapeAttribute(doc.id)}">Baixar arquivo</button>` : ""}
      <button type="button" class="mini-button edit-only-inline" data-action="uploadDocument" data-id="${escapeAttribute(doc.id)}">${hasFile ? "Trocar arquivo" : "Enviar arquivo"}</button>
      ${hasFile ? `<button type="button" class="mini-button danger-mini edit-only-inline" data-action="removeDocumentFile" data-id="${escapeAttribute(doc.id)}">Remover arquivo</button>` : ""}
    </div>
  `;
}

function editControls(type, id){
  if(!state.editMode) return "";
  return `
    <div class="card-actions edit-only-inline">
      <button type="button" class="mini-button" data-action="edit" data-type="${escapeAttribute(type)}" data-id="${escapeAttribute(id)}">Editar</button>
      <button type="button" class="mini-button danger-mini" data-action="delete" data-type="${escapeAttribute(type)}" data-id="${escapeAttribute(id)}">Excluir</button>
    </div>
  `;
}

function dayEditControls(id){
  if(!state.editMode) return "";
  return `
    <div class="card-actions edit-only-inline day-toolbox">
      <button type="button" class="mini-button" data-action="move" data-type="day" data-direction="up" data-id="${escapeAttribute(id)}" title="Mover dia para cima">↑</button>
      <button type="button" class="mini-button" data-action="move" data-type="day" data-direction="down" data-id="${escapeAttribute(id)}" title="Mover dia para baixo">↓</button>
      <button type="button" class="mini-button" data-action="edit" data-type="day" data-id="${escapeAttribute(id)}">Editar agenda</button>
      <button type="button" class="mini-button" data-action="duplicate" data-type="day" data-id="${escapeAttribute(id)}">Duplicar</button>
      <button type="button" class="mini-button danger-mini" data-action="delete" data-type="day" data-id="${escapeAttribute(id)}">Excluir</button>
    </div>
  `;
}

function updateFilterButtons(){
  $$('[data-task-filter]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.taskFilter === state.taskFilter);
  });
}

function updateEditModeUi(){
  document.body.classList.toggle("is-editing", state.editMode);
  const editButton = $("#editModeButton");
  if(editButton){
    editButton.textContent = state.editMode ? "Sair da edição" : "Editar";
    editButton.classList.toggle("is-active", state.editMode);
  }
}

function render(){
  renderHero();
  renderKpis();
  renderTasks();
  renderCityFilter();
  renderTimeline();
  renderBookings();
  renderDocuments();
  updateEditModeUi();
}

function bindEvents(){
  $$(".filter").forEach(button => {
    button.addEventListener("click", () => {
      state.taskFilter = button.dataset.taskFilter;
      renderTasks();
    });
  });

  $("#cityFilter").addEventListener("change", (event) => {
    state.cityFilter = event.target.value;
    renderTimeline();
  });

  $("#printButton").addEventListener("click", () => window.print());

  $("#editModeButton").addEventListener("click", () => {
    state.editMode = !state.editMode;
    localStorage.setItem(EDIT_MODE_KEY, String(state.editMode));
    render();
    showToast(state.editMode ? "Modo edição ativado." : "Modo edição desativado.");
  });

  $("#editTripButton").addEventListener("click", () => openTripEditor());
  $("#addTaskButton").addEventListener("click", () => openItemEditor("task"));
  $("#addDayButton").addEventListener("click", () => openItemEditor("day"));
  $("#renumberDaysButton").addEventListener("click", renumberDays);
  $("#addBookingButton").addEventListener("click", () => openItemEditor("booking"));
  $("#addLinkButton").addEventListener("click", () => openItemEditor("link"));
  $("#addDocumentButton").addEventListener("click", () => openItemEditor("document"));

  $("#exportButton").addEventListener("click", exportData);
  $("#importButton").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", importDataFromFile);
  $("#documentFileInput").addEventListener("change", handleDocumentFileSelected);
  $("#resetButton").addEventListener("click", resetLocalData);

  document.addEventListener("change", (event) => {
    const input = event.target.closest("[data-task-check]");
    if(!input) return;

    const task = findById(state.data.tarefas, input.dataset.taskCheck);
    if(!task) return;

    task.status = input.checked ? "done" : "pending";
    saveData(input.checked ? "Pendência concluída." : "Pendência reaberta.");
  });

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if(!actionButton) return;

    const action = actionButton.dataset.action;
    if(action === "closeModal") closeModal();
    if(action === "edit") openItemEditor(actionButton.dataset.type, actionButton.dataset.id);
    if(action === "delete") deleteItem(actionButton.dataset.type, actionButton.dataset.id);
    if(action === "move") moveItem(actionButton.dataset.type, actionButton.dataset.id, actionButton.dataset.direction);
    if(action === "duplicate") duplicateItem(actionButton.dataset.type, actionButton.dataset.id);
    if(action === "uploadDocument") uploadDocumentFile(actionButton.dataset.id);
    if(action === "downloadDocument") downloadDocumentFile(actionButton.dataset.id);
    if(action === "removeDocumentFile") removeDocumentFile(actionButton.dataset.id);
  });

  $("#editorForm").addEventListener("submit", submitEditorForm);
}

function openTripEditor(){
  state.currentEditor = {type:"trip"};
  openModal("Editar dados da viagem", [
    field("titulo", "Título", "text", state.data.viagem.titulo),
    field("subtitulo", "Subtítulo", "textarea", state.data.viagem.subtitulo),
    field("periodo", "Período", "text", state.data.viagem.periodo),
    field("origem", "Base / origem", "text", state.data.viagem.origem),
    field("pessoas", "Pessoas", "text", state.data.viagem.pessoas),
    field("observacao", "Observação", "textarea", state.data.viagem.observacao)
  ]);
}

function openItemEditor(type, id = null){
  const config = entityConfig(type);
  if(!config) return;

  const collection = state.data[config.collection] || [];
  const existing = id ? findById(collection, id) : null;
  const item = existing || config.empty();

  state.currentEditor = {type, id};
  openModal(existing ? `Editar ${config.label}` : `Adicionar ${config.label}`, config.fields(item));
}

function entityConfig(type){
  const statusOptions = [
    {value:"pending", label:"Pendente"},
    {value:"done", label:"Concluído"}
  ];

  const configs = {
    task: {
      label:"pendência",
      collection:"tarefas",
      empty: () => ({id:`task-${uid()}`, titulo:"", descricao:"", status:"pending", critica:false}),
      fields: item => [
        field("titulo", "Título", "text", item.titulo),
        field("descricao", "Descrição", "textarea", item.descricao),
        field("status", "Status", "select", item.status || "pending", statusOptions),
        field("critica", "Marcar como crítica", "checkbox", Boolean(item.critica))
      ]
    },
    day: {
      label:"dia/evento",
      collection:"dias",
      empty: () => ({id:`day-${uid()}`, dia:`Dia ${(state.data.dias || []).length + 1}`, data:"", cidade:"", titulo:"", manha:"", tarde:"", noite:"", link:""}),
      fields: item => [
        field("dia", "Nome do dia", "text", item.dia),
        field("data", "Data", "text", item.data),
        field("cidade", "Cidade / etapa", "text", item.cidade),
        field("titulo", "Título do dia", "text", item.titulo),
        field("manha", "Agenda da manhã", "textarea", item.manha),
        field("tarde", "Agenda da tarde", "textarea", item.tarde),
        field("noite", "Agenda da noite", "textarea", item.noite),
        field("link", "Link opcional do dia", "text", item.link)
      ]
    },
    booking: {
      label:"reserva",
      collection:"reservas",
      empty: () => ({id:`booking-${uid()}`, tipo:"", nome:"", detalhe:"", status:"pending"}),
      fields: item => [
        field("tipo", "Tipo", "text", item.tipo),
        field("nome", "Nome", "text", item.nome),
        field("detalhe", "Detalhes", "textarea", item.detalhe),
        field("status", "Status", "select", item.status || "pending", statusOptions)
      ]
    },
    link: {
      label:"link",
      collection:"links",
      empty: () => ({id:`link-${uid()}`, titulo:"", descricao:"", url:"#"}),
      fields: item => [
        field("titulo", "Título", "text", item.titulo),
        field("descricao", "Descrição", "textarea", item.descricao),
        field("url", "URL", "text", item.url)
      ]
    },
    document: {
      label:"documento/arquivo",
      collection:"documentos",
      empty: () => ({id:`doc-${uid()}`, nome:"", detalhe:"", url:"", status:"pending", arquivo:null}),
      fields: item => [
        field("nome", "Nome", "text", item.nome),
        field("detalhe", "Detalhes", "textarea", item.detalhe),
        field("url", "Link externo opcional", "text", item.url),
        field("status", "Status", "select", item.status || "pending", statusOptions)
      ]
    }
  };

  return configs[type];
}

function field(name, label, type, value = "", options = []){
  return {name, label, type, value, options};
}

function openModal(title, fields){
  $("#editorTitle").textContent = title;
  $("#editorFields").innerHTML = fields.map(renderField).join("");
  $("#editorModal").hidden = false;
  document.body.classList.add("modal-open");

  setTimeout(() => {
    const firstInput = $("#editorFields input:not([type='checkbox']), #editorFields textarea, #editorFields select");
    if(firstInput) firstInput.focus();
  }, 60);
}

function renderField(item){
  const value = item.type === "checkbox" ? Boolean(item.value) : escapeAttribute(item.value || "");

  if(item.type === "textarea"){
    return `
      <label class="form-field full-field">
        <span>${escapeHtml(item.label)}</span>
        <textarea name="${escapeAttribute(item.name)}" rows="4">${escapeHtml(item.value || "")}</textarea>
      </label>
    `;
  }

  if(item.type === "select"){
    return `
      <label class="form-field">
        <span>${escapeHtml(item.label)}</span>
        <select name="${escapeAttribute(item.name)}">
          ${item.options.map(option => `<option value="${escapeAttribute(option.value)}" ${option.value === item.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  if(item.type === "checkbox"){
    return `
      <label class="form-field checkbox-field full-field">
        <input type="checkbox" name="${escapeAttribute(item.name)}" ${value ? "checked" : ""} />
        <span>${escapeHtml(item.label)}</span>
      </label>
    `;
  }

  return `
    <label class="form-field">
      <span>${escapeHtml(item.label)}</span>
      <input type="text" name="${escapeAttribute(item.name)}" value="${value}" />
    </label>
  `;
}

function submitEditorForm(event){
  event.preventDefault();
  if(!state.currentEditor) return;

  const form = new FormData(event.currentTarget);
  const type = state.currentEditor.type;

  if(type === "trip"){
    state.data.viagem = {
      titulo: clean(form.get("titulo")),
      subtitulo: clean(form.get("subtitulo")),
      periodo: clean(form.get("periodo")),
      origem: clean(form.get("origem")),
      pessoas: clean(form.get("pessoas")),
      observacao: clean(form.get("observacao"))
    };
    closeModal();
    saveData("Dados da viagem salvos.");
    return;
  }

  const config = entityConfig(type);
  if(!config) return;

  const collection = state.data[config.collection] || [];
  const item = collectItemFromForm(type, form, state.currentEditor.id);

  if(state.currentEditor.id){
    const index = collection.findIndex(entry => entry.id === state.currentEditor.id);
    if(index >= 0) collection[index] = {...collection[index], ...item, id: state.currentEditor.id};
  }else{
    collection.push(item);
  }

  state.data[config.collection] = collection;
  closeModal();
  saveData("Item salvo.");
}

function collectItemFromForm(type, form, existingId){
  const id = existingId || `${type}-${uid()}`;

  if(type === "task"){
    return {
      id,
      titulo: clean(form.get("titulo")) || "Nova pendência",
      descricao: clean(form.get("descricao")),
      status: clean(form.get("status")) || "pending",
      critica: form.has("critica")
    };
  }

  if(type === "day"){
    return {
      id,
      dia: clean(form.get("dia")) || "Novo dia",
      data: clean(form.get("data")),
      cidade: clean(form.get("cidade")) || "Roteiro",
      titulo: clean(form.get("titulo")) || "A definir",
      manha: clean(form.get("manha")),
      tarde: clean(form.get("tarde")),
      noite: clean(form.get("noite")),
      link: clean(form.get("link"))
    };
  }

  if(type === "booking"){
    return {
      id,
      tipo: clean(form.get("tipo")),
      nome: clean(form.get("nome")) || "Nova reserva",
      detalhe: clean(form.get("detalhe")),
      status: clean(form.get("status")) || "pending"
    };
  }

  if(type === "link"){
    return {
      id,
      titulo: clean(form.get("titulo")) || "Novo link",
      descricao: clean(form.get("descricao")),
      url: clean(form.get("url")) || "#"
    };
  }

  if(type === "document"){
    return {
      id,
      nome: clean(form.get("nome")) || "Novo documento",
      detalhe: clean(form.get("detalhe")),
      url: clean(form.get("url")),
      status: clean(form.get("status")) || "pending"
    };
  }

  return {id};
}

async function deleteItem(type, id){
  const config = entityConfig(type);
  if(!config || !id) return;

  const item = findById(state.data[config.collection], id);
  const label = item?.titulo || item?.nome || item?.dia || item?.tipo || "este item";

  if(!confirm(`Excluir "${label}"?`)) return;

  if(type === "document" && item?.arquivo?.fileId){
    await deleteStoredFile(item.arquivo.fileId);
  }

  state.data[config.collection] = (state.data[config.collection] || []).filter(entry => entry.id !== id);
  saveData("Item excluído.");
}

function moveItem(type, id, direction){
  const config = entityConfig(type);
  if(!config || !id) return;

  const collection = state.data[config.collection] || [];
  const index = collection.findIndex(item => item.id === id);
  if(index < 0) return;

  const target = direction === "up" ? index - 1 : index + 1;
  if(target < 0 || target >= collection.length) return;

  [collection[index], collection[target]] = [collection[target], collection[index]];
  saveData(direction === "up" ? "Item movido para cima." : "Item movido para baixo.");
}

function duplicateItem(type, id){
  const config = entityConfig(type);
  if(!config || !id) return;

  const collection = state.data[config.collection] || [];
  const index = collection.findIndex(item => item.id === id);
  if(index < 0) return;

  const copy = structuredCloneSafe(collection[index]);
  copy.id = `${type}-${uid()}`;
  if(copy.dia) copy.dia = `${copy.dia} cópia`;
  if(copy.titulo) copy.titulo = `${copy.titulo} cópia`;
  if(copy.nome) copy.nome = `${copy.nome} cópia`;
  if(type === "document") copy.arquivo = null;

  collection.splice(index + 1, 0, copy);
  saveData("Item duplicado.");
}

function renumberDays(){
  if(!confirm("Renumerar os dias conforme a ordem atual dos cartões?")) return;

  state.data.dias = (state.data.dias || []).map((day, index) => ({
    ...day,
    dia: `Dia ${String(index + 1).padStart(2, "0")}`
  }));

  saveData("Dias renumerados.");
}

function closeModal(){
  $("#editorModal").hidden = true;
  document.body.classList.remove("modal-open");
  state.currentEditor = null;
  $("#editorForm").reset();
}

function exportData(){
  const blob = new Blob([JSON.stringify(state.data, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = new Date().toISOString().slice(0,10);
  link.href = url;
  link.download = `viagem-editada-${today}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("JSON exportado.");
}

function importDataFromFile(event){
  const file = event.target.files?.[0];
  event.target.value = "";
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try{
      const imported = JSON.parse(reader.result);
      state.data = imported;
      ensureDataShape();
      saveData("JSON importado e salvo neste navegador.");
    }catch(error){
      alert("Não consegui ler esse JSON. Verifique o arquivo e tente novamente.");
      console.error(error);
    }
  };
  reader.readAsText(file);
}

function resetLocalData(){
  if(!confirm("Resetar as edições salvas neste navegador e voltar para a base do GitHub? Isso também remove arquivos enviados localmente neste aparelho.")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_CHECKED_KEY);

  try{
    if(window.indexedDB) indexedDB.deleteDatabase(FILE_DB_NAME);
  }catch(error){
    console.warn("Não foi possível apagar o banco local de arquivos.", error);
  }

  showToast("Edições locais removidas. Recarregando...");
  setTimeout(() => window.location.reload(), 500);
}

async function uploadDocumentFile(documentId){
  const doc = findById(state.data.documentos, documentId);
  if(!doc) return;

  state.pendingDocumentUploadId = documentId;
  const input = $("#documentFileInput");
  input.value = "";
  input.click();
}

async function handleDocumentFileSelected(event){
  const file = event.target.files?.[0];
  const documentId = state.pendingDocumentUploadId;
  state.pendingDocumentUploadId = null;
  event.target.value = "";

  if(!file || !documentId) return;

  const doc = findById(state.data.documentos, documentId);
  if(!doc) return;

  if(file.size > 25 * 1024 * 1024){
    alert("Arquivo muito grande para guardar no navegador. Tente usar até 25 MB ou salve em uma pasta do Google Drive e cole o link.");
    return;
  }

  if(doc.arquivo?.fileId){
    await deleteStoredFile(doc.arquivo.fileId);
  }

  const fileId = `file-${uid()}`;
  await saveStoredFile(fileId, file);

  doc.arquivo = {
    fileId,
    nome: file.name,
    tipo: file.type || "application/octet-stream",
    tamanho: file.size,
    enviadoEm: new Date().toLocaleDateString("pt-BR")
  };
  doc.status = "done";

  saveData("Arquivo enviado e salvo neste navegador.");
}

async function downloadDocumentFile(documentId){
  const doc = findById(state.data.documentos, documentId);
  if(!doc?.arquivo?.fileId) return;

  const record = await getStoredFile(doc.arquivo.fileId);
  if(!record?.blob){
    alert("Não encontrei este arquivo neste navegador. Se ele foi importado via JSON, o JSON guarda os dados, mas não carrega o arquivo em si.");
    return;
  }

  const url = URL.createObjectURL(record.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = doc.arquivo.nome || record.name || "documento";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function removeDocumentFile(documentId){
  const doc = findById(state.data.documentos, documentId);
  if(!doc?.arquivo?.fileId) return;

  if(!confirm(`Remover o arquivo de "${doc.nome}" deste navegador?`)) return;

  await deleteStoredFile(doc.arquivo.fileId);
  doc.arquivo = null;
  doc.status = "pending";
  saveData("Arquivo removido.");
}

function openFilesDb(){
  return new Promise((resolve, reject) => {
    if(!window.indexedDB){
      reject(new Error("Este navegador não suporta IndexedDB."));
      return;
    }

    const request = indexedDB.open(FILE_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if(!db.objectStoreNames.contains(FILE_STORE_NAME)){
        db.createObjectStore(FILE_STORE_NAME, {keyPath:"id"});
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveStoredFile(id, file){
  const db = await openFilesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILE_STORE_NAME, "readwrite");
    tx.objectStore(FILE_STORE_NAME).put({
      id,
      name:file.name,
      type:file.type,
      size:file.size,
      savedAt:new Date().toISOString(),
      blob:file
    });
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function getStoredFile(id){
  const db = await openFilesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILE_STORE_NAME, "readonly");
    const request = tx.objectStore(FILE_STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function deleteStoredFile(id){
  if(!id || !window.indexedDB) return;

  const db = await openFilesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILE_STORE_NAME, "readwrite");
    tx.objectStore(FILE_STORE_NAME).delete(id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

function formatBytes(bytes){
  const size = Number(bytes || 0);
  if(size < 1024) return `${size} B`;
  if(size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function findById(collection, id){
  return (collection || []).find(item => item.id === id);
}

function uid(){
  if(window.crypto?.randomUUID) return window.crypto.randomUUID().slice(0,8);
  return Math.random().toString(36).slice(2,10);
}

function clean(value){
  return String(value ?? "").trim();
}

function showToast(message){
  const toast = $("#toast");
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function safeHref(value){
  const safe = String(value ?? "#").trim();
  if(!safe || safe === "#") return "#";
  if(safe.startsWith("http://") || safe.startsWith("https://") || safe.startsWith("mailto:")) {
    return escapeAttribute(safe);
  }
  return "#";
}

function escapeHtml(value){
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function escapeAttribute(value){
  const safe = String(value ?? "").trim();
  return escapeHtml(safe);
}

bindEvents();
loadData();
