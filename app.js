const FALLBACK_DATA = {
  "viagem": {
    "titulo": "Mendoza & Buenos Aires em família",
    "subtitulo": "Roteiro visual com dias, reservas, pendências, documentos e links úteis.",
    "periodo": "27/07 a 10/08",
    "origem": "Puerto Iguazú / Foz do Iguaçu",
    "pessoas": "Família",
    "observacao": "Edite os detalhes no arquivo dados/viagem.json."
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
      "dia":"Dia 2",
      "data":"28/07",
      "cidade":"Buenos Aires",
      "titulo":"Primeiro contato com a cidade",
      "manha":"Café sem pressa e passeio leve pela região do hotel.",
      "tarde":"Puerto Madero, livraria, cafés ou passeio panorâmico.",
      "noite":"Jantar reservado ou opção próxima ao hotel."
    },
    {
      "dia":"Dia 3",
      "data":"29/07",
      "cidade":"Buenos Aires",
      "titulo":"Bairros clássicos",
      "manha":"Recoleta e pontos próximos.",
      "tarde":"Palermo, parques e pausa para o Oliver.",
      "noite":"Restaurante ou experiência cultural leve."
    },
    {
      "dia":"Dia 4",
      "data":"30/07",
      "cidade":"Buenos Aires",
      "titulo":"Dia flexível",
      "manha":"Passeio pendente ou atividade indoor se o clima não ajudar.",
      "tarde":"Compras, cafés ou museu.",
      "noite":"Organizar malas para deslocamento."
    },
    {
      "dia":"Dia 5",
      "data":"31/07",
      "cidade":"Mendoza",
      "titulo":"Chegada em Mendoza",
      "manha":"Deslocamento para aeroporto/rodoviária conforme decisão.",
      "tarde":"Chegada, retirada do carro e check-in.",
      "noite":"Jantar tranquilo e revisão dos passeios."
    },
    {
      "dia":"Dia 6",
      "data":"01/08",
      "cidade":"Mendoza",
      "titulo":"Vinícolas e paisagem",
      "manha":"Vinícola 1 com reserva confirmada.",
      "tarde":"Almoço em vinícola ou passeio cênico.",
      "noite":"Retorno cedo e descanso."
    },
    {
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
    {"tipo":"Voo / deslocamento","nome":"Origem → Buenos Aires","detalhe":"Inserir código/localizador e horários.","status":"pending"},
    {"tipo":"Hospedagem","nome":"Hotel Buenos Aires","detalhe":"Adicionar endereço, check-in e link da reserva.","status":"pending"},
    {"tipo":"Deslocamento","nome":"Buenos Aires → Mendoza","detalhe":"Definir voo, ônibus ou carro conforme logística.","status":"pending"},
    {"tipo":"Hospedagem","nome":"Hotel Mendoza","detalhe":"Adicionar endereço, estacionamento e café da manhã.","status":"pending"}
  ],
  "links": [
    {"titulo":"Mapa geral da viagem","descricao":"Cole aqui o link do Google Maps com pontos salvos.","url":"#"},
    {"titulo":"Planilha de orçamento","descricao":"Cole aqui o link do Google Sheets, se usar base externa.","url":"#"},
    {"titulo":"Pasta de documentos","descricao":"Cole aqui o link do Google Drive com PDFs e comprovantes.","url":"#"}
  ],
  "documentos": [
    {"nome":"Documentos pessoais","detalhe":"RG/passaporte de todos","status":"pending"},
    {"nome":"Seguro viagem","detalhe":"Apólice e telefones de suporte","status":"pending"},
    {"nome":"Reservas de hotel","detalhe":"PDFs e comprovantes","status":"pending"},
    {"nome":"Ingressos/passeios","detalhe":"Voucher, horários e contatos","status":"pending"}
  ]
};

let state = {
  data: null,
  taskFilter: "all",
  cityFilter: "all",
  checkedTasks: JSON.parse(localStorage.getItem("trip_checked_tasks") || "{}")
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

async function loadData(){
  try{
    const response = await fetch("dados/viagem.json", {cache:"no-store"});
    if(!response.ok) throw new Error("Não foi possível carregar dados/viagem.json");
    state.data = await response.json();
  }catch(error){
    console.warn("Usando dados internos de fallback:", error);
    state.data = FALLBACK_DATA;
  }

  render();
}

function normalizeStatus(item){
  if(state.checkedTasks[item.id]) return "done";
  return item.status || "pending";
}

function getTasks(){
  return (state.data.tarefas || []).map(task => ({
    ...task,
    status: normalizeStatus(task)
  }));
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
          <input type="checkbox" data-task-id="${escapeHtml(task.id)}" ${task.status === "done" ? "checked" : ""} />
          Marcar como concluído neste navegador
        </label>
      </article>
    `;
  }).join("") || `<p class="empty">Nenhuma pendência neste filtro.</p>`;

  $$("[data-task-id]").forEach(input => {
    input.addEventListener("change", (event) => {
      const id = event.target.dataset.taskId;
      state.checkedTasks[id] = event.target.checked;
      localStorage.setItem("trip_checked_tasks", JSON.stringify(state.checkedTasks));
      render();
    });
  });
}

function renderCityFilter(){
  const select = $("#cityFilter");
  const cities = [...new Set((state.data.dias || []).map(day => day.cidade).filter(Boolean))];

  const current = state.cityFilter;
  select.innerHTML = `<option value="all">Todas</option>` + cities.map(city => (
    `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`
  )).join("");
  select.value = current;
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
        <span class="city-tag">${escapeHtml(day.cidade || "Roteiro")}</span>
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
      ${link ? `<a href="${escapeAttribute(link)}" target="_blank" rel="noopener">Abrir link</a>` : ""}
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
    </article>
  `).join("");

  $("#linksList").innerHTML = (state.data.links || []).map(link => `
    <article class="link-card">
      <strong>${escapeHtml(link.titulo)}</strong>
      <span>${escapeHtml(link.descricao || "")}</span>
      <a href="${escapeAttribute(link.url || "#")}" target="_blank" rel="noopener">Abrir</a>
    </article>
  `).join("");
}

function renderDocuments(){
  $("#documentGrid").innerHTML = (state.data.documentos || []).map(doc => `
    <article class="document">
      <div class="document-top">
        <strong>${escapeHtml(doc.nome)}</strong>
        <span class="status ${statusClass(doc.status)}">${statusLabel(doc.status)}</span>
      </div>
      <span>${escapeHtml(doc.detalhe || "")}</span>
    </article>
  `).join("");
}

function bindEvents(){
  $$(".filter").forEach(button => {
    button.addEventListener("click", () => {
      state.taskFilter = button.dataset.taskFilter;
      $$(".filter").forEach(btn => btn.classList.toggle("is-active", btn === button));
      renderTasks();
    });
  });

  $("#cityFilter").addEventListener("change", (event) => {
    state.cityFilter = event.target.value;
    renderTimeline();
  });

  $("#printButton").addEventListener("click", () => window.print());
}

function render(){
  renderHero();
  renderKpis();
  renderTasks();
  renderCityFilter();
  renderTimeline();
  renderBookings();
  renderDocuments();
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
  const safe = String(value ?? "#").trim();
  if(safe === "#") return "#";
  if(safe.startsWith("http://") || safe.startsWith("https://") || safe.startsWith("mailto:")) {
    return escapeHtml(safe);
  }
  return escapeHtml(safe);
}

bindEvents();
loadData();
