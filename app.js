/* Central de Viagem v6 — edição na tela + integração opcional Google Sheets, Drive e Agenda
   GitHub Pages continua como interface. Google Apps Script pode virar backend gratuito. */
const STORAGE_KEY = "centralViagemV5Completo"; // mantido para migrar dados locais da v5/v5.1
const uid = () => `${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-5)}`;

const defaultData = {
  trip: {
    title: "Mendoza & Buenos Aires em família",
    subtitle: "Sistema visual para roteiro, lugares, mapa, reservas, documentos e orçamento.",
    period: "27/07 a 10/08",
    base: "Puerto Iguazú / Foz do Iguaçu",
    people: "Elton, família e Oliver",
    year: "2026"
  },
  settings: {
    syncMode: "local",
    appsScriptUrl: "",
    driveFolderUrl: "",
    editorPasswordHint: "",
    googleCalendarName: "Viagem Mendoza & Buenos Aires 2026",
    googleCalendarUrl: "",
    calendarTimezone: "America/Sao_Paulo",
    calendarId: "",
    apiKey: "",
    autoSync: false,
    lastSyncAt: "",
    driveFolderId: ""
  },
  days: [
    { id: "d1", number: 1, label: "Seg 27/07", date: "27/07", title: "Saída da viagem", city: "Deslocamento", morning: "Conferir documentos, malas, dinheiro/cartões e deslocamento até o ponto de saída.", afternoon: "Viagem/deslocamento. Guardar comprovantes e localizadores.", night: "Chegada e check-in, se aplicável. Jantar leve.", lodging: "A definir", transport: "Deslocamento inicial", notes: "" },
    { id: "d2", number: 2, label: "Ter 28/07", date: "28/07", title: "Ambientação", city: "Buenos Aires", morning: "Café e passeio leve perto do hotel.", afternoon: "Puerto Madero, cafés e pontos próximos.", night: "Jantar reservado ou restaurante próximo.", lodging: "Hotel Buenos Aires — pendente", transport: "A pé / app", notes: "Dia leve para adaptação." },
    { id: "d3", number: 3, label: "Qua 29/07", date: "29/07", title: "Recoleta e Palermo", city: "Buenos Aires", morning: "Recoleta, Flor Metálica ou pontos próximos.", afternoon: "Palermo, parques e pausa para o Oliver.", night: "Restaurante/experiência cultural leve.", lodging: "Hotel Buenos Aires — pendente", transport: "A pé / app", notes: "" },
    { id: "d4", number: 4, label: "Qui 30/07", date: "30/07", title: "Deslocamento para Mendoza", city: "Mendoza", morning: "Checkout e deslocamento.", afternoon: "Chegada em Mendoza e retirada de carro, se aplicável.", night: "Check-in e jantar tranquilo.", lodging: "Hotel Mendoza — pendente", transport: "Voo/ônibus/carro a definir", notes: "Validar melhor custo/tempo." }
  ],
  places: [
    { id: "p1", name: "Puerto Madero", city: "Buenos Aires", category: "Passeio", status: "planned", priority: "Alta", dayId: "d2", period: "afternoon", lat: -34.6118, lng: -58.3638, url: "https://www.google.com/maps/search/Puerto+Madero", location: "Puerto Madero, Buenos Aires", startTime: "14:00", endTime: "17:00", notes: "Bom para caminhada leve, fotos e restaurante." },
    { id: "p2", name: "Recoleta", city: "Buenos Aires", category: "Bairro", status: "planned", priority: "Alta", dayId: "d3", period: "morning", lat: -34.5875, lng: -58.3974, url: "https://www.google.com/maps/search/Recoleta+Buenos+Aires", location: "Recoleta, Buenos Aires", startTime: "09:00", endTime: "12:00", notes: "Região clássica, fácil de combinar com cafés e parques." },
    { id: "p3", name: "Palermo", city: "Buenos Aires", category: "Bairro/parque", status: "wishlist", priority: "Alta", dayId: "d3", period: "afternoon", lat: -34.5795, lng: -58.4309, url: "https://www.google.com/maps/search/Palermo+Buenos+Aires", location: "Palermo, Buenos Aires", startTime: "14:00", endTime: "17:00", notes: "Parques, cafés e pausa para criança." },
    { id: "p4", name: "Parque General San Martín", city: "Mendoza", category: "Parque", status: "wishlist", priority: "Média", dayId: "", period: "free", lat: -32.8892, lng: -68.8745, url: "https://www.google.com/maps/search/Parque+General+San+Martin+Mendoza", location: "Parque General San Martín, Mendoza", startTime: "09:00", endTime: "12:00", notes: "Boa opção visual e leve para família." },
    { id: "p5", name: "Parque Provincial Aconcágua", city: "Mendoza", category: "Montanha", status: "wishlist", priority: "Alta", dayId: "", period: "free", lat: -32.8244, lng: -69.9425, url: "https://www.google.com/maps/search/Parque+Provincial+Aconcagua", location: "Parque Provincial Aconcágua, Mendoza", startTime: "09:00", endTime: "15:00", notes: "Validar clima, estrada, altitude e se vale para ir com criança." }
  ],
  tasks: [
    { id: "t1", title: "Definir hotel em Buenos Aires", description: "Conferir bairro, café da manhã, cancelamento e distância dos passeios.", critical: true, done: false },
    { id: "t2", title: "Definir hotel em Mendoza", description: "Priorizar conforto, estacionamento e boa saída para vinícolas/montanha.", critical: true, done: false },
    { id: "t3", title: "Fechar deslocamento Buenos Aires → Mendoza", description: "Validar melhor custo/tempo entre voo, ônibus ou carro.", critical: true, done: false },
    { id: "t4", title: "Reservar carro em Mendoza", description: "Conferir seguro, cadeirinha, caução e horários de retirada/devolução.", critical: false, done: false },
    { id: "t5", title: "Organizar documentos em PDF", description: "Documentos pessoais, reservas, seguro viagem e comprovantes.", critical: true, done: false }
  ],
  reservations: [
    { id: "r1", type: "Hospedagem", title: "Hotel em Buenos Aires", status: "Pendente", city: "Buenos Aires", date: "27/07", time: "", endDate: "30/07", amount: 0, paid: 0, dayId: "d2", link: "", location: "Buenos Aires", endTime: "", notes: "Escolher bairro e política de cancelamento." },
    { id: "r2", type: "Carro", title: "Carro em Mendoza", status: "Pendente", city: "Mendoza", date: "30/07", time: "", endDate: "", amount: 0, paid: 0, dayId: "d4", link: "", location: "Mendoza", endTime: "", notes: "Conferir seguro e cadeirinha." }
  ],
  documents: [
    { id: "doc1", title: "Documentos pessoais", category: "Documentos pessoais", status: "Pendente", dayId: "", link: "", notes: "RG/passaporte de todos.", file: null },
    { id: "doc2", title: "Seguro viagem", category: "Seguro", status: "Pendente", dayId: "", link: "", notes: "Apólice e telefones de emergência.", file: null },
    { id: "doc3", title: "Reservas de hotéis", category: "Hospedagem", status: "Pendente", dayId: "", link: "", notes: "Links do Booking/Airbnb/Drive.", file: null }
  ],
  expenses: [
    { id: "e1", category: "Hospedagem", title: "Previsão hotéis", city: "Buenos Aires/Mendoza", date: "", expected: 0, paid: 0, status: "Previsto", person: "Família", notes: "Preencher após cotação." }
  ]
};

let data = loadData();
let currentView = "overview";
let selectedPlaceId = null;
let map = null;
let markersLayer = null;
let mapTileLayer = null;
let mapResizeObserver = null;
let mapResizeCycle = 0;
const DEFAULT_MAP_CENTER = [-34.6037, -58.3816];

function forceMapRefresh(reason = ""){
  if(!map) return;
  const mapEl = byId("map");
  if(!mapEl) return;
  mapResizeCycle += 1;
  const cycle = mapResizeCycle;
  [40, 140, 320, 700].forEach(delay => {
    setTimeout(() => {
      if(cycle !== mapResizeCycle && delay > 140) return;
      try{ map.invalidateSize({ pan:false }); }catch(err){ console.warn("Falha ao recalcular mapa", reason, err); }
    }, delay);
  });
}

function reloadMapTiles(showMessage = true){
  if(!window.L){
    byId("mapFallback").hidden = false;
    return;
  }
  if(!map){
    initMap();
  }
  forceMapRefresh("reload-manual");
  setTimeout(() => {
    try{
      if(mapTileLayer && typeof mapTileLayer.redraw === "function") mapTileLayer.redraw();
      renderMapMarkers();
      fitMap(false);
      forceMapRefresh("reload-after-redraw");
      if(showMessage) showToast("Mapa recarregado");
    }catch(err){
      console.warn("Falha ao recarregar mapa", err);
      if(showMessage) showToast("Não consegui recarregar o mapa agora");
    }
  }, 180);
}

