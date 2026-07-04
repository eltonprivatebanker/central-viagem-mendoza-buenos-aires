/* Central de Viagem v5 — sistema visual editável
   GitHub Pages + localStorage agora. Preparado para evoluir para Google Sheets/Drive via Apps Script. */
const STORAGE_KEY = "centralViagemV5Completo";
const uid = () => `${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-5)}`;

const defaultData = {
  trip: {
    title: "Mendoza & Buenos Aires em família",
    subtitle: "Sistema visual para roteiro, lugares, mapa, reservas, documentos e orçamento.",
    period: "27/07 a 10/08",
    base: "Puerto Iguazú / Foz do Iguaçu",
    people: "Elton, família e Oliver"
  },
  settings: {
    syncMode: "local",
    appsScriptUrl: "",
    driveFolderUrl: "",
    editorPasswordHint: ""
  },
  days: [
    { id: "d1", number: 1, label: "Seg 27/07", date: "27/07", title: "Saída da viagem", city: "Deslocamento", morning: "Conferir documentos, malas, dinheiro/cartões e deslocamento até o ponto de saída.", afternoon: "Viagem/deslocamento. Guardar comprovantes e localizadores.", night: "Chegada e check-in, se aplicável. Jantar leve.", lodging: "A definir", transport: "Deslocamento inicial", notes: "" },
    { id: "d2", number: 2, label: "Ter 28/07", date: "28/07", title: "Ambientação", city: "Buenos Aires", morning: "Café e passeio leve perto do hotel.", afternoon: "Puerto Madero, cafés e pontos próximos.", night: "Jantar reservado ou restaurante próximo.", lodging: "Hotel Buenos Aires — pendente", transport: "A pé / app", notes: "Dia leve para adaptação." },
    { id: "d3", number: 3, label: "Qua 29/07", date: "29/07", title: "Recoleta e Palermo", city: "Buenos Aires", morning: "Recoleta, Flor Metálica ou pontos próximos.", afternoon: "Palermo, parques e pausa para o Oliver.", night: "Restaurante/experiência cultural leve.", lodging: "Hotel Buenos Aires — pendente", transport: "A pé / app", notes: "" },
    { id: "d4", number: 4, label: "Qui 30/07", date: "30/07", title: "Deslocamento para Mendoza", city: "Mendoza", morning: "Checkout e deslocamento.", afternoon: "Chegada em Mendoza e retirada de carro, se aplicável.", night: "Check-in e jantar tranquilo.", lodging: "Hotel Mendoza — pendente", transport: "Voo/ônibus/carro a definir", notes: "Validar melhor custo/tempo." }
  ],
  places: [
    { id: "p1", name: "Puerto Madero", city: "Buenos Aires", category: "Passeio", status: "planned", priority: "Alta", dayId: "d2", period: "afternoon", lat: -34.6118, lng: -58.3638, url: "https://www.google.com/maps/search/Puerto+Madero", notes: "Bom para caminhada leve, fotos e restaurante." },
    { id: "p2", name: "Recoleta", city: "Buenos Aires", category: "Bairro", status: "planned", priority: "Alta", dayId: "d3", period: "morning", lat: -34.5875, lng: -58.3974, url: "https://www.google.com/maps/search/Recoleta+Buenos+Aires", notes: "Região clássica, fácil de combinar com cafés e parques." },
    { id: "p3", name: "Palermo", city: "Buenos Aires", category: "Bairro/parque", status: "wishlist", priority: "Alta", dayId: "d3", period: "afternoon", lat: -34.5795, lng: -58.4309, url: "https://www.google.com/maps/search/Palermo+Buenos+Aires", notes: "Parques, cafés e pausa para criança." },
    { id: "p4", name: "Parque General San Martín", city: "Mendoza", category: "Parque", status: "wishlist", priority: "Média", dayId: "", period: "free", lat: -32.8892, lng: -68.8745, url: "https://www.google.com/maps/search/Parque+General+San+Martin+Mendoza", notes: "Boa opção visual e leve para família." },
    { id: "p5", name: "Parque Provincial Aconcágua", city: "Mendoza", category: "Montanha", status: "wishlist", priority: "Alta", dayId: "", period: "free", lat: -32.8244, lng: -69.9425, url: "https://www.google.com/maps/search/Parque+Provincial+Aconcagua", notes: "Validar clima, estrada, altitude e se vale para ir com criança." }
  ],
  tasks: [
    { id: "t1", title: "Definir hotel em Buenos Aires", description: "Conferir bairro, café da manhã, cancelamento e distância dos passeios.", critical: true, done: false },
    { id: "t2", title: "Definir hotel em Mendoza", description: "Priorizar conforto, estacionamento e boa saída para vinícolas/montanha.", critical: true, done: false },
    { id: "t3", title: "Fechar deslocamento Buenos Aires → Mendoza", description: "Validar melhor custo/tempo entre voo, ônibus ou carro.", critical: true, done: false },
    { id: "t4", title: "Reservar carro em Mendoza", description: "Conferir seguro, cadeirinha, caução e horários de retirada/devolução.", critical: false, done: false },
    { id: "t5", title: "Organizar documentos em PDF", description: "Documentos pessoais, reservas, seguro viagem e comprovantes.", critical: true, done: false }
  ],
  reservations: [
    { id: "r1", type: "Hospedagem", title: "Hotel em Buenos Aires", status: "Pendente", city: "Buenos Aires", date: "27/07", time: "", endDate: "30/07", amount: 0, paid: 0, dayId: "d2", link: "", notes: "Escolher bairro e política de cancelamento." },
    { id: "r2", type: "Carro", title: "Carro em Mendoza", status: "Pendente", city: "Mendoza", date: "30/07", time: "", endDate: "", amount: 0, paid: 0, dayId: "d4", link: "", notes: "Conferir seguro e cadeirinha." }
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
  setTimeout(renderMapMarkers, 250);
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
  byId("btnFitMap").onclick = fitMap;
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
  setTimeout(() => map?.invalidateSize(), 120);
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
      <div class="card-actions">
        <button class="ghost tiny" data-edit-doc="${doc.id}">Editar / anexar</button>
        ${doc.link ? `<a class="ghost tiny" href="${escapeAttr(doc.link)}" target="_blank" rel="noopener">Abrir link</a>` : ""}
        ${doc.file ? `<button class="ghost tiny danger" data-remove-file="${doc.id}">Remover arquivo</button>` : ""}
        <button class="ghost tiny danger" data-delete-doc="${doc.id}">Excluir</button>
      </div>
    </article>`).join("") || `<div class="empty-state">Nenhum documento cadastrado.</div>`;
  document.querySelectorAll("[data-edit-doc]").forEach(el => el.onclick = () => openDocumentModal(data.documents.find(d => d.id === el.dataset.editDoc)));
  document.querySelectorAll("[data-delete-doc]").forEach(el => el.onclick = () => deleteItem("documents", el.dataset.deleteDoc, "Excluir documento?"));
  document.querySelectorAll("[data-remove-file]").forEach(el => el.onclick = () => removeDocumentFile(el.dataset.removeFile));
  document.querySelectorAll("[data-download-doc]").forEach(el => el.onclick = () => downloadDocumentFile(el.dataset.downloadDoc));
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
  if(!window.L){
    byId("mapFallback").hidden = false;
    return;
  }
  try{
    map = L.map("map", { zoomControl:true, scrollWheelZoom:true }).setView([-34.6037, -58.3816], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom:19, attribution:"&copy; OpenStreetMap" }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
    map.on("click", event => {
      if(currentView === "places"){
        const { lat, lng } = event.latlng;
        openPlaceModal(null, { lat, lng });
      }
    });
  }catch(err){
    console.warn("Falha ao iniciar mapa", err);
    byId("mapFallback").hidden = false;
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
}
window.selectPlaceFromPopup = function(id){ selectPlace(id, false); };
function selectPlace(id, fly=true){
  selectedPlaceId = id;
  const place = data.places.find(p => p.id === id);
  if(place && map && fly){
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
  map.fitBounds(latlngs, { padding:[38,38], maxZoom:12 });
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

document.addEventListener("DOMContentLoaded", init);