function structuredCloneSafe(obj){ return JSON.parse(JSON.stringify(obj)); }
function loadData(){
  const keysToTry = [STORAGE_KEY, "centralViagemV4", "central_viagem_data_v3", "central_viagem_data_v2"];
  for(const key of keysToTry){
    try{
      const raw = localStorage.getItem(key);
      if(raw){
        const parsed = JSON.parse(raw);
        const normalized = normalizeData(parsed);
        if(key !== STORAGE_KEY) localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    }catch(err){ console.warn(`Falha ao carregar dados locais de ${key}`, err); }
  }
  return structuredCloneSafe(defaultData);
}
function normalizeData(source){
  const merged = structuredCloneSafe(defaultData);
  Object.assign(merged.trip, source.trip || {});
  Object.assign(merged.settings, source.settings || {});
  ["days","places","tasks","reservations","documents","expenses"].forEach(key => {
    if(Array.isArray(source[key])) merged[key] = source[key];
  });
  merged.documents = merged.documents.map(d => ({ file:null, ...d }));
  return merged;
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function saveAndRender(message="Salvo"){
  saveData();
  renderAll();
  showToast(message);
}
function byId(id){ return document.getElementById(id); }
function escapeHtml(value=""){
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[ch]));
}
function escapeAttr(value=""){ return escapeHtml(value).replace(/`/g,"&#096;"); }
function formatCurrency(value){ return Number(value || 0).toLocaleString("pt-BR", { style:"currency", currency:"BRL" }); }
function fileSize(size=0){
  if(size > 1024*1024) return `${(size/(1024*1024)).toFixed(1)} MB`;
  if(size > 1024) return `${Math.round(size/1024)} KB`;
  return `${size} bytes`;
}
function statusLabel(status){
  return ({ wishlist:"Quero visitar", planned:"No roteiro", booked:"Reservado", done:"Concluído", discarded:"Descartado" })[status] || status || "Quero visitar";
}
function periodLabel(period){
  return ({ morning:"Manhã", afternoon:"Tarde", night:"Noite", free:"Sem período" })[period] || "Sem período";
}
function dayLabel(dayId){
  const d = data.days.find(x => x.id === dayId);
  return d ? `Dia ${String(d.number).padStart(2,"0")} · ${d.date} · ${d.title}` : "Sem dia definido";
}
function uniqueCities(){
  const values = [
    ...data.days.map(d => d.city),
    ...data.places.map(p => p.city),
    ...data.reservations.map(r => r.city),
    ...data.expenses.map(e => e.city)
  ].filter(Boolean).filter(c => c !== "Deslocamento");
  return [...new Set(values)].sort((a,b) => a.localeCompare(b,"pt-BR"));
}
function findDayByDate(date){ return data.days.find(d => d.date && d.date === date); }
function nextDayNumber(){ return Math.max(0, ...data.days.map(d => Number(d.number || 0))) + 1; }
let toastTimer;
function showToast(text){
  const toast = byId("toast");
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.hidden = true, 1800);
}

function init(){
  bindEvents();
  renderAll();
  initMap();
  setTimeout(() => { renderMapMarkers(); forceMapRefresh("init-final"); }, 250);
}

function bindEvents(){
  document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
  byId("btnQuickAddPlace").onclick = () => openPlaceModal();
  byId("btnQuickAddDay").onclick = () => openDayModal();
  byId("btnEditTrip").onclick = openTripModal;
  byId("btnAddTask").onclick = () => openTaskModal();
  byId("btnAddDay").onclick = () => openDayModal();
  byId("btnRenumberDays").onclick = () => { renumberDays(); saveAndRender("Dias renumerados"); };
  byId("btnAddPlace").onclick = () => openPlaceModal();
  byId("btnAddReservation").onclick = () => openReservationModal();
  byId("btnAddDocument").onclick = () => openDocumentModal();
  byId("btnAddExpense").onclick = () => openExpenseModal();
  byId("btnSaveSettings").onclick = saveSettingsFromPanel;
  byId("btnFitMap").onclick = () => { forceMapRefresh("fit-click"); setTimeout(() => fitMap(true), 160); };
  byId("btnReloadMap") && (byId("btnReloadMap").onclick = () => reloadMapTiles(true));
  byId("btnAddMapCenter").onclick = () => {
    const center = map ? map.getCenter() : { lat: -34.6037, lng: -58.3816 };
    openPlaceModal(null, { lat: center.lat, lng: center.lng });
  };
  byId("btnExport").onclick = exportJson;
  byId("importJson").onchange = importJson;
  byId("btnReset").onclick = resetLocalData;
  byId("modalClose").onclick = closeModal;
  byId("modalCancel").onclick = closeModal;
  byId("searchPlaces").oninput = renderPlaces;
  byId("filterCity").onchange = renderPlaces;
  byId("filterDay").onchange = renderPlaces;
  byId("filterStatus").onchange = renderPlaces;
}

function setView(view){
  currentView = view;
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === `view-${view}`));
  forceMapRefresh(`view-${view}`);
}

function renderAll(){
  renderHeader();
  renderMetrics();
  renderSidebarDays();
  renderOverview();
  renderItinerary();
  renderFilters();
  renderPlaces();
  renderReservations();
  renderDocuments();
  renderBudget();
  renderSettings();
  renderMapMarkers();
}

function renderHeader(){
  byId("tripTitle").textContent = data.trip.title;
  byId("tripSubtitle").textContent = data.trip.subtitle;
  byId("sidebarSubtitle").textContent = data.trip.title.replace(" em família", "");
}
function renderMetrics(){
  const openTasks = data.tasks.filter(t => !t.done);
  const critical = openTasks.filter(t => t.critical);
  const plannedPlaces = data.places.filter(p => p.dayId).length;
  const expensesExpected = data.expenses.reduce((sum,e) => sum + Number(e.expected || 0), 0);
  const reservationsExpected = data.reservations.reduce((sum,r) => sum + Number(r.amount || 0), 0);
  const paid = data.expenses.reduce((sum,e) => sum + Number(e.paid || 0), 0) + data.reservations.reduce((sum,r) => sum + Number(r.paid || 0), 0);
  byId("metricPeriod").textContent = data.trip.period || "—";
  byId("metricBase").textContent = `Base: ${data.trip.base || "—"}`;
  byId("metricPlaces").textContent = data.places.length;
  byId("metricPlannedPlaces").textContent = `${plannedPlaces} vinculados ao roteiro`;
  byId("metricOpenTasks").textContent = openTasks.length;
  byId("metricCritical").textContent = `${critical.length} críticas`;
  byId("metricBudget").textContent = formatCurrency(expensesExpected + reservationsExpected);
  byId("metricPaid").textContent = `${formatCurrency(paid)} pago`;
}
function renderSidebarDays(){
  byId("sidebarDays").innerHTML = data.days
    .slice().sort((a,b) => Number(a.number) - Number(b.number))
    .map(day => `<button class="sidebar-day" data-jump-day="${day.id}"><span>Dia ${String(day.number).padStart(2,"0")}</span><small>${escapeHtml(day.date)}</small></button>`).join("");
  document.querySelectorAll("[data-jump-day]").forEach(btn => btn.onclick = () => {
    setView("itinerary");
    setTimeout(() => document.querySelector(`[data-day-card="${btn.dataset.jumpDay}"]`)?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
  });
}
function renderOverview(){
  const done = data.tasks.filter(t => t.done).length;
  const pct = data.tasks.length ? Math.round(done / data.tasks.length * 100) : 0;
  const nextDay = data.days.slice().sort((a,b)=>Number(a.number)-Number(b.number))[0];
  const cityRows = uniqueCities().map(city => ({
    city,
    places: data.places.filter(p => p.city === city).length,
    reservations: data.reservations.filter(r => r.city === city).length,
    expenses: data.expenses.filter(e => e.city === city).reduce((s,e)=>s+Number(e.expected||0),0)
  }));
  byId("overviewContent").innerHTML = `
    <div class="overview-grid">
      <div class="overview-box">
        <h3>Checklist da viagem</h3>
        <div class="progress-bar"><span style="width:${pct}%"></span></div>
        <p class="muted">${done} de ${data.tasks.length} pendência(s) concluída(s).</p>
        <div class="task-list">
          ${data.tasks.map(task => `
            <div class="task-item">
              <input type="checkbox" ${task.done ? "checked" : ""} data-task-toggle="${task.id}" />
              <div>
                <strong>${escapeHtml(task.title)}</strong>
                <span class="tag ${task.done ? "ok" : task.critical ? "critical" : "pending"}">${task.done ? "Concluído" : task.critical ? "Crítico" : "Pendente"}</span>
                <p>${escapeHtml(task.description)}</p>
                <div class="card-actions">
                  <button class="ghost tiny" data-edit-task="${task.id}">Editar</button>
                  <button class="ghost tiny danger" data-delete-task="${task.id}">Excluir</button>
                </div>
              </div>
            </div>`).join("") || `<div class="empty-state">Nenhuma pendência cadastrada.</div>`}
        </div>
      </div>
      <div class="overview-box">
        <h3>Resumo operacional</h3>
        <p><strong>Próximo dia:</strong><br>${nextDay ? `Dia ${String(nextDay.number).padStart(2,"0")} · ${escapeHtml(nextDay.date)} · ${escapeHtml(nextDay.title)}` : "Nenhum dia cadastrado."}</p>
        <p><strong>Pessoas:</strong><br>${escapeHtml(data.trip.people || "—")}</p>
        <div class="city-breakdown">
          ${cityRows.map(row => `
            <div class="city-row">
              <div><strong>${escapeHtml(row.city)}</strong><br><small class="muted">${row.places} lugar(es) · ${row.reservations} reserva(s)</small></div>
              <span>${formatCurrency(row.expenses)}</span>
            </div>`).join("") || `<p class="muted">Cadastre cidades, lugares e despesas para montar o resumo.</p>`}
        </div>
      </div>
    </div>`;
  document.querySelectorAll("[data-task-toggle]").forEach(el => el.onchange = () => {
    const task = data.tasks.find(t => t.id === el.dataset.taskToggle);
    if(task){ task.done = el.checked; saveAndRender("Checklist atualizado"); }
  });
  document.querySelectorAll("[data-edit-task]").forEach(el => el.onclick = () => openTaskModal(data.tasks.find(t => t.id === el.dataset.editTask)));
  document.querySelectorAll("[data-delete-task]").forEach(el => el.onclick = () => deleteItem("tasks", el.dataset.deleteTask, "Excluir pendência?"));
}
function renderItinerary(){
  const sorted = data.days.slice().sort((a,b) => Number(a.number) - Number(b.number));
  byId("itineraryList").innerHTML = sorted.map((day, idx) => {
    const periodHtml = (key, title, note) => {
      const places = data.places.filter(p => p.dayId === day.id && p.period === key);
      return `<div class="period">
        <div class="period-title">${title}</div>
        <div class="period-note">${escapeHtml(note || "")}</div>
        ${places.map(place => `<div class="mini-place"><span>📍</span><button data-select-place="${place.id}">${escapeHtml(place.name)}<small>${escapeHtml(place.category)} · ${statusLabel(place.status)}</small></button></div>`).join("")}
        <button class="ghost tiny" data-add-place-to-day="${day.id}" data-period="${key}">+ lugar neste período</button>
      </div>`;
    };
    const dayReservations = data.reservations.filter(r => r.dayId === day.id || (r.date && r.date === day.date));
    return `<article class="itinerary-day" data-day-card="${day.id}">
      <div class="day-head">
        <div class="day-title">
          <strong>Dia ${String(day.number).padStart(2,"0")} · ${escapeHtml(day.title)}</strong>
          <small>${escapeHtml(day.label || "")} · ${escapeHtml(day.date || "")} · ${escapeHtml(day.city || "")}</small>
          ${(day.lodging || day.transport) ? `<small>🏨 ${escapeHtml(day.lodging || "—")} · 🚗 ${escapeHtml(day.transport || "—")}</small>` : ""}
        </div>
        <div class="card-actions">
          <span class="tag blue">${escapeHtml(day.city || "Etapa")}</span>
          <button class="ghost tiny" data-move-day="${day.id}" data-dir="up" ${idx===0?"disabled":""}>↑</button>
          <button class="ghost tiny" data-move-day="${day.id}" data-dir="down" ${idx===sorted.length-1?"disabled":""}>↓</button>
          <button class="ghost tiny" data-duplicate-day="${day.id}">Duplicar</button>
          <button class="ghost tiny" data-edit-day="${day.id}">Editar agenda</button>
          <button class="ghost tiny danger" data-delete-day="${day.id}">Excluir</button>
        </div>
      </div>
      <div class="day-periods">
        ${periodHtml("morning", "Manhã", day.morning)}
        ${periodHtml("afternoon", "Tarde", day.afternoon)}
        ${periodHtml("night", "Noite", day.night)}
      </div>
      ${(dayReservations.length || day.notes) ? `<div class="period" style="border-right:0;border-top:1px solid var(--border);min-height:auto">
        ${day.notes ? `<p class="muted"><strong>Observações:</strong> ${escapeHtml(day.notes)}</p>` : ""}
        ${dayReservations.map(r => `<div class="mini-place"><span>🎫</span><button data-edit-reservation="${r.id}">${escapeHtml(r.title)}<small>${escapeHtml(r.type)} · ${escapeHtml(r.status)} · ${formatCurrency(r.amount)}</small></button></div>`).join("")}
      </div>` : ""}
    </article>`;
  }).join("") || `<div class="empty-state">Nenhum dia cadastrado. Clique em + Novo dia.</div>`;
  document.querySelectorAll("[data-edit-day]").forEach(el => el.onclick = () => openDayModal(data.days.find(d => d.id === el.dataset.editDay)));
  document.querySelectorAll("[data-delete-day]").forEach(el => el.onclick = () => deleteDay(el.dataset.deleteDay));
  document.querySelectorAll("[data-duplicate-day]").forEach(el => el.onclick = () => duplicateDay(el.dataset.duplicateDay));
  document.querySelectorAll("[data-move-day]").forEach(el => el.onclick = () => moveDay(el.dataset.moveDay, el.dataset.dir));
  document.querySelectorAll("[data-add-place-to-day]").forEach(el => el.onclick = () => openPlaceModal(null, { dayId: el.dataset.addPlaceToDay, period: el.dataset.period }));
  document.querySelectorAll("[data-select-place]").forEach(el => el.onclick = () => selectPlace(el.dataset.selectPlace));
  document.querySelectorAll("[data-edit-reservation]").forEach(el => el.onclick = () => openReservationModal(data.reservations.find(r => r.id === el.dataset.editReservation)));
}
function renderFilters(){
  const cityValue = byId("filterCity").value || "all";
  const dayValue = byId("filterDay").value || "all";
  byId("filterCity").innerHTML = `<option value="all">Todas as cidades</option>` + uniqueCities().map(city => `<option value="${escapeAttr(city)}">${escapeHtml(city)}</option>`).join("");
  byId("filterDay").innerHTML = `<option value="all">Todos os dias</option><option value="none">Sem dia definido</option>` + data.days.slice().sort((a,b)=>Number(a.number)-Number(b.number)).map(day => `<option value="${day.id}">Dia ${String(day.number).padStart(2,"0")} · ${escapeHtml(day.date)} · ${escapeHtml(day.title)}</option>`).join("");
  if([...byId("filterCity").options].some(o => o.value === cityValue)) byId("filterCity").value = cityValue;
  if([...byId("filterDay").options].some(o => o.value === dayValue)) byId("filterDay").value = dayValue;
}
function getFilteredPlaces(){
  const q = (byId("searchPlaces")?.value || "").trim().toLowerCase();
  const city = byId("filterCity")?.value || "all";
  const day = byId("filterDay")?.value || "all";
  const status = byId("filterStatus")?.value || "all";
  return data.places.filter(place => {
    const hay = `${place.name} ${place.city} ${place.category} ${place.notes}`.toLowerCase();
    if(q && !hay.includes(q)) return false;
    if(city !== "all" && place.city !== city) return false;
    if(day === "none" && place.dayId) return false;
    if(day !== "all" && day !== "none" && place.dayId !== day) return false;
    if(status !== "all" && place.status !== status) return false;
    return true;
  });
}
function renderPlaces(){
  const places = getFilteredPlaces();
  byId("placesList").innerHTML = places.map(place => `
    <article class="card ${place.id === selectedPlaceId ? "selected-card" : ""}">
      <h3>${escapeHtml(place.name)}</h3>
      <div class="card-meta">
        <span class="tag blue">${escapeHtml(place.city || "Cidade")}</span>
        <span class="tag pending">${escapeHtml(place.category || "Categoria")}</span>
        <span class="tag ${place.status === "done" ? "ok" : place.status === "discarded" ? "critical" : "pending"}">${statusLabel(place.status)}</span>
      </div>
      <p>${escapeHtml(place.notes || "Sem observações.")}</p>
      <p class="muted"><strong>Agenda:</strong> ${dayLabel(place.dayId)} · ${periodLabel(place.period)}</p>
      <div class="card-actions">
        <button class="ghost tiny" data-card-place="${place.id}">Ver no mapa</button>
        <button class="ghost tiny" data-edit-place="${place.id}">Editar</button>
        ${place.url ? `<a class="ghost tiny" href="${escapeAttr(place.url)}" target="_blank" rel="noopener">Google Maps</a>` : ""}
        <button class="ghost tiny danger" data-delete-place="${place.id}">Excluir</button>
      </div>
    </article>`).join("") || `<div class="empty-state">Nenhum lugar encontrado. Clique em + Novo lugar.</div>`;
  document.querySelectorAll("[data-card-place]").forEach(el => el.onclick = () => selectPlace(el.dataset.cardPlace));
  document.querySelectorAll("[data-edit-place]").forEach(el => el.onclick = () => openPlaceModal(data.places.find(p => p.id === el.dataset.editPlace)));
  document.querySelectorAll("[data-delete-place]").forEach(el => el.onclick = () => deleteItem("places", el.dataset.deletePlace, "Excluir este lugar?"));
  renderMapMarkers();
}
function renderReservations(){
  byId("reservationsList").innerHTML = data.reservations.map(res => `
    <article class="card">
      <h3>${escapeHtml(res.title)}</h3>
      <div class="card-meta">
        <span class="tag blue">${escapeHtml(res.type || "Reserva")}</span>
        <span class="tag ${res.status === "Pago" || res.status === "Reservado" ? "ok" : "pending"}">${escapeHtml(res.status || "Pendente")}</span>
        <span class="tag pending">${formatCurrency(res.amount)}</span>
      </div>
      <p>${escapeHtml(res.notes || "Sem observações.")}</p>
      <p class="muted"><strong>Data:</strong> ${escapeHtml(res.date || "—")} ${res.time ? `· ${escapeHtml(res.time)}` : ""} ${res.endDate ? `até ${escapeHtml(res.endDate)}` : ""}<br><strong>Dia:</strong> ${dayLabel(res.dayId)}</p>
      <div class="card-actions">
        <button class="ghost tiny" data-edit-res="${res.id}">Editar</button>
        ${res.link ? `<a class="ghost tiny" href="${escapeAttr(res.link)}" target="_blank" rel="noopener">Abrir link</a>` : ""}
        <button class="ghost tiny danger" data-delete-res="${res.id}">Excluir</button>
      </div>
    </article>`).join("") || `<div class="empty-state">Nenhuma reserva cadastrada.</div>`;
  document.querySelectorAll("[data-edit-res]").forEach(el => el.onclick = () => openReservationModal(data.reservations.find(r => r.id === el.dataset.editRes)));
  document.querySelectorAll("[data-delete-res]").forEach(el => el.onclick = () => deleteItem("reservations", el.dataset.deleteRes, "Excluir reserva?"));
}
function renderDocuments(){
  byId("documentsList").innerHTML = data.documents.map(doc => `
    <article class="card">
      <h3>${escapeHtml(doc.title)}</h3>
      <div class="card-meta">
        <span class="tag blue">${escapeHtml(doc.category || "Documento")}</span>
        <span class="tag ${doc.status === "Concluído" ? "ok" : "pending"}">${escapeHtml(doc.status || "Pendente")}</span>
      </div>
      <p>${escapeHtml(doc.notes || "Sem observações.")}</p>
      <p class="muted"><strong>Dia:</strong> ${dayLabel(doc.dayId)}</p>
      ${doc.file ? `<div class="file-chip"><span>📎 ${escapeHtml(doc.file.name)} · ${fileSize(doc.file.size)}</span><button class="ghost tiny" data-download-doc="${doc.id}">Baixar</button></div>` : ""}
      ${doc.driveFileId ? `<p class="muted"><strong>Drive:</strong> arquivo enviado para a pasta configurada.</p>` : ""}
      <div class="card-actions">
        <button class="ghost tiny" data-edit-doc="${doc.id}">Editar / anexar</button>
        ${doc.link ? `<a class="ghost tiny" href="${escapeAttr(doc.link)}" target="_blank" rel="noopener">Abrir link</a>` : ""}
        ${doc.file && cloudConfigured() ? `<button class="ghost tiny" data-upload-drive="${doc.id}">Enviar ao Drive</button>` : ""}
        ${doc.file ? `<button class="ghost tiny danger" data-remove-file="${doc.id}">Remover arquivo</button>` : ""}
        <button class="ghost tiny danger" data-delete-doc="${doc.id}">Excluir</button>
      </div>
    </article>`).join("") || `<div class="empty-state">Nenhum documento cadastrado.</div>`;
  document.querySelectorAll("[data-edit-doc]").forEach(el => el.onclick = () => openDocumentModal(data.documents.find(d => d.id === el.dataset.editDoc)));
  document.querySelectorAll("[data-delete-doc]").forEach(el => el.onclick = () => deleteItem("documents", el.dataset.deleteDoc, "Excluir documento?"));
  document.querySelectorAll("[data-remove-file]").forEach(el => el.onclick = () => removeDocumentFile(el.dataset.removeFile));
  document.querySelectorAll("[data-download-doc]").forEach(el => el.onclick = () => downloadDocumentFile(el.dataset.downloadDoc));
  document.querySelectorAll("[data-upload-drive]").forEach(el => el.onclick = () => uploadDocumentToDrive(el.dataset.uploadDrive));
}
function renderBudget(){
  const expectedExpenses = data.expenses.reduce((s,e)=>s+Number(e.expected||0),0);
  const paidExpenses = data.expenses.reduce((s,e)=>s+Number(e.paid||0),0);
  const expectedReservations = data.reservations.reduce((s,r)=>s+Number(r.amount||0),0);
  const paidReservations = data.reservations.reduce((s,r)=>s+Number(r.paid||0),0);
  const expected = expectedExpenses + expectedReservations;
  const paid = paidExpenses + paidReservations;
  byId("budgetSummary").innerHTML = `
    <div class="budget-box"><span>Total previsto</span><strong>${formatCurrency(expected)}</strong></div>
    <div class="budget-box"><span>Total pago</span><strong>${formatCurrency(paid)}</strong></div>
    <div class="budget-box"><span>Pendente</span><strong>${formatCurrency(Math.max(expected - paid, 0))}</strong></div>
    <div class="budget-box"><span>Itens</span><strong>${data.expenses.length + data.reservations.length}</strong></div>`;
  byId("expensesRows").innerHTML = data.expenses.map(exp => `
    <tr>
      <td><strong>${escapeHtml(exp.title)}</strong><br><small class="muted">${escapeHtml(exp.date || "Sem data")} · ${escapeHtml(exp.person || "")}</small></td>
      <td>${escapeHtml(exp.category)}</td>
      <td>${escapeHtml(exp.city)}</td>
      <td>${formatCurrency(exp.expected)}</td>
      <td>${formatCurrency(exp.paid)}</td>
      <td><span class="tag ${exp.status === "Pago" ? "ok" : "pending"}">${escapeHtml(exp.status || "Previsto")}</span></td>
      <td><button class="ghost tiny" data-edit-exp="${exp.id}">Editar</button> <button class="ghost tiny danger" data-delete-exp="${exp.id}">Excluir</button></td>
    </tr>`).join("") || `<tr><td colspan="7">Nenhuma despesa cadastrada.</td></tr>`;
  document.querySelectorAll("[data-edit-exp]").forEach(el => el.onclick = () => openExpenseModal(data.expenses.find(e => e.id === el.dataset.editExp)));
  document.querySelectorAll("[data-delete-exp]").forEach(el => el.onclick = () => deleteItem("expenses", el.dataset.deleteExp, "Excluir despesa?"));
}
function renderSettings(){
  byId("settingsPanel").innerHTML = `
    <div class="settings-grid">
      <div class="settings-box">
        <h3>Modo atual</h3>
        <p class="muted">Hoje esta versão salva no navegador usando localStorage. Funciona no GitHub Pages sem custo.</p>
        <label>Modo de sincronização
          <select id="settingSyncMode">
            <option value="local" ${data.settings.syncMode === "local" ? "selected" : ""}>Local neste navegador</option>
            <option value="sheets" ${data.settings.syncMode === "sheets" ? "selected" : ""}>Preparar Google Sheets + Apps Script</option>
          </select>
        </label>
        <label>URL do Apps Script Web App
          <input id="settingAppsScriptUrl" value="${escapeAttr(data.settings.appsScriptUrl || "")}" placeholder="Cole aqui futuramente a URL /exec" />
        </label>
        <label>Pasta do Google Drive para documentos
          <input id="settingDriveFolderUrl" value="${escapeAttr(data.settings.driveFolderUrl || "")}" placeholder="Link da pasta no Drive" />
        </label>
        <label>Dica de senha/controle de edição
          <input id="settingEditorPasswordHint" value="${escapeAttr(data.settings.editorPasswordHint || "")}" placeholder="Ex.: apenas família" />
        </label>
      </div>
      <div class="settings-box">
        <h3>Modelo da planilha futura</h3>
        <p class="muted">Quando formos conectar ao Google Sheets, a planilha deverá ter estas abas:</p>
        <div class="code-block">Config\nDias\nLugares\nAgenda\nReservas\nDocumentos\nDespesas\nPendencias</div>
        <p class="muted">A tela já está estruturada para esses módulos. Na próxima etapa, criamos o Apps Script para ler/gravar esses dados.</p>
      </div>
      <div class="settings-box">
        <h3>Backup</h3>
        <p class="muted">Use exportar/importar para levar os dados para outro navegador enquanto ainda não há sincronização online.</p>
        <div class="card-actions">
          <button class="secondary" onclick="exportJson()">Exportar JSON</button>
          <label class="secondary file-label" for="importJson">Importar JSON</label>
        </div>
      </div>
      <div class="settings-box">
        <h3>Próxima fase</h3>
        <p class="muted">1) Aprovar a estrutura visual. 2) Criar a planilha. 3) Criar Apps Script. 4) Ativar sincronização entre celular, notebook e família.</p>
      </div>
    </div>`;
}
function saveSettingsFromPanel(){
  const syncMode = byId("settingSyncMode")?.value || "local";
  data.settings.syncMode = syncMode;
  data.settings.appsScriptUrl = byId("settingAppsScriptUrl")?.value.trim() || "";
  data.settings.driveFolderUrl = byId("settingDriveFolderUrl")?.value.trim() || "";
  data.settings.editorPasswordHint = byId("settingEditorPasswordHint")?.value.trim() || "";
  saveAndRender("Configurações salvas");
}

function initMap(){
  const fallback = byId("mapFallback");
  const mapEl = byId("map");
  if(!mapEl) return;
  if(!window.L){
    if(fallback) fallback.hidden = false;
    return;
  }
  if(map){
    forceMapRefresh("init-existing");
    return;
  }
  try{
    if(fallback) fallback.hidden = true;
    mapEl.classList.add("map-loading");
    map = L.map("map", {
      zoomControl:true,
      scrollWheelZoom:true,
      worldCopyJump:true,
      preferCanvas:true
    }).setView(DEFAULT_MAP_CENTER, 4);

    // Camada gratuita mais estável visualmente que os tiles padrão do OSM.
    // Continua usando dados do OpenStreetMap, mas servidos como base Carto.
    mapTileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom:19,
      minZoom:2,
      subdomains:"abcd",
      detectRetina:true,
      updateWhenIdle:true,
      keepBuffer:4,
      attribution:'&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    let loadedOnce = false;
    mapTileLayer.on("load", () => {
      loadedOnce = true;
      mapEl.classList.remove("map-loading");
      if(fallback) fallback.hidden = true;
      forceMapRefresh("tile-load");
    });
    mapTileLayer.on("tileerror", () => {
      // Não bloqueia o mapa por erro pontual de tile; apenas permite recarregar manualmente.
      mapEl.classList.add("map-has-tile-error");
      setTimeout(() => { if(!loadedOnce && fallback) fallback.hidden = false; }, 1800);
    });

    markersLayer = L.layerGroup().addTo(map);
    map.on("click", event => {
      if(currentView === "places"){
        const { lat, lng } = event.latlng;
        openPlaceModal(null, { lat, lng });
      }
    });

    if("ResizeObserver" in window){
      mapResizeObserver?.disconnect();
      mapResizeObserver = new ResizeObserver(() => forceMapRefresh("resize-observer"));
      mapResizeObserver.observe(mapEl);
      document.querySelector(".map-panel") && mapResizeObserver.observe(document.querySelector(".map-panel"));
      document.querySelector(".workspace") && mapResizeObserver.observe(document.querySelector(".workspace"));
    }
    window.addEventListener("resize", () => forceMapRefresh("window-resize"));
    document.addEventListener("visibilitychange", () => { if(!document.hidden) forceMapRefresh("visibility"); });
    setTimeout(() => { forceMapRefresh("init-delayed"); renderMapMarkers(); }, 300);
  }catch(err){
    console.warn("Falha ao iniciar mapa", err);
    if(fallback) fallback.hidden = false;
  }
}
function renderMapMarkers(){
  if(!map || !markersLayer) return;
  markersLayer.clearLayers();
  const coords = [];
  data.places.forEach(place => {
    const lat = Number(place.lat), lng = Number(place.lng);
    if(!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const marker = L.marker([lat,lng]).addTo(markersLayer);
    marker.bindPopup(`<strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(place.city || "")} · ${statusLabel(place.status)}<br>${dayLabel(place.dayId)}<br><button onclick="window.selectPlaceFromPopup('${place.id}')">Selecionar</button>`);
    marker.on("click", () => selectPlace(place.id, false));
    coords.push([lat,lng]);
  });
  if(!selectedPlaceId && coords.length) fitMap(false);
  renderSelectedPlaceBox();
  forceMapRefresh("markers-rendered");
}
window.selectPlaceFromPopup = function(id){ selectPlace(id, false); };
function selectPlace(id, fly=true){
  selectedPlaceId = id;
  const place = data.places.find(p => p.id === id);
  if(place && map && fly){
    forceMapRefresh("select-place");
    const lat = Number(place.lat), lng = Number(place.lng);
    if(Number.isFinite(lat) && Number.isFinite(lng)) map.flyTo([lat,lng], Math.max(map.getZoom(), 12), { duration:.7 });
  }
  renderPlaces();
  renderSelectedPlaceBox();
}
function renderSelectedPlaceBox(){
  const box = byId("selectedPlaceBox");
  const place = data.places.find(p => p.id === selectedPlaceId);
  if(!place){ box.innerHTML = `<p class="muted">Selecione um lugar para ver detalhes aqui.</p>`; return; }
  box.innerHTML = `<article class="card">
    <h3>${escapeHtml(place.name)}</h3>
    <div class="card-meta"><span class="tag blue">${escapeHtml(place.city)}</span><span class="tag pending">${statusLabel(place.status)}</span></div>
    <p>${escapeHtml(place.notes || "")}</p>
    <p class="muted">${dayLabel(place.dayId)} · ${periodLabel(place.period)}</p>
    <div class="card-actions">
      <button class="ghost tiny" data-edit-selected-place="${place.id}">Editar</button>
      ${place.url ? `<a class="ghost tiny" href="${escapeAttr(place.url)}" target="_blank" rel="noopener">Google Maps</a>` : ""}
    </div>
  </article>`;
  document.querySelector("[data-edit-selected-place]")?.addEventListener("click", () => openPlaceModal(place));
}
function fitMap(showMessage=true){
  if(!map || !markersLayer) return;
  const latlngs = data.places.map(p => [Number(p.lat), Number(p.lng)]).filter(([lat,lng]) => Number.isFinite(lat) && Number.isFinite(lng));
  if(!latlngs.length){ if(showMessage) showToast("Nenhum lugar com coordenadas"); return; }
  forceMapRefresh("fit-before");
  setTimeout(() => {
    try{
      map.fitBounds(latlngs, { padding:[38,38], maxZoom:12 });
      forceMapRefresh("fit-after");
    }catch(err){
      console.warn("Falha ao aproximar mapa", err);
    }
  }, 120);
}

function input(name, label, value="", type="text", attrs=""){
  return `<label>${label}<input name="${name}" type="${type}" value="${escapeAttr(value ?? "")}" ${attrs}></label>`;
}
function textarea(name, label, value="", attrs=""){
  return `<label>${label}<textarea name="${name}" ${attrs}>${escapeHtml(value ?? "")}</textarea></label>`;
}
function selectInput(name, label, value, options){
  return `<label>${label}<select name="${name}">${options.map(opt => {
    const val = typeof opt === "string" ? opt : opt.value;
    const text = typeof opt === "string" ? opt : opt.label;
    return `<option value="${escapeAttr(val)}" ${String(val) === String(value || "") ? "selected" : ""}>${escapeHtml(text)}</option>`;
  }).join("")}</select></label>`;
}
function dayOptions(includeEmpty=true){
  const options = includeEmpty ? [{ value:"", label:"Sem dia definido" }] : [];
  return options.concat(data.days.slice().sort((a,b)=>Number(a.number)-Number(b.number)).map(d => ({ value:d.id, label:`Dia ${String(d.number).padStart(2,"0")} · ${d.date} · ${d.title}` })));
}
function openModal(title, bodyHtml, onSubmit, submitText="Salvar"){
  byId("modalTitle").textContent = title;
  byId("modalBody").innerHTML = bodyHtml;
  byId("modalSubmit").textContent = submitText;
  byId("modalBackdrop").hidden = false;
  const form = byId("modalForm");
  form.onsubmit = async event => {
    event.preventDefault();
    const fd = new FormData(form);
    await onSubmit(fd, form);
  };
  setTimeout(() => form.querySelector("input,textarea,select")?.focus(), 80);
}
function closeModal(){ byId("modalBackdrop").hidden = true; byId("modalForm").onsubmit = null; }

function openTripModal(){
  openModal("Editar dados da viagem", `<div class="form-grid">
    <div class="full">${input("title", "Título", data.trip.title)}</div>
    <div class="full">${textarea("subtitle", "Descrição", data.trip.subtitle)}</div>
    ${input("period", "Período", data.trip.period)}
    ${input("base", "Base inicial", data.trip.base)}
    <div class="full">${input("people", "Pessoas", data.trip.people)}</div>
  </div>`, fd => {
    ["title","subtitle","period","base","people"].forEach(k => data.trip[k] = fd.get(k).toString().trim());
    closeModal(); saveAndRender("Viagem atualizada");
  });
}
function openDayModal(day=null){
  const d = day || { id: uid(), number: nextDayNumber(), label:"", date:"", title:"Novo dia", city:"", morning:"", afternoon:"", night:"", lodging:"", transport:"", notes:"" };
  openModal(day ? "Editar agenda do dia" : "Adicionar novo dia", `<div class="form-grid">
    ${input("number", "Número do dia", d.number, "number", 'min="1"')}
    ${input("date", "Data", d.date)}
    ${input("label", "Rótulo curto", d.label, "text", 'placeholder="Ex.: Seg 27/07"')}
    ${input("city", "Cidade/etapa", d.city)}
    <div class="full">${input("title", "Título do dia", d.title)}</div>
    <div class="full">${textarea("morning", "Manhã", d.morning)}</div>
    <div class="full">${textarea("afternoon", "Tarde", d.afternoon)}</div>
    <div class="full">${textarea("night", "Noite", d.night)}</div>
    ${input("lodging", "Hospedagem do dia", d.lodging)}
    ${input("transport", "Deslocamento do dia", d.transport)}
    <div class="full">${textarea("notes", "Observações", d.notes)}</div>
  </div>`, fd => {
    const payload = {
      id: d.id,
      number: Number(fd.get("number") || d.number || nextDayNumber()),
      date: fd.get("date").toString().trim(),
      label: fd.get("label").toString().trim(),
      city: fd.get("city").toString().trim(),
      title: fd.get("title").toString().trim() || "Dia da viagem",
      morning: fd.get("morning").toString().trim(),
      afternoon: fd.get("afternoon").toString().trim(),
      night: fd.get("night").toString().trim(),
      lodging: fd.get("lodging").toString().trim(),
      transport: fd.get("transport").toString().trim(),
      notes: fd.get("notes").toString().trim()
    };
    if(day) Object.assign(day, payload); else data.days.push(payload);
    data.days.sort((a,b)=>Number(a.number)-Number(b.number));
    closeModal(); saveAndRender("Agenda salva");
  });
}
function openPlaceModal(place=null, preset={}){
  const p = place || { id: uid(), name:"", city:"", category:"Passeio", status:"wishlist", priority:"Média", dayId:preset.dayId || "", period:preset.period || "free", lat:preset.lat || "", lng:preset.lng || "", url:"", notes:"" };
  openModal(place ? "Editar lugar" : "Adicionar lugar", `<div class="form-grid">
    <div class="full">${input("name", "Nome do lugar", p.name, "text", "required")}</div>
    ${input("city", "Cidade", p.city)}
    ${input("category", "Categoria", p.category, "text", 'placeholder="Restaurante, parque, vinícola..."')}
    ${selectInput("status", "Status", p.status, [{value:"wishlist",label:"Quero visitar"},{value:"planned",label:"No roteiro"},{value:"booked",label:"Reservado"},{value:"done",label:"Concluído"},{value:"discarded",label:"Descartado"}])}
    ${selectInput("priority", "Prioridade", p.priority, ["Alta","Média","Baixa"])}
    ${selectInput("dayId", "Vincular ao dia", p.dayId, dayOptions(true))}
    ${selectInput("period", "Período", p.period, [{value:"free",label:"Sem período"},{value:"morning",label:"Manhã"},{value:"afternoon",label:"Tarde"},{value:"night",label:"Noite"}])}
    ${input("lat", "Latitude", p.lat, "number", 'step="any" placeholder="-32.8895"')}
    ${input("lng", "Longitude", p.lng, "number", 'step="any" placeholder="-68.8458"')}
    <div class="full">${input("url", "Link Google Maps", p.url, "url")}</div>
    <div class="full">${textarea("notes", "Observações", p.notes)}</div>
  </div>`, fd => {
    const dayId = fd.get("dayId").toString();
    const status = fd.get("status").toString();
    const payload = {
      id: p.id,
      name: fd.get("name").toString().trim(),
      city: fd.get("city").toString().trim(),
      category: fd.get("category").toString().trim(),
      status: dayId && status === "wishlist" ? "planned" : status,
      priority: fd.get("priority").toString(),
      dayId,
      period: fd.get("period").toString(),
      lat: fd.get("lat") === "" ? "" : Number(fd.get("lat")),
      lng: fd.get("lng") === "" ? "" : Number(fd.get("lng")),
      url: fd.get("url").toString().trim(),
      notes: fd.get("notes").toString().trim()
    };
    if(place) Object.assign(place, payload); else data.places.push(payload);
    selectedPlaceId = payload.id;
    closeModal(); saveAndRender("Lugar salvo");
  });
}
function openTaskModal(task=null){
  const t = task || { id: uid(), title:"", description:"", critical:false, done:false };
  openModal(task ? "Editar pendência" : "Nova pendência", `<div class="form-grid">
    <div class="full">${input("title", "Título", t.title, "text", "required")}</div>
    <div class="full">${textarea("description", "Descrição", t.description)}</div>
    ${selectInput("critical", "Prioridade", t.critical ? "true" : "false", [{value:"true",label:"Crítica"},{value:"false",label:"Normal"}])}
    ${selectInput("done", "Status", t.done ? "true" : "false", [{value:"false",label:"Pendente"},{value:"true",label:"Concluída"}])}
  </div>`, fd => {
    const payload = { id:t.id, title:fd.get("title").toString().trim(), description:fd.get("description").toString().trim(), critical:fd.get("critical") === "true", done:fd.get("done") === "true" };
    if(task) Object.assign(task, payload); else data.tasks.push(payload);
    closeModal(); saveAndRender("Pendência salva");
  });
}
function openReservationModal(res=null){
  const r = res || { id: uid(), type:"Hospedagem", title:"", status:"Pendente", city:"", date:"", time:"", endDate:"", amount:0, paid:0, dayId:"", link:"", notes:"" };
  openModal(res ? "Editar reserva" : "Nova reserva", `<div class="form-grid">
    ${selectInput("type", "Tipo", r.type, ["Voo","Hospedagem","Carro","Trem/ônibus","Passeio","Restaurante","Seguro","Outro"])}
    ${selectInput("status", "Status", r.status, ["Pendente","Reservado","Pago","Cancelado"])}
    <div class="full">${input("title", "Título", r.title, "text", "required")}</div>
    ${input("city", "Cidade", r.city)}
    ${input("date", "Data inicial", r.date)}
    ${input("time", "Horário", r.time)}
    ${input("endDate", "Data final", r.endDate)}
    ${selectInput("dayId", "Vincular ao dia", r.dayId, dayOptions(true))}
    ${input("amount", "Valor previsto", r.amount, "number", 'step="0.01"')}
    ${input("paid", "Valor pago", r.paid, "number", 'step="0.01"')}
    <div class="full">${input("link", "Link da reserva", r.link, "url")}</div>
    <div class="full">${textarea("notes", "Observações", r.notes)}</div>
  </div>`, fd => {
    const payload = {
      id:r.id, type:fd.get("type").toString(), status:fd.get("status").toString(), title:fd.get("title").toString().trim(), city:fd.get("city").toString().trim(), date:fd.get("date").toString().trim(), time:fd.get("time").toString().trim(), endDate:fd.get("endDate").toString().trim(), dayId:fd.get("dayId").toString(), amount:Number(fd.get("amount")||0), paid:Number(fd.get("paid")||0), link:fd.get("link").toString().trim(), notes:fd.get("notes").toString().trim()
    };
    if(res) Object.assign(res, payload); else data.reservations.push(payload);
    closeModal(); saveAndRender("Reserva salva");
  });
}
function openDocumentModal(doc=null){
  const d = doc || { id: uid(), title:"", category:"Documento", status:"Pendente", dayId:"", link:"", notes:"", file:null };
  openModal(doc ? "Editar documento / anexo" : "Novo documento / anexo", `<div class="form-grid">
    <div class="full">${input("title", "Título", d.title, "text", "required")}</div>
    ${selectInput("category", "Categoria", d.category, ["Documentos pessoais","Seguro","Hospedagem","Deslocamentos","Passeios","Orçamento","Comprovante","Outro"])}
    ${selectInput("status", "Status", d.status, ["Pendente","Concluído"])}
    ${selectInput("dayId", "Vincular ao dia", d.dayId, dayOptions(true))}
    <div class="full">${input("link", "Link externo / Google Drive", d.link, "url")}</div>
    <div class="full"><label>Enviar arquivo neste navegador<input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx" /></label>${d.file ? `<div class="file-chip"><span>Arquivo atual: ${escapeHtml(d.file.name)} · ${fileSize(d.file.size)}</span></div>` : ""}</div>
    <div class="full">${textarea("notes", "Observações", d.notes)}</div>
  </div>`, async (fd, form) => {
    const fileInput = form.querySelector('input[name="file"]');
    const file = fileInput?.files?.[0];
    const payload = { id:d.id, title:fd.get("title").toString().trim(), category:fd.get("category").toString(), status:fd.get("status").toString(), dayId:fd.get("dayId").toString(), link:fd.get("link").toString().trim(), notes:fd.get("notes").toString().trim(), file:d.file || null };
    if(file){
      if(file.size > 3 * 1024 * 1024){
        alert("Para esta versão local, envie arquivos de até 3 MB ou use link do Google Drive. Arquivos maiores podem estourar o limite do navegador.");
        return;
      }
      payload.file = await readFileAsDataUrl(file);
    }
    if(doc) Object.assign(doc, payload); else data.documents.push(payload);
    closeModal(); saveAndRender("Documento salvo");
  });
}
function readFileAsDataUrl(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve({ name:file.name, type:file.type || "application/octet-stream", size:file.size, dataUrl:reader.result });
    reader.readAsDataURL(file);
  });
}
function downloadDocumentFile(id){
  const doc = data.documents.find(d => d.id === id);
  if(!doc?.file?.dataUrl){ showToast("Arquivo não encontrado"); return; }
  const a = document.createElement("a");
  a.href = doc.file.dataUrl;
  a.download = doc.file.name || "documento";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
function removeDocumentFile(id){
  if(!confirm("Remover o arquivo anexado deste navegador?")) return;
  const doc = data.documents.find(d => d.id === id);
  if(doc){ doc.file = null; saveAndRender("Arquivo removido"); }
}
function openExpenseModal(exp=null){
  const e = exp || { id:uid(), category:"Alimentação", title:"", city:"", date:"", expected:0, paid:0, status:"Previsto", person:"Família", notes:"" };
  openModal(exp ? "Editar despesa" : "Nova despesa", `<div class="form-grid">
    <div class="full">${input("title", "Descrição", e.title, "text", "required")}</div>
    ${selectInput("category", "Categoria", e.category, ["Hospedagem","Transporte","Alimentação","Passeios","Compras","Documentos","Seguro","Outro"])}
    ${selectInput("status", "Status", e.status, ["Previsto","Pago","Pendente","Cancelado"])}
    ${input("city", "Cidade", e.city)}
    ${input("date", "Data", e.date)}
    ${input("expected", "Valor previsto", e.expected, "number", 'step="0.01"')}
    ${input("paid", "Valor pago", e.paid, "number", 'step="0.01"')}
    ${input("person", "Responsável", e.person)}
    <div class="full">${textarea("notes", "Observações", e.notes)}</div>
  </div>`, fd => {
    const payload = { id:e.id, title:fd.get("title").toString().trim(), category:fd.get("category").toString(), status:fd.get("status").toString(), city:fd.get("city").toString().trim(), date:fd.get("date").toString().trim(), expected:Number(fd.get("expected")||0), paid:Number(fd.get("paid")||0), person:fd.get("person").toString().trim(), notes:fd.get("notes").toString().trim() };
    if(exp) Object.assign(exp, payload); else data.expenses.push(payload);
    closeModal(); saveAndRender("Despesa salva");
  });
}

function deleteItem(collection, id, message="Excluir item?"){
  if(!confirm(message)) return;
  data[collection] = data[collection].filter(item => item.id !== id);
  if(collection === "places" && selectedPlaceId === id) selectedPlaceId = null;
  saveAndRender("Item excluído");
}
function deleteDay(id){
  const hasPlaces = data.places.some(p => p.dayId === id);
  const text = hasPlaces ? "Este dia tem lugares vinculados. Excluir mesmo assim? Os lugares ficarão sem dia definido." : "Excluir este dia?";
  if(!confirm(text)) return;
  data.days = data.days.filter(d => d.id !== id);
  data.places.forEach(p => { if(p.dayId === id){ p.dayId = ""; p.period = "free"; if(p.status === "planned") p.status = "wishlist"; } });
  data.reservations.forEach(r => { if(r.dayId === id) r.dayId = ""; });
  data.documents.forEach(d => { if(d.dayId === id) d.dayId = ""; });
  renumberDays();
  saveAndRender("Dia excluído");
}
function duplicateDay(id){
  const source = data.days.find(d => d.id === id);
  if(!source) return;
  const clone = { ...structuredCloneSafe(source), id:uid(), number: nextDayNumber(), title:`${source.title} (cópia)`, label:"", date:"" };
  data.days.push(clone);
  data.days.sort((a,b)=>Number(a.number)-Number(b.number));
  saveAndRender("Dia duplicado");
}
function moveDay(id, dir){
  const sorted = data.days.slice().sort((a,b)=>Number(a.number)-Number(b.number));
  const idx = sorted.findIndex(d => d.id === id);
  const targetIdx = dir === "up" ? idx - 1 : idx + 1;
  if(idx < 0 || targetIdx < 0 || targetIdx >= sorted.length) return;
  const temp = sorted[idx].number;
  sorted[idx].number = sorted[targetIdx].number;
  sorted[targetIdx].number = temp;
  data.days = sorted.sort((a,b)=>Number(a.number)-Number(b.number));
  renumberDays(false);
  saveAndRender("Ordem atualizada");
}
function renumberDays(updateLabels=true){
  data.days.sort((a,b)=>Number(a.number)-Number(b.number)).forEach((day, index) => {
    day.number = index + 1;
    if(updateLabels && !day.label && day.date) day.label = day.date;
  });
}

function exportJson(){
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `central-viagem-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Backup exportado");
}
function importJson(event){
  const file = event.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const parsed = JSON.parse(reader.result);
      if(!confirm("Importar este backup e substituir os dados locais?")) return;
      data = normalizeData(parsed);
      saveAndRender("Backup importado");
    }catch(err){ alert("Arquivo JSON inválido."); }
    event.target.value = "";
  };
  reader.readAsText(file);
}
function resetLocalData(){
  if(!confirm("Resetar os dados locais e voltar para a base inicial?")) return;
  localStorage.removeItem(STORAGE_KEY);
  data = structuredCloneSafe(defaultData);
  selectedPlaceId = null;
  saveAndRender("Dados resetados");
}


/* =========================
   v5.2 — Calendário compartilhado + Google Maps
   Mantém localStorage, mas adiciona botões para Google Agenda e melhor integração com links do Google Maps.
========================= */

function normalizeData(source){
  const merged = structuredCloneSafe(defaultData);
  Object.assign(merged.trip, source.trip || {});
  Object.assign(merged.settings, source.settings || {});
  ["days","places","tasks","reservations","documents","expenses"].forEach(key => {
    if(Array.isArray(source[key])) merged[key] = source[key];
  });
  merged.trip.year = merged.trip.year || String(new Date().getFullYear());
  merged.settings.googleCalendarName = merged.settings.googleCalendarName || `Viagem ${merged.trip.title || ""}`.trim();
  merged.settings.googleCalendarUrl = merged.settings.googleCalendarUrl || "";
  merged.settings.calendarTimezone = merged.settings.calendarTimezone || "America/Sao_Paulo";
  merged.places = merged.places.map(p => ({ location: p.city || "", startTime: defaultPeriodStart(p.period), endTime: defaultPeriodEnd(p.period), ...p }));
  merged.reservations = merged.reservations.map(r => ({ location: r.city || "", endTime: "", ...r }));
  merged.documents = merged.documents.map(d => ({ file:null, ...d }));
  return merged;
}

function ensureV52Defaults(){
  data = normalizeData(data);
  saveData();
}

function defaultPeriodStart(period){
  return ({ morning:"09:00", afternoon:"14:00", night:"19:00" })[period] || "09:00";
}
function defaultPeriodEnd(period){
  return ({ morning:"12:00", afternoon:"17:00", night:"21:00" })[period] || "10:00";
}
function pad2(n){ return String(n).padStart(2,"0"); }
function addOneDay(ymd){
  const d = new Date(`${ymd.slice(0,4)}-${ymd.slice(4,6)}-${ymd.slice(6,8)}T12:00:00`);
  d.setDate(d.getDate()+1);
  return `${d.getFullYear()}${pad2(d.getMonth()+1)}${pad2(d.getDate())}`;
}
function parseDateParts(value){
  const raw = String(value || "").trim();
  if(!raw) return null;
  let m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(m) return { y:Number(m[1]), m:Number(m[2]), d:Number(m[3]) };
  m = raw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if(m){
    let year = m[3] ? Number(m[3]) : Number(data.trip.year || new Date().getFullYear());
    if(year < 100) year += 2000;
    return { y:year, m:Number(m[2]), d:Number(m[1]) };
  }
  return null;
}
function calendarDateStamp(value){
  const p = parseDateParts(value);
  if(!p) return "";
  return `${p.y}${pad2(p.m)}${pad2(p.d)}`;
}
function cleanTime(value, fallback=""){
  const raw = String(value || "").trim();
  const m = raw.match(/^(\d{1,2}):(\d{2})$/);
  if(m) return `${pad2(m[1])}:${m[2]}`;
  return fallback;
}
function calendarDatesParam(dateValue, startTime="", endTime=""){
  const d = calendarDateStamp(dateValue);
  if(!d) return "";
  const start = cleanTime(startTime);
  const end = cleanTime(endTime);
  if(start){
    const [sh, sm] = start.split(":");
    const [eh, em] = cleanTime(endTime, "").split(":");
    const endHour = eh || String(Math.min(Number(sh)+1, 23));
    const endMin = em || sm || "00";
    return `${d}T${pad2(sh)}${sm}00/${d}T${pad2(endHour)}${endMin}00`;
  }
  return `${d}/${addOneDay(d)}`;
}
function buildGoogleCalendarUrl(event){
  const dates = calendarDatesParam(event.date, event.startTime, event.endTime);
  if(!dates){ showToast("Preencha uma data válida antes de enviar para a agenda"); return ""; }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title || data.trip.title || "Evento da viagem",
    dates,
    details: event.details || "",
    location: event.location || "",
    ctz: data.settings.calendarTimezone || "America/Sao_Paulo"
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
function openGoogleCalendarForEvent(event){
  const url = buildGoogleCalendarUrl(event);
  if(url) window.open(url, "_blank", "noopener");
}
function placeCalendarEvent(place){
  const day = data.days.find(d => d.id === place.dayId);
  const start = place.startTime || defaultPeriodStart(place.period);
  const end = place.endTime || defaultPeriodEnd(place.period);
  return {
    title: `${place.name} — ${data.trip.title}`,
    date: day?.date || "",
    startTime: start,
    endTime: end,
    location: place.location || place.url || `${place.name}, ${place.city || ""}`,
    details: [
      `Lugar cadastrado na Central de Viagem.`,
      `Cidade: ${place.city || "—"}`,
      `Categoria: ${place.category || "—"}`,
      `Dia: ${dayLabel(place.dayId)}`,
      place.url ? `Google Maps: ${place.url}` : "",
      place.notes ? `Observações: ${place.notes}` : ""
    ].filter(Boolean).join("\n")
  };
}
function reservationCalendarEvent(res){
  return {
    title: `${res.type || "Reserva"}: ${res.title}`,
    date: res.date || data.days.find(d => d.id === res.dayId)?.date || "",
    startTime: res.time || "",
    endTime: res.endTime || "",
    location: res.location || res.city || res.link || "",
    details: [
      `Reserva/compromisso cadastrado na Central de Viagem.`,
      `Status: ${res.status || "—"}`,
      `Cidade: ${res.city || "—"}`,
      res.link ? `Link: ${res.link}` : "",
      res.notes ? `Observações: ${res.notes}` : ""
    ].filter(Boolean).join("\n")
  };
}
function dayCalendarEvent(day){
  const places = data.places.filter(p => p.dayId === day.id);
  const reservations = data.reservations.filter(r => r.dayId === day.id || r.date === day.date);
  return {
    title: `Dia ${String(day.number).padStart(2,"0")} — ${day.title}`,
    date: day.date,
    startTime: "",
    endTime: "",
    location: day.city || data.trip.base || "",
    details: [
      `Agenda do dia na viagem ${data.trip.title}.`,
      day.morning ? `Manhã: ${day.morning}` : "",
      day.afternoon ? `Tarde: ${day.afternoon}` : "",
      day.night ? `Noite: ${day.night}` : "",
      day.lodging ? `Hospedagem: ${day.lodging}` : "",
      day.transport ? `Deslocamento: ${day.transport}` : "",
      places.length ? `Lugares: ${places.map(p => p.name).join(", ")}` : "",
      reservations.length ? `Reservas: ${reservations.map(r => r.title).join(", ")}` : "",
      day.notes ? `Observações: ${day.notes}` : ""
    ].filter(Boolean).join("\n")
  };
}
function downloadIcsForEvent(event, filename="evento-viagem.ics"){
  const dates = calendarDatesParam(event.date, event.startTime, event.endTime);
  if(!dates){ showToast("Preencha uma data válida antes de gerar o ICS"); return; }
  const [start, end] = dates.split("/");
  const isAllDay = !String(start).includes("T");
  const dtStart = isAllDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART;TZID=${data.settings.calendarTimezone || "America/Sao_Paulo"}:${start}`;
  const dtEnd = isAllDay ? `DTEND;VALUE=DATE:${end}` : `DTEND;TZID=${data.settings.calendarTimezone || "America/Sao_Paulo"}:${end}`;
  const esc = v => String(v || "").replace(/\\/g,"\\\\").replace(/,/g,"\\,").replace(/;/g,"\\;").replace(/\n/g,"\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Central de Viagem//PT-BR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid()}@central-viagem`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").split(".")[0]}Z`,
    dtStart,
    dtEnd,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(event.details)}`,
    event.location ? `LOCATION:${esc(event.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR"
  ].filter(Boolean).join("\r\n");
  const blob = new Blob([ics], { type:"text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Arquivo .ics gerado");
}
function extractLatLngFromMapsUrl(url){
  const raw = String(url || "");
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/
  ];
  for(const p of patterns){
    const m = raw.match(p);
    if(m) return { lat:Number(m[1]), lng:Number(m[2]) };
  }
  return null;
}
function openMapsLink(url){
  if(!url){ showToast("Cadastre o link do Google Maps"); return; }
  window.open(url, "_blank", "noopener");
}
function copyText(text){
  if(!text){ showToast("Nada para copiar"); return; }
  navigator.clipboard?.writeText(text).then(()=>showToast("Link copiado"),()=>showToast("Não foi possível copiar"));
}
function openCalendarSetupModal(){
  openModal("Como criar a agenda compartilhada", `<div class="settings-box full-helper">
    <p class="muted">Crie uma agenda exclusiva para a viagem e compartilhe com sua esposa. Depois, use os botões <strong>Google Agenda</strong> nos dias, lugares e reservas.</p>
    <div class="code-block">1. Acesse calendar.google.com no computador.\n2. Em Outras agendas, clique em +.\n3. Escolha Criar nova agenda.\n4. Nome: ${escapeHtml(data.settings.googleCalendarName || "Viagem Mendoza & Buenos Aires 2026")}\n5. Compartilhe com o e-mail da sua esposa.\n6. Permissão sugerida: Fazer alterações nos eventos.</div>
    <p class="muted">A integração desta versão abre o Google Agenda com os dados preenchidos. Você escolhe a agenda da viagem no próprio Google Agenda antes de salvar o evento.</p>
  </div>`, () => closeModal(), "Entendi");
}

function renderItinerary(){
  const sorted = data.days.slice().sort((a,b) => Number(a.number) - Number(b.number));
  byId("itineraryList").innerHTML = sorted.map((day, idx) => {
    const periodHtml = (key, title, note) => {
      const places = data.places.filter(p => p.dayId === day.id && p.period === key);
      return `<div class="period">
        <div class="period-title">${title}</div>
        <div class="period-note">${escapeHtml(note || "")}</div>
        ${places.map(place => `<div class="mini-place"><span>📍</span><button data-select-place="${place.id}">${escapeHtml(place.name)}<small>${escapeHtml(place.category)} · ${statusLabel(place.status)} · ${place.startTime || defaultPeriodStart(place.period)}</small></button></div>`).join("")}
        <button class="ghost tiny" data-add-place-to-day="${day.id}" data-period="${key}">+ lugar neste período</button>
      </div>`;
    };
    const dayReservations = data.reservations.filter(r => r.dayId === day.id || (r.date && r.date === day.date));
    return `<article class="itinerary-day" data-day-card="${day.id}">
      <div class="day-head">
        <div class="day-title">
          <strong>Dia ${String(day.number).padStart(2,"0")} · ${escapeHtml(day.title)}</strong>
          <small>${escapeHtml(day.label || "")} · ${escapeHtml(day.date || "")} · ${escapeHtml(day.city || "")}</small>
          ${(day.lodging || day.transport) ? `<small>🏨 ${escapeHtml(day.lodging || "—")} · 🚗 ${escapeHtml(day.transport || "—")}</small>` : ""}
        </div>
        <div class="card-actions">
          <span class="tag blue">${escapeHtml(day.city || "Etapa")}</span>
          <button class="ghost tiny" data-day-calendar="${day.id}">Google Agenda</button>
          ${cloudCalendarButton("day", day.id)}
          <button class="ghost tiny" data-day-ics="${day.id}">.ics</button>
          <button class="ghost tiny" data-move-day="${day.id}" data-dir="up" ${idx===0?"disabled":""}>↑</button>
          <button class="ghost tiny" data-move-day="${day.id}" data-dir="down" ${idx===sorted.length-1?"disabled":""}>↓</button>
          <button class="ghost tiny" data-duplicate-day="${day.id}">Duplicar</button>
          <button class="ghost tiny" data-edit-day="${day.id}">Editar agenda</button>
          <button class="ghost tiny danger" data-delete-day="${day.id}">Excluir</button>
        </div>
      </div>
      <div class="day-periods">
        ${periodHtml("morning", "Manhã", day.morning)}
        ${periodHtml("afternoon", "Tarde", day.afternoon)}
        ${periodHtml("night", "Noite", day.night)}
      </div>
      ${(dayReservations.length || day.notes) ? `<div class="period" style="border-right:0;border-top:1px solid var(--border);min-height:auto">
        ${day.notes ? `<p class="muted"><strong>Observações:</strong> ${escapeHtml(day.notes)}</p>` : ""}
        ${dayReservations.map(r => `<div class="mini-place"><span>🎫</span><button data-edit-reservation="${r.id}">${escapeHtml(r.title)}<small>${escapeHtml(r.type)} · ${escapeHtml(r.status)} · ${formatCurrency(r.amount)}</small></button></div>`).join("")}
      </div>` : ""}
    </article>`;
  }).join("") || `<div class="empty-state">Nenhum dia cadastrado. Clique em + Novo dia.</div>`;
  document.querySelectorAll("[data-edit-day]").forEach(el => el.onclick = () => openDayModal(data.days.find(d => d.id === el.dataset.editDay)));
  document.querySelectorAll("[data-delete-day]").forEach(el => el.onclick = () => deleteDay(el.dataset.deleteDay));
  document.querySelectorAll("[data-duplicate-day]").forEach(el => el.onclick = () => duplicateDay(el.dataset.duplicateDay));
  document.querySelectorAll("[data-move-day]").forEach(el => el.onclick = () => moveDay(el.dataset.moveDay, el.dataset.dir));
  document.querySelectorAll("[data-add-place-to-day]").forEach(el => el.onclick = () => openPlaceModal(null, { dayId: el.dataset.addPlaceToDay, period: el.dataset.period }));
  document.querySelectorAll("[data-select-place]").forEach(el => el.onclick = () => selectPlace(el.dataset.selectPlace));
  document.querySelectorAll("[data-edit-reservation]").forEach(el => el.onclick = () => openReservationModal(data.reservations.find(r => r.id === el.dataset.editReservation)));
  document.querySelectorAll("[data-day-calendar]").forEach(el => el.onclick = () => openGoogleCalendarForEvent(dayCalendarEvent(data.days.find(d => d.id === el.dataset.dayCalendar))));
  document.querySelectorAll("[data-day-ics]").forEach(el => el.onclick = () => downloadIcsForEvent(dayCalendarEvent(data.days.find(d => d.id === el.dataset.dayIcs)), `dia-${el.dataset.dayIcs}.ics`));
  document.querySelectorAll("[data-day-cloud-calendar]").forEach(el => el.onclick = () => createCloudCalendarEvent(dayCalendarEvent(data.days.find(d => d.id === el.dataset.dayCloudCalendar))));
}

function renderPlaces(){
  const places = getFilteredPlaces();
  byId("placesList").innerHTML = places.map(place => `
    <article class="card ${place.id === selectedPlaceId ? "selected-card" : ""}">
      <h3>${escapeHtml(place.name)}</h3>
      <div class="card-meta">
        <span class="tag blue">${escapeHtml(place.city || "Cidade")}</span>
        <span class="tag pending">${escapeHtml(place.category || "Categoria")}</span>
        <span class="tag ${place.status === "done" ? "ok" : place.status === "discarded" ? "critical" : "pending"}">${statusLabel(place.status)}</span>
      </div>
      <p>${escapeHtml(place.notes || "Sem observações.")}</p>
      <p class="muted"><strong>Agenda:</strong> ${dayLabel(place.dayId)} · ${periodLabel(place.period)} · ${escapeHtml(place.startTime || defaultPeriodStart(place.period))}${place.endTime ? `–${escapeHtml(place.endTime)}` : ""}</p>
      <p class="muted"><strong>Local:</strong> ${escapeHtml(place.location || place.url || place.city || "—")}</p>
      <div class="card-actions">
        <button class="ghost tiny" data-card-place="${place.id}">Ver no mapa</button>
        <button class="ghost tiny" data-place-calendar="${place.id}">Google Agenda</button>
        ${cloudCalendarButton("place", place.id)}
        <button class="ghost tiny" data-place-ics="${place.id}">.ics</button>
        <button class="ghost tiny" data-edit-place="${place.id}">Editar</button>
        ${place.url ? `<button class="ghost tiny" data-open-maps="${place.id}">Google Maps</button><button class="ghost tiny" data-copy-maps="${place.id}">Copiar Maps</button>` : ""}
        <button class="ghost tiny danger" data-delete-place="${place.id}">Excluir</button>
      </div>
    </article>`).join("") || `<div class="empty-state">Nenhum lugar encontrado. Clique em + Novo lugar.</div>`;
  document.querySelectorAll("[data-card-place]").forEach(el => el.onclick = () => selectPlace(el.dataset.cardPlace));
  document.querySelectorAll("[data-edit-place]").forEach(el => el.onclick = () => openPlaceModal(data.places.find(p => p.id === el.dataset.editPlace)));
  document.querySelectorAll("[data-delete-place]").forEach(el => el.onclick = () => deleteItem("places", el.dataset.deletePlace, "Excluir este lugar?"));
  document.querySelectorAll("[data-place-calendar]").forEach(el => el.onclick = () => openGoogleCalendarForEvent(placeCalendarEvent(data.places.find(p => p.id === el.dataset.placeCalendar))));
  document.querySelectorAll("[data-place-ics]").forEach(el => el.onclick = () => downloadIcsForEvent(placeCalendarEvent(data.places.find(p => p.id === el.dataset.placeIcs)), `lugar-${el.dataset.placeIcs}.ics`));
  document.querySelectorAll("[data-place-cloud-calendar]").forEach(el => el.onclick = () => createCloudCalendarEvent(placeCalendarEvent(data.places.find(p => p.id === el.dataset.placeCloudCalendar))));
  document.querySelectorAll("[data-open-maps]").forEach(el => el.onclick = () => openMapsLink(data.places.find(p => p.id === el.dataset.openMaps)?.url));
  document.querySelectorAll("[data-copy-maps]").forEach(el => el.onclick = () => copyText(data.places.find(p => p.id === el.dataset.copyMaps)?.url));
  renderMapMarkers();
}

function renderReservations(){
  byId("reservationsList").innerHTML = data.reservations.map(res => `
    <article class="card">
      <h3>${escapeHtml(res.title)}</h3>
      <div class="card-meta">
        <span class="tag blue">${escapeHtml(res.type || "Reserva")}</span>
        <span class="tag ${res.status === "Pago" || res.status === "Reservado" ? "ok" : "pending"}">${escapeHtml(res.status || "Pendente")}</span>
        <span class="tag pending">${formatCurrency(res.amount)}</span>
      </div>
      <p>${escapeHtml(res.notes || "Sem observações.")}</p>
      <p class="muted"><strong>Data:</strong> ${escapeHtml(res.date || "—")} ${res.time ? `· ${escapeHtml(res.time)}` : ""}${res.endTime ? `–${escapeHtml(res.endTime)}` : ""} ${res.endDate ? `até ${escapeHtml(res.endDate)}` : ""}<br><strong>Dia:</strong> ${dayLabel(res.dayId)}<br><strong>Local:</strong> ${escapeHtml(res.location || res.city || "—")}</p>
      <div class="card-actions">
        <button class="ghost tiny" data-res-calendar="${res.id}">Google Agenda</button>
        ${cloudCalendarButton("res", res.id)}
        <button class="ghost tiny" data-res-ics="${res.id}">.ics</button>
        <button class="ghost tiny" data-edit-res="${res.id}">Editar</button>
        ${res.link ? `<a class="ghost tiny" href="${escapeAttr(res.link)}" target="_blank" rel="noopener">Abrir link</a>` : ""}
        <button class="ghost tiny danger" data-delete-res="${res.id}">Excluir</button>
      </div>
    </article>`).join("") || `<div class="empty-state">Nenhuma reserva cadastrada.</div>`;
  document.querySelectorAll("[data-edit-res]").forEach(el => el.onclick = () => openReservationModal(data.reservations.find(r => r.id === el.dataset.editRes)));
  document.querySelectorAll("[data-delete-res]").forEach(el => el.onclick = () => deleteItem("reservations", el.dataset.deleteRes, "Excluir reserva?"));
  document.querySelectorAll("[data-res-calendar]").forEach(el => el.onclick = () => openGoogleCalendarForEvent(reservationCalendarEvent(data.reservations.find(r => r.id === el.dataset.resCalendar))));
  document.querySelectorAll("[data-res-ics]").forEach(el => el.onclick = () => downloadIcsForEvent(reservationCalendarEvent(data.reservations.find(r => r.id === el.dataset.resIcs)), `reserva-${el.dataset.resIcs}.ics`));
  document.querySelectorAll("[data-res-cloud-calendar]").forEach(el => el.onclick = () => createCloudCalendarEvent(reservationCalendarEvent(data.reservations.find(r => r.id === el.dataset.resCloudCalendar))));
}

function renderSelectedPlaceBox(){
  const box = byId("selectedPlaceBox");
  const place = data.places.find(p => p.id === selectedPlaceId);
  if(!place){ box.innerHTML = `<p class="muted">Selecione um lugar para ver detalhes aqui.</p>`; return; }
  box.innerHTML = `<article class="card">
    <h3>${escapeHtml(place.name)}</h3>
    <div class="card-meta"><span class="tag blue">${escapeHtml(place.city)}</span><span class="tag pending">${statusLabel(place.status)}</span></div>
    <p>${escapeHtml(place.notes || "")}</p>
    <p class="muted">${dayLabel(place.dayId)} · ${periodLabel(place.period)} · ${escapeHtml(place.startTime || defaultPeriodStart(place.period))}</p>
    <div class="card-actions">
      <button class="ghost tiny" data-edit-selected-place="${place.id}">Editar</button>
      <button class="ghost tiny" data-selected-calendar="${place.id}">Google Agenda</button>
      ${place.url ? `<button class="ghost tiny" data-selected-maps="${place.id}">Google Maps</button>` : ""}
    </div>
  </article>`;
  document.querySelector("[data-edit-selected-place]")?.addEventListener("click", () => openPlaceModal(place));
  document.querySelector("[data-selected-calendar]")?.addEventListener("click", () => openGoogleCalendarForEvent(placeCalendarEvent(place)));
  document.querySelector("[data-selected-maps]")?.addEventListener("click", () => openMapsLink(place.url));
}

function openTripModal(){
  openModal("Editar dados da viagem", `<div class="form-grid">
    <div class="full">${input("title", "Título", data.trip.title)}</div>
    <div class="full">${textarea("subtitle", "Descrição", data.trip.subtitle)}</div>
    ${input("period", "Período", data.trip.period)}
    ${input("year", "Ano da viagem", data.trip.year || new Date().getFullYear(), "number", 'min="2024" max="2100"')}
    ${input("base", "Base inicial", data.trip.base)}
    <div class="full">${input("people", "Pessoas", data.trip.people)}</div>
  </div>`, fd => {
    ["title","subtitle","period","base","people"].forEach(k => data.trip[k] = fd.get(k).toString().trim());
    data.trip.year = fd.get("year").toString().trim() || String(new Date().getFullYear());
    closeModal(); saveAndRender("Viagem atualizada");
  });
}

function openPlaceModal(place=null, preset={}){
  const p = place || { id: uid(), name:"", city:"", category:"Passeio", status:"wishlist", priority:"Média", dayId:preset.dayId || "", period:preset.period || "free", lat:preset.lat || "", lng:preset.lng || "", url:"", location:"", startTime: defaultPeriodStart(preset.period), endTime: defaultPeriodEnd(preset.period), notes:"" };
  openModal(place ? "Editar lugar" : "Adicionar lugar", `<div class="form-grid">
    <div class="full">${input("name", "Nome do lugar", p.name, "text", "required")}</div>
    ${input("city", "Cidade", p.city)}
    ${input("category", "Categoria", p.category, "text", 'placeholder="Restaurante, parque, vinícola..."')}
    ${selectInput("status", "Status", p.status, [{value:"wishlist",label:"Quero visitar"},{value:"planned",label:"No roteiro"},{value:"booked",label:"Reservado"},{value:"done",label:"Concluído"},{value:"discarded",label:"Descartado"}])}
    ${selectInput("priority", "Prioridade", p.priority, ["Alta","Média","Baixa"])}
    ${selectInput("dayId", "Vincular ao dia", p.dayId, dayOptions(true))}
    ${selectInput("period", "Período", p.period, [{value:"free",label:"Sem período"},{value:"morning",label:"Manhã"},{value:"afternoon",label:"Tarde"},{value:"night",label:"Noite"}])}
    ${input("startTime", "Início para agenda", p.startTime || defaultPeriodStart(p.period), "time")}
    ${input("endTime", "Fim para agenda", p.endTime || defaultPeriodEnd(p.period), "time")}
    <div class="full">${input("location", "Localização para Google Agenda", p.location || p.city || p.name)}</div>
    ${input("lat", "Latitude", p.lat, "number", 'step="any" placeholder="-32.8895"')}
    ${input("lng", "Longitude", p.lng, "number", 'step="any" placeholder="-68.8458"')}
    <div class="full">${input("url", "Link Google Maps", p.url, "url", 'placeholder="https://maps.app.goo.gl/... ou URL completa do Maps"')}</div>
    <div class="full"><button type="button" class="secondary" id="btnExtractCoords">Tentar preencher coordenadas pelo link</button></div>
    <div class="full"><p class="muted">Link curto maps.app.goo.gl pode ser salvo e aberto normalmente, mas não revela latitude/longitude para desenhar o pino. Para o pino aparecer no mapa, preencha latitude/longitude ou cole uma URL completa do Google Maps que contenha @lat,lng.</p></div>
    <div class="full">${textarea("notes", "Observações", p.notes)}</div>
  </div>`, fd => {
    const dayId = fd.get("dayId").toString();
    const status = fd.get("status").toString();
    const payload = {
      id: p.id,
      name: fd.get("name").toString().trim(),
      city: fd.get("city").toString().trim(),
      category: fd.get("category").toString().trim(),
      status: dayId && status === "wishlist" ? "planned" : status,
      priority: fd.get("priority").toString(),
      dayId,
      period: fd.get("period").toString(),
      startTime: fd.get("startTime").toString(),
      endTime: fd.get("endTime").toString(),
      location: fd.get("location").toString().trim(),
      lat: fd.get("lat") === "" ? "" : Number(fd.get("lat")),
      lng: fd.get("lng") === "" ? "" : Number(fd.get("lng")),
      url: fd.get("url").toString().trim(),
      notes: fd.get("notes").toString().trim()
    };
    if(place) Object.assign(place, payload); else data.places.push(payload);
    selectedPlaceId = payload.id;
    closeModal(); saveAndRender("Lugar salvo");
  });
  setTimeout(() => {
    const btn = byId("btnExtractCoords");
    if(!btn) return;
    btn.onclick = () => {
      const form = byId("modalForm");
      const urlInput = form.querySelector('[name="url"]');
      const result = extractLatLngFromMapsUrl(urlInput?.value);
      if(result){
        form.querySelector('[name="lat"]').value = result.lat;
        form.querySelector('[name="lng"]').value = result.lng;
        showToast("Coordenadas preenchidas");
      }else{
        alert("Não encontrei latitude/longitude neste link. Link curto maps.app.goo.gl funciona como link externo, mas para criar pino no mapa é melhor colar uma URL completa com @latitude,longitude ou preencher as coordenadas manualmente.");
      }
    };
  }, 80);
}

function openReservationModal(res=null){
  const r = res || { id: uid(), type:"Hospedagem", title:"", status:"Pendente", city:"", date:"", time:"", endTime:"", endDate:"", amount:0, paid:0, dayId:"", link:"", location:"", notes:"" };
  openModal(res ? "Editar reserva" : "Nova reserva", `<div class="form-grid">
    ${selectInput("type", "Tipo", r.type, ["Voo","Hospedagem","Carro","Trem/ônibus","Passeio","Restaurante","Seguro","Outro"])}
    ${selectInput("status", "Status", r.status, ["Pendente","Reservado","Pago","Cancelado"])}
    <div class="full">${input("title", "Título", r.title, "text", "required")}</div>
    ${input("city", "Cidade", r.city)}
    ${input("date", "Data inicial", r.date, "text", 'placeholder="27/07"')}
    ${input("time", "Horário início", r.time, "time")}
    ${input("endTime", "Horário fim", r.endTime || "", "time")}
    ${input("endDate", "Data final", r.endDate)}
    ${selectInput("dayId", "Vincular ao dia", r.dayId, dayOptions(true))}
    <div class="full">${input("location", "Localização para Google Agenda", r.location || r.city)}</div>
    ${input("amount", "Valor previsto", r.amount, "number", 'step="0.01"')}
    ${input("paid", "Valor pago", r.paid, "number", 'step="0.01"')}
    <div class="full">${input("link", "Link da reserva / Google Maps / Booking", r.link, "url")}</div>
    <div class="full">${textarea("notes", "Observações", r.notes)}</div>
  </div>`, fd => {
    const payload = {
      id:r.id, type:fd.get("type").toString(), status:fd.get("status").toString(), title:fd.get("title").toString().trim(), city:fd.get("city").toString().trim(), date:fd.get("date").toString().trim(), time:fd.get("time").toString().trim(), endTime:fd.get("endTime").toString().trim(), endDate:fd.get("endDate").toString().trim(), dayId:fd.get("dayId").toString(), location:fd.get("location").toString().trim(), amount:Number(fd.get("amount")||0), paid:Number(fd.get("paid")||0), link:fd.get("link").toString().trim(), notes:fd.get("notes").toString().trim()
    };
    if(res) Object.assign(res, payload); else data.reservations.push(payload);
    closeModal(); saveAndRender("Reserva salva");
  });
}

function renderSettings(){
  byId("settingsPanel").innerHTML = `<div class="settings-grid">
      <div class="settings-box">
        <h3>Modo atual</h3>
        <p class="muted">Hoje esta versão salva no navegador usando localStorage. Funciona no GitHub Pages sem custo.</p>
        <label>Modo de sincronização
          <select id="settingSyncMode">
            <option value="local" ${data.settings.syncMode === "local" ? "selected" : ""}>Local neste navegador</option>
            <option value="sheets" ${data.settings.syncMode === "sheets" ? "selected" : ""}>Preparar Google Sheets + Apps Script</option>
          </select>
        </label>
        <label>URL do Apps Script Web App
          <input id="settingAppsScriptUrl" value="${escapeAttr(data.settings.appsScriptUrl || "")}" placeholder="Cole aqui futuramente a URL /exec" />
        </label>
        <label>Pasta do Google Drive para documentos
          <input id="settingDriveFolderUrl" value="${escapeAttr(data.settings.driveFolderUrl || "")}" placeholder="Link da pasta no Drive" />
        </label>
      </div>
      <div class="settings-box calendar-box">
        <h3>Calendário compartilhado</h3>
        <p class="muted">Crie uma agenda exclusiva no Google Agenda e compartilhe com sua esposa. Depois, cada botão Google Agenda abrirá um evento já preenchido.</p>
        <label>Nome sugerido da agenda
          <input id="settingGoogleCalendarName" value="${escapeAttr(data.settings.googleCalendarName || "")}" placeholder="Viagem Mendoza & Buenos Aires 2026" />
        </label>
        <label>Link da agenda compartilhada
          <input id="settingGoogleCalendarUrl" value="${escapeAttr(data.settings.googleCalendarUrl || "")}" placeholder="Cole o link da agenda, se quiser" />
        </label>
        <label>Fuso horário
          <input id="settingCalendarTimezone" value="${escapeAttr(data.settings.calendarTimezone || "America/Sao_Paulo")}" placeholder="America/Sao_Paulo" />
        </label>
        <div class="card-actions">
          <button class="secondary" onclick="openCalendarSetupModal()">Como criar agenda</button>
          ${data.settings.googleCalendarUrl ? `<a class="secondary" href="${escapeAttr(data.settings.googleCalendarUrl)}" target="_blank" rel="noopener">Abrir agenda</a>` : `<a class="secondary" href="https://calendar.google.com/calendar/u/0/r/settings/createcalendar" target="_blank" rel="noopener">Criar agenda no Google</a>`}
        </div>
      </div>
      <div class="settings-box">
        <h3>Modelo da planilha futura</h3>
        <p class="muted">Quando formos conectar ao Google Sheets, a planilha deverá ter estas abas:</p>
        <div class="code-block">Config\nDias\nLugares\nAgenda\nReservas\nDocumentos\nDespesas\nPendencias</div>
      </div>
      <div class="settings-box">
        <h3>Google Maps</h3>
        <p class="muted">Cole o link compartilhado do Maps no cadastro do lugar. O botão Google Maps abrirá o local. Para aparecer como pino dentro do mapa da plataforma, cadastre latitude e longitude.</p>
        <div class="code-block">Fluxo recomendado:\nGoogle Maps → Compartilhar → Copiar link\nCentral de Viagem → Lugares → + Novo lugar → Link Google Maps\nSe tiver coordenadas, preencha Latitude/Longitude para aparecer no mapa interno.</div>
      </div>
      <div class="settings-box">
        <h3>Backup</h3>
        <p class="muted">Use exportar/importar para levar os dados para outro navegador enquanto ainda não há sincronização online.</p>
        <div class="card-actions">
          <button class="secondary" onclick="exportJson()">Exportar JSON</button>
          <label class="secondary file-label" for="importJson">Importar JSON</label>
        </div>
      </div>
      <div class="settings-box">
        <h3>Próxima fase</h3>
        <p class="muted">Após aprovar calendário/mapa, conectamos Google Sheets + Apps Script para sincronizar a família toda.</p>
      </div>
    </div>`;
}

function saveSettingsFromPanel(){
  data.settings.syncMode = byId("settingSyncMode")?.value || "local";
  data.settings.appsScriptUrl = byId("settingAppsScriptUrl")?.value.trim() || "";
  data.settings.driveFolderUrl = byId("settingDriveFolderUrl")?.value.trim() || "";
  data.settings.googleCalendarName = byId("settingGoogleCalendarName")?.value.trim() || "";
  data.settings.googleCalendarUrl = byId("settingGoogleCalendarUrl")?.value.trim() || "";
  data.settings.calendarTimezone = byId("settingCalendarTimezone")?.value.trim() || "America/Sao_Paulo";
  saveAndRender("Configurações salvas");
}

function init(){
  ensureV52Defaults();
  bindEvents();
  renderAll();
  initMap();
  setTimeout(() => { renderMapMarkers(); forceMapRefresh("init-final"); }, 250);
}


document.addEventListener("DOMContentLoaded", init);


/* ===== v6 — Google Sheets / Drive / Agenda via Apps Script ===== */
let cloudSaveTimer = null;
function ensureV6Defaults(){
  data.settings = data.settings || {};
  data.settings.syncMode = data.settings.syncMode || "local";
  data.settings.appsScriptUrl = data.settings.appsScriptUrl || "";
  data.settings.apiKey = data.settings.apiKey || "";
  data.settings.autoSync = Boolean(data.settings.autoSync);
  data.settings.lastSyncAt = data.settings.lastSyncAt || "";
  data.settings.googleCalendarName = data.settings.googleCalendarName || "Viagem Mendoza & Buenos Aires 2026";
  data.settings.calendarTimezone = data.settings.calendarTimezone || "America/Sao_Paulo";
  data.settings.calendarId = data.settings.calendarId || "";
  data.settings.driveFolderUrl = data.settings.driveFolderUrl || "";
  data.settings.driveFolderId = data.settings.driveFolderId || extractDriveFolderId(data.settings.driveFolderUrl || "") || "";
}
function cloudConfigured(){
  return data.settings.syncMode === "sheets" && Boolean(data.settings.appsScriptUrl && data.settings.apiKey);
}
function cloudCalendarButton(type, id){
  if(!cloudConfigured()) return "";
  const attr = type === "day" ? "data-day-cloud-calendar" : type === "place" ? "data-place-cloud-calendar" : "data-res-cloud-calendar";
  return `<button class="ghost tiny cloud-action" ${attr}="${escapeAttr(id)}">Criar na agenda</button>`;
}
function extractDriveFolderId(value=""){
  const text = String(value || "");
  const match = text.match(/folders\/([a-zA-Z0-9_-]+)/) || text.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : text.length > 20 && !text.includes("http") ? text : "";
}
function sanitizeDataForCloud(source){
  const clone = structuredCloneSafe(source);
  clone.documents = (clone.documents || []).map(doc => {
    const d = { ...doc };
    if(d.file){
      d.file = { name: d.file.name, size: d.file.size, type: d.file.type, localOnly: !d.driveFileId };
    }
    return d;
  });
  clone.settings = { ...clone.settings };
  delete clone.settings.apiKey;
  return clone;
}
async function cloudRequest(action, payload={}){
  ensureV6Defaults();
  const url = (data.settings.appsScriptUrl || "").trim();
  const token = (data.settings.apiKey || "").trim();
  if(!url) throw new Error("Cole a URL /exec do Apps Script em Configurações.");
  if(!token) throw new Error("Preencha a chave de edição em Configurações.");
  const body = new URLSearchParams();
  body.set("action", action);
  body.set("token", token);
  body.set("payload", JSON.stringify(payload || {}));
  const res = await fetch(url, { method:"POST", body });
  const text = await res.text();
  let json;
  try{ json = JSON.parse(text); }catch(err){ throw new Error("Resposta não era JSON. Verifique se a URL termina em /exec e se o Web App foi implantado corretamente."); }
  if(!json.ok) throw new Error(json.error || "Erro desconhecido no Apps Script.");
  return json;
}
async function testCloudConnection(){
  try{
    showToast("Testando conexão...");
    const json = await cloudRequest("ping", { title:data.trip.title });
    showToast(json.message || "Conexão OK");
  }catch(err){ showToast(err.message); }
}
async function setupCloudSheets(){
  try{
    showToast("Criando/atualizando abas da planilha...");
    const json = await cloudRequest("setup", { data:sanitizeDataForCloud(data) });
    showToast(json.message || "Planilha preparada");
  }catch(err){ showToast(err.message); }
}
async function saveCloudNow(silent=false){
  if(!cloudConfigured()) { if(!silent) showToast("Ative Google Sheets nas configurações."); return; }
  try{
    if(!silent) showToast("Salvando na nuvem...");
    const payload = { data:sanitizeDataForCloud(data), settings:{ calendarId:data.settings.calendarId || "", driveFolderId:data.settings.driveFolderId || extractDriveFolderId(data.settings.driveFolderUrl || "") || "" } };
    const json = await cloudRequest("saveAll", payload);
    data.settings.lastSyncAt = new Date().toISOString();
    saveData();
    if(!silent) showToast(json.message || "Salvo no Google Sheets");
    renderSettings();
  }catch(err){ if(!silent) showToast(err.message); }
}
async function loadCloudNow(){
  if(!cloudConfigured()) { showToast("Ative Google Sheets nas configurações."); return; }
  if(!confirm("Carregar dados da nuvem e substituir os dados locais deste navegador?")) return;
  try{
    showToast("Carregando da nuvem...");
    const json = await cloudRequest("getAll", {});
    if(!json.data) throw new Error("Nenhum dado encontrado na nuvem ainda.");
    const incoming = normalizeData(json.data);
    // Preserva configurações locais de conexão, que não ficam no backup da nuvem.
    incoming.settings = { ...incoming.settings, appsScriptUrl:data.settings.appsScriptUrl, apiKey:data.settings.apiKey, syncMode:data.settings.syncMode, autoSync:data.settings.autoSync, calendarId:data.settings.calendarId, driveFolderId:data.settings.driveFolderId, driveFolderUrl:data.settings.driveFolderUrl, lastSyncAt:new Date().toISOString() };
    data = incoming;
    saveData();
    renderAll();
    renderMapMarkers();
    showToast("Dados carregados do Google Sheets");
  }catch(err){ showToast(err.message); }
}
function scheduleCloudSave(){
  if(!cloudConfigured() || !data.settings.autoSync) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => saveCloudNow(true), 1800);
}
function saveAndRender(message="Salvo"){
  saveData();
  renderAll();
  if(map) renderMapMarkers();
  showToast(message);
  scheduleCloudSave();
}
async function createCloudCalendarEvent(event){
  if(!cloudConfigured()) { showToast("Configure Apps Script + chave para criar evento direto na agenda."); return; }
  try{
    showToast("Criando evento na agenda compartilhada...");
    const json = await cloudRequest("createCalendarEvent", { event, trip:data.trip, settings:{ calendarId:data.settings.calendarId || "", timezone:data.settings.calendarTimezone || "America/Sao_Paulo" } });
    showToast(json.message || "Evento criado no Google Agenda");
    if(json.calendarUrl) window.open(json.calendarUrl, "_blank", "noopener");
  }catch(err){ showToast(err.message); }
}
async function uploadDocumentToDrive(id){
  if(!cloudConfigured()) { showToast("Configure Apps Script para enviar ao Drive."); return; }
  const doc = data.documents.find(d => d.id === id);
  if(!doc || !doc.file || !doc.file.dataUrl){ showToast("Este documento não tem arquivo local para enviar."); return; }
  try{
    showToast("Enviando arquivo ao Google Drive...");
    const base64 = String(doc.file.dataUrl).split(",")[1] || "";
    const json = await cloudRequest("uploadFile", {
      fileName: doc.file.name,
      mimeType: doc.file.type || "application/octet-stream",
      base64,
      folderId: data.settings.driveFolderId || extractDriveFolderId(data.settings.driveFolderUrl || ""),
      documentId: doc.id
    });
    doc.driveFileId = json.fileId || "";
    doc.link = json.fileUrl || doc.link || "";
    doc.file = { name: doc.file.name, size: doc.file.size, type: doc.file.type, localOnly:false };
    saveAndRender("Arquivo enviado ao Drive");
  }catch(err){ showToast(err.message); }
}
function openSheetsSetupModal(){
  openModal("Integração Google Sheets + Agenda", `<div class="settings-box full-helper">
    <p>Esta versão já está pronta para salvar a viagem em uma planilha e criar eventos na agenda compartilhada usando Google Apps Script.</p>
    <div class="code-block">1. Crie uma Planilha Google chamada Central de Viagem.
2. Na planilha, abra Extensões → Apps Script.
3. Copie o arquivo google-apps-script/Code.gs deste ZIP.
4. No Code.gs, ajuste API_KEY e, se quiser, CALENDAR_ID.
5. Clique em Executar → setupCentralViagem e autorize.
6. Implantar → Nova implantação → App da Web.
7. Executar como: você. Acesso: qualquer pessoa com o link.
8. Copie a URL que termina em /exec e cole aqui em Configurações.
9. Preencha a mesma chave API_KEY na Central.</div>
    <p class="muted">Depois disso, use os botões: Testar conexão, Preparar planilha, Salvar na nuvem e Carregar da nuvem.</p>
  </div>`, () => closeModal(), "Entendi");
}
function renderSettings(){
  ensureV6Defaults();
  const connected = cloudConfigured();
  const last = data.settings.lastSyncAt ? new Date(data.settings.lastSyncAt).toLocaleString("pt-BR") : "Nunca";
  byId("settingsPanel").innerHTML = `<div class="settings-grid">
      <div class="settings-box sync-box">
        <h3>Sincronização Google Sheets</h3>
        <p class="muted">A tela continua no GitHub Pages, mas os dados podem ficar em uma Planilha Google para abrir no celular, notebook e com sua esposa.</p>
        <label>Modo de sincronização
          <select id="settingSyncMode">
            <option value="local" ${data.settings.syncMode === "local" ? "selected" : ""}>Local neste navegador</option>
            <option value="sheets" ${data.settings.syncMode === "sheets" ? "selected" : ""}>Google Sheets + Apps Script</option>
          </select>
        </label>
        <label>URL do Apps Script Web App /exec
          <input id="settingAppsScriptUrl" value="${escapeAttr(data.settings.appsScriptUrl || "")}" placeholder="https://script.google.com/macros/s/.../exec" />
        </label>
        <label>Chave de edição
          <input id="settingApiKey" value="${escapeAttr(data.settings.apiKey || "")}" placeholder="A mesma API_KEY do Code.gs" />
        </label>
        <label class="checkbox-line"><input id="settingAutoSync" type="checkbox" ${data.settings.autoSync ? "checked" : ""} /> Salvar automaticamente na nuvem após edições</label>
        <p class="muted"><strong>Status:</strong> ${connected ? "Pronto para sincronizar" : "Ainda local"} · <strong>Último sync:</strong> ${escapeHtml(last)}</p>
        <div class="card-actions stack-actions">
          <button class="secondary" onclick="openSheetsSetupModal()">Como configurar</button>
          <button class="secondary" onclick="testCloudConnection()">Testar conexão</button>
          <button class="secondary" onclick="setupCloudSheets()">Preparar planilha</button>
          <button class="primary" onclick="saveCloudNow(false)">Salvar na nuvem</button>
          <button class="secondary" onclick="loadCloudNow()">Carregar da nuvem</button>
        </div>
      </div>
      <div class="settings-box calendar-box">
        <h3>Calendário compartilhado</h3>
        <p class="muted">A Central monta o roteiro. A agenda compartilhada recebe apenas eventos importantes com data/hora e lembrete.</p>
        <label>Nome sugerido da agenda
          <input id="settingGoogleCalendarName" value="${escapeAttr(data.settings.googleCalendarName || "")}" placeholder="Viagem Mendoza & Buenos Aires 2026" />
        </label>
        <label>ID da agenda compartilhada
          <input id="settingCalendarId" value="${escapeAttr(data.settings.calendarId || "")}" placeholder="ex.: abc123@group.calendar.google.com" />
        </label>
        <label>Link da agenda compartilhada
          <input id="settingGoogleCalendarUrl" value="${escapeAttr(data.settings.googleCalendarUrl || "")}" placeholder="Cole o link da agenda, se quiser" />
        </label>
        <label>Fuso horário
          <input id="settingCalendarTimezone" value="${escapeAttr(data.settings.calendarTimezone || "America/Sao_Paulo")}" placeholder="America/Sao_Paulo" />
        </label>
        <div class="card-actions">
          <button class="secondary" onclick="openCalendarSetupModal()">Como criar agenda</button>
          ${data.settings.googleCalendarUrl ? `<a class="secondary" href="${escapeAttr(data.settings.googleCalendarUrl)}" target="_blank" rel="noopener">Abrir agenda</a>` : `<a class="secondary" href="https://calendar.google.com/calendar/u/0/r/settings/createcalendar" target="_blank" rel="noopener">Criar agenda no Google</a>`}
        </div>
      </div>
      <div class="settings-box">
        <h3>Google Drive para documentos</h3>
        <p class="muted">Crie uma pasta da viagem no Drive, compartilhe com sua esposa e cole o link/ID aqui. Os arquivos anexados podem ser enviados para essa pasta.</p>
        <label>Link ou ID da pasta do Drive
          <input id="settingDriveFolderUrl" value="${escapeAttr(data.settings.driveFolderUrl || "")}" placeholder="https://drive.google.com/drive/folders/..." />
        </label>
        <label>ID detectado da pasta
          <input id="settingDriveFolderId" value="${escapeAttr(data.settings.driveFolderId || extractDriveFolderId(data.settings.driveFolderUrl || "") || "")}" placeholder="ID da pasta" />
        </label>
      </div>
      <div class="settings-box">
        <h3>Google Maps</h3>
        <p class="muted">Cadastre os lugares na tela, cole o link compartilhado do Maps e informe latitude/longitude para aparecer no mapa interno.</p>
        <div class="code-block">Fluxo:
Google Maps → Compartilhar → Copiar link
Central → Lugares → + Novo lugar → colar link
Depois vincule Dia + Manhã/Tarde/Noite.</div>
      </div>
      <div class="settings-box">
        <h3>Backup manual</h3>
        <p class="muted">Mesmo com Google Sheets, mantenha backup JSON antes de grandes mudanças.</p>
        <div class="card-actions">
          <button class="secondary" onclick="exportJson()">Exportar JSON</button>
          <label class="secondary file-label" for="importJson">Importar JSON</label>
        </div>
      </div>
      <div class="settings-box">
        <h3>Arquivos incluídos no ZIP</h3>
        <div class="code-block">google-apps-script/Code.gs
INSTRUCOES_GOOGLE_SHEETS_E_AGENDA.md
index.html / style.css / app.js</div>
      </div>
    </div>`;
}
function saveSettingsFromPanel(){
  ensureV6Defaults();
  data.settings.syncMode = byId("settingSyncMode")?.value || "local";
  data.settings.appsScriptUrl = byId("settingAppsScriptUrl")?.value.trim() || "";
  data.settings.apiKey = byId("settingApiKey")?.value.trim() || "";
  data.settings.autoSync = Boolean(byId("settingAutoSync")?.checked);
  data.settings.driveFolderUrl = byId("settingDriveFolderUrl")?.value.trim() || "";
  data.settings.driveFolderId = byId("settingDriveFolderId")?.value.trim() || extractDriveFolderId(data.settings.driveFolderUrl || "") || "";
  data.settings.googleCalendarName = byId("settingGoogleCalendarName")?.value.trim() || "";
  data.settings.googleCalendarUrl = byId("settingGoogleCalendarUrl")?.value.trim() || "";
  data.settings.calendarTimezone = byId("settingCalendarTimezone")?.value.trim() || "America/Sao_Paulo";
  data.settings.calendarId = byId("settingCalendarId")?.value.trim() || "";
  saveAndRender("Configurações salvas");
}
function init(){
  ensureV52Defaults();
  ensureV6Defaults();
  bindEvents();
  renderAll();
  initMap();
  setTimeout(() => { renderMapMarkers(); forceMapRefresh("init-final"); }, 250);
}
