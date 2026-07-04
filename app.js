/* Central de Viagem v4 — Wanderlog inspired, estático e editável */
const STORAGE_KEY = "centralViagemV4";
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const cityCoords = {
  "Buenos Aires": [-34.6037, -58.3816],
  "Mendoza": [-32.8895, -68.8458],
  "Foz do Iguaçu": [-25.5163, -54.5854],
  "Puerto Iguazú": [-25.5972, -54.5786],
  "Aconcágua": [-32.6532, -70.0112]
};

const defaultData = {
  trip: {
    title: "Mendoza & Buenos Aires em família",
    subtitle: "Organize roteiro, lugares, documentos, reservas e orçamento em uma tela integrada.",
    period: "27/07 a 10/08",
    base: "Puerto Iguazú / Foz do Iguaçu",
    people: "Elton, família e Oliver"
  },
  days: [
    { id: "d1", number: 1, label: "Seg 27/07", date: "27/07", title: "Saída da viagem", city: "Deslocamento", morning: "Conferir documentos, malas, dinheiro/cartões e deslocamento até o ponto de saída.", afternoon: "Viagem/deslocamento. Guardar comprovantes e localizadores.", night: "Chegada e check-in, se aplicável. Jantar leve." },
    { id: "d2", number: 2, label: "Ter 28/07", date: "28/07", title: "Ambientação", city: "Buenos Aires", morning: "Café e passeio leve perto do hotel.", afternoon: "Puerto Madero, cafés e pontos próximos.", night: "Jantar reservado ou restaurante próximo." },
    { id: "d3", number: 3, label: "Qua 29/07", date: "29/07", title: "Recoleta e Palermo", city: "Buenos Aires", morning: "Recoleta, flor metálica ou pontos próximos.", afternoon: "Palermo, parques e pausa para o Oliver.", night: "Restaurante/experiência cultural leve." },
    { id: "d4", number: 4, label: "Qui 30/07", date: "30/07", title: "Deslocamento para Mendoza", city: "Mendoza", morning: "Checkout e deslocamento.", afternoon: "Chegada em Mendoza e retirada de carro, se aplicável.", night: "Check-in e jantar tranquilo." }
  ],
  places: [
    { id: "p1", name: "Puerto Madero", city: "Buenos Aires", category: "Passeio", status: "planned", dayId: "d2", period: "afternoon", lat: -34.6118, lng: -58.3638, priority: "Alta", notes: "Bom para caminhada leve, fotos e restaurante.", url: "https://www.google.com/maps/search/Puerto+Madero" },
    { id: "p2", name: "Recoleta", city: "Buenos Aires", category: "Bairro", status: "planned", dayId: "d3", period: "morning", lat: -34.5875, lng: -58.3974, priority: "Alta", notes: "Região clássica, fácil de combinar com cafés e parques.", url: "https://www.google.com/maps/search/Recoleta+Buenos+Aires" },
    { id: "p3", name: "Parque General San Martín", city: "Mendoza", category: "Parque", status: "wishlist", dayId: "", period: "free", lat: -32.8892, lng: -68.8745, priority: "Média", notes: "Boa opção visual e leve para família.", url: "https://www.google.com/maps/search/Parque+General+San+Martin+Mendoza" },
    { id: "p4", name: "Parque Provincial Aconcágua", city: "Aconcágua", category: "Montanha", status: "wishlist", dayId: "", period: "free", lat: -32.8244, lng: -69.9425, priority: "Alta", notes: "Validar clima, estrada, altitude e se vale para ir com criança.", url: "https://www.google.com/maps/search/Parque+Provincial+Aconcagua" }
  ],
  tasks: [
    { id: "t1", title: "Definir hotel em Buenos Aires", description: "Conferir bairro, café da manhã, cancelamento e distância dos passeios.", critical: true, done: false },
    { id: "t2", title: "Definir hotel em Mendoza", description: "Priorizar conforto, estacionamento e boa saída para vinícolas/montanha.", critical: true, done: false },
    { id: "t3", title: "Reservar carro em Mendoza", description: "Conferir seguro, cadeirinha, caução e horários.", critical: false, done: false },
    { id: "t4", title: "Escolher vinícolas", description: "Selecionar poucas experiências boas, com logística leve.", critical: false, done: false }
  ],
  reservations: [
    { id: "r1", type: "Hospedagem", title: "Hotel em Buenos Aires", status: "Pendente", date: "27/07", amount: 0, link: "", notes: "Escolher bairro e política de cancelamento." },
    { id: "r2", type: "Carro", title: "Carro em Mendoza", status: "Pendente", date: "30/07", amount: 0, link: "", notes: "Conferir seguro e cadeirinha." }
  ],
  documents: [
    { id: "doc1", title: "Documentos pessoais", type: "PDF/Imagem", status: "Pendente", link: "", notes: "RG/passaporte de todos." },
    { id: "doc2", title: "Seguro viagem", type: "Apólice", status: "Pendente", link: "", notes: "Apólice e telefones de emergência." },
    { id: "doc3", title: "Reservas de hotéis", type: "Comprovante", status: "Pendente", link: "", notes: "Links do Booking/Airbnb/Drive." }
  ],
  expenses: [
    { id: "e1", category: "Hospedagem", title: "Previsão hotéis", city: "Buenos Aires/Mendoza", expected: 0, paid: 0, date: "", notes: "Preencher após cotação." }
  ]
};

let data = loadData();
let currentView = "overview";
let selectedPlaceId = null;
let map, markersLayer;

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){ console.warn("Falha ao carregar dados locais", e); }
  return structuredClone(defaultData);
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function formatCurrency(v){
  return Number(v||0).toLocaleString("pt-BR", { style:"currency", currency:"BRL", maximumFractionDigits:0 });
}
function byId(id){ return document.getElementById(id); }
function escapeHtml(str=""){
  return String(str).replace(/[&<>"]/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s]));
}
function statusLabel(status){
  return ({wishlist:"Quero visitar", planned:"Planejado", booked:"Reservado", done:"Concluído", discarded:"Descartado"})[status] || status || "Quero visitar";
}
function periodLabel(period){
  return ({morning:"Manhã", afternoon:"Tarde", night:"Noite", free:"Sem período"})[period] || "Sem período";
}
function dayName(dayId){
  const d = data.days.find(x=>x.id===dayId);
  return d ? `Dia ${String(d.number).padStart(2,"0")} · ${d.title}` : "Sem dia definido";
}
function uniqueCities(){
  return [...new Set(data.places.map(p=>p.city).filter(Boolean).concat(data.days.map(d=>d.city).filter(Boolean)))].filter(c=>c!=="Deslocamento").sort();
}

function init(){
  bindEvents();
  renderAll();
  initMap();
  setTimeout(renderMapMarkers, 300);
}

function bindEvents(){
  document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.view)));
  byId("btnAddPlace").onclick = () => openPlaceModal();
  byId("btnAddPlace2").onclick = () => openPlaceModal();
  byId("btnAddDay").onclick = () => openDayModal();
  byId("btnAddDay2").onclick = () => openDayModal();
  byId("btnEditTrip").onclick = openTripModal;
  byId("btnAddTask").onclick = () => openTaskModal();
  byId("btnAddReservation").onclick = () => openReservationModal();
  byId("btnAddDocument").onclick = () => openDocumentModal();
  byId("btnAddExpense").onclick = () => openExpenseModal();
  byId("btnRenumberDays").onclick = () => { renumberDays(); saveAndRender(); };
  byId("btnFitMap").onclick = fitMap;
  byId("btnAddMapCenter").onclick = () => {
    const c = map?.getCenter();
    openPlaceModal(null, { lat: c?.lat || -34.6037, lng: c?.lng || -58.3816 });
  };
  byId("btnExport").onclick = exportJson;
  byId("importJson").onchange = importJson;
  byId("btnReset").onclick = resetData;
  byId("modalClose").onclick = closeModal;
  byId("modalCancel").onclick = closeModal;
  byId("filterCity").onchange = renderPlaces;
  byId("filterDay").onchange = renderPlaces;
  byId("filterStatus").onchange = renderPlaces;
}

function setView(view){
  currentView = view;
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active", v.id===`view-${view}`));
  if(view === "places" || view === "itinerary") setTimeout(()=>map?.invalidateSize(), 150);
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
  renderMapMarkers();
}
function saveAndRender(){ saveData(); renderAll(); }

function renderHeader(){
  byId("tripTitle").textContent = data.trip.title;
  byId("tripSubtitle").textContent = data.trip.subtitle;
  byId("sidebarSubtitle").textContent = data.trip.title.replace(" em família","");
}
function renderMetrics(){
  const openTasks = data.tasks.filter(t=>!t.done);
  const critical = openTasks.filter(t=>t.critical);
  const expected = data.expenses.reduce((a,e)=>a+Number(e.expected||0),0) + data.reservations.reduce((a,r)=>a+Number(r.amount||0),0);
  const paid = data.expenses.reduce((a,e)=>a+Number(e.paid||0),0);
  byId("metricPeriod").textContent = data.trip.period;
  byId("metricBase").textContent = `Base: ${data.trip.base}`;
  byId("metricPlaces").textContent = data.places.length;
  byId("metricOpenTasks").textContent = openTasks.length;
  byId("metricCritical").textContent = `${critical.length} críticas`;
  byId("metricBudget").textContent = formatCurrency(expected);
  byId("metricPaid").textContent = `${formatCurrency(paid)} pago`;
}
function renderSidebarDays(){
  byId("sidebarDays").innerHTML = data.days.map(d=>`
    <button class="sidebar-day" data-dayjump="${d.id}"><span>Dia ${String(d.number).padStart(2,"0")}</span><small>${escapeHtml(d.date)}</small></button>
  `).join("");
  document.querySelectorAll("[data-dayjump]").forEach(btn=>btn.onclick=()=>{
    setView("itinerary");
    setTimeout(()=>document.querySelector(`[data-daycard="${btn.dataset.dayjump}"]`)?.scrollIntoView({behavior:"smooth",block:"start"}),100);
  });
}
function renderOverview(){
  const done = data.tasks.filter(t=>t.done).length;
  const pct = data.tasks.length ? Math.round((done/data.tasks.length)*100) : 0;
  const cityCounts = uniqueCities().map(city=>({ city, count:data.places.filter(p=>p.city===city).length }));
  byId("overviewContent").innerHTML = `
    <div class="overview-grid">
      <div class="overview-box">
        <h3>Progresso das pendências</h3>
        <div class="progress-bar"><span style="width:${pct}%"></span></div>
        <p class="muted">${done} de ${data.tasks.length} pendências concluídas.</p>
        <div class="task-list">
          ${data.tasks.map(task=>`
            <div class="task-item">
              <input type="checkbox" ${task.done?"checked":""} data-task-toggle="${task.id}" />
              <div>
                <strong>${escapeHtml(task.title)}</strong>
                <span class="tag ${task.critical?"critical":"pending"}">${task.critical?"Crítico":"Pendente"}</span>
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
        <h3>Lugares por cidade</h3>
        <div class="city-breakdown">
          ${cityCounts.map(c=>`<div class="city-row"><strong>${escapeHtml(c.city)}</strong><span>${c.count} lugar(es)</span></div>`).join("") || `<p class="muted">Cadastre lugares para montar o mapa da viagem.</p>`}
        </div>
      </div>
    </div>`;
  document.querySelectorAll("[data-task-toggle]").forEach(el=>el.onchange=()=>{ const t=data.tasks.find(x=>x.id===el.dataset.taskToggle); if(t){t.done=el.checked; saveAndRender();}});
  document.querySelectorAll("[data-edit-task]").forEach(el=>el.onclick=()=>openTaskModal(data.tasks.find(t=>t.id===el.dataset.editTask)));
  document.querySelectorAll("[data-delete-task]").forEach(el=>el.onclick=()=>deleteItem("tasks", el.dataset.deleteTask));
}
function renderItinerary(){
  byId("itineraryList").innerHTML = data.days.map((d, idx)=>{
    const placesByPeriod = period => data.places.filter(p=>p.dayId===d.id && p.period===period);
    const periodHtml = (title, key, note) => `
      <div class="period">
        <div class="period-title">${title}</div>
        <div class="period-note">${escapeHtml(note)}</div>
        ${placesByPeriod(key).map(p=>`
          <div class="mini-place">
            <span>📍</span>
            <button data-select-place="${p.id}">${escapeHtml(p.name)}<small>${escapeHtml(p.category)} · ${statusLabel(p.status)}</small></button>
          </div>
        `).join("")}
        <button class="ghost tiny" data-add-place-day="${d.id}" data-period="${key}">+ lugar neste período</button>
      </div>`;
    return `
      <article class="day-card" data-daycard="${d.id}">
        <div class="day-card-head">
          <div>
            <h3>Dia ${String(d.number).padStart(2,"0")} · ${escapeHtml(d.title)}</h3>
            <small>${escapeHtml(d.label)} · ${escapeHtml(d.date)}</small>
          </div>
          <div class="day-actions">
            <span class="tag city">${escapeHtml(d.city)}</span>
            <button class="ghost tiny" data-move-day="${d.id}" data-dir="up" ${idx===0?"disabled":""}>↑</button>
            <button class="ghost tiny" data-move-day="${d.id}" data-dir="down" ${idx===data.days.length-1?"disabled":""}>↓</button>
            <button class="ghost tiny" data-duplicate-day="${d.id}">Duplicar</button>
            <button class="ghost tiny" data-edit-day="${d.id}">Editar agenda</button>
            <button class="ghost tiny danger" data-delete-day="${d.id}">Excluir</button>
          </div>
        </div>
        <div class="day-body">
          ${periodHtml("Manhã", "morning", d.morning)}
          ${periodHtml("Tarde", "afternoon", d.afternoon)}
          ${periodHtml("Noite", "night", d.night)}
        </div>
      </article>`;
  }).join("");
  document.querySelectorAll("[data-edit-day]").forEach(el=>el.onclick=()=>openDayModal(data.days.find(d=>d.id===el.dataset.editDay)));
  document.querySelectorAll("[data-delete-day]").forEach(el=>el.onclick=()=>deleteDay(el.dataset.deleteDay));
  document.querySelectorAll("[data-duplicate-day]").forEach(el=>el.onclick=()=>duplicateDay(el.dataset.duplicateDay));
  document.querySelectorAll("[data-move-day]").forEach(el=>el.onclick=()=>moveDay(el.dataset.moveDay, el.dataset.dir));
  document.querySelectorAll("[data-add-place-day]").forEach(el=>el.onclick=()=>openPlaceModal(null, { dayId:el.dataset.addPlaceDay, period:el.dataset.period }));
  document.querySelectorAll("[data-select-place]").forEach(el=>el.onclick=()=>selectPlace(el.dataset.selectPlace, true));
}
function renderFilters(){
  byId("filterCity").innerHTML = `<option value="all">Todas as cidades</option>` + uniqueCities().map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  byId("filterDay").innerHTML = `<option value="all">Todos os dias</option><option value="none">Sem dia definido</option>` + data.days.map(d=>`<option value="${d.id}">Dia ${String(d.number).padStart(2,"0")} · ${escapeHtml(d.title)}</option>`).join("");
}
function renderPlaces(){
  const city = byId("filterCity")?.value || "all";
  const day = byId("filterDay")?.value || "all";
  const status = byId("filterStatus")?.value || "all";
  let list = data.places;
  if(city!=="all") list = list.filter(p=>p.city===city);
  if(day==="none") list = list.filter(p=>!p.dayId);
  else if(day!=="all") list = list.filter(p=>p.dayId===day);
  if(status!=="all") list = list.filter(p=>p.status===status);
  byId("placesList").innerHTML = list.map(p=>`
    <article class="place-card ${p.id===selectedPlaceId?"selected":""}">
      <div class="place-top">
        <div>
          <h3>${escapeHtml(p.name)}</h3>
          <div class="place-meta">
            <span class="tag city">${escapeHtml(p.city)}</span>
            <span class="tag ${p.status}">${statusLabel(p.status)}</span>
            <span class="tag planned">${dayName(p.dayId)}</span>
            <span class="tag wishlist">${periodLabel(p.period)}</span>
          </div>
        </div>
        <button class="icon-btn" data-focus-place="${p.id}">⌖</button>
      </div>
      <p>${escapeHtml(p.notes || "Sem observações.")}</p>
      <div class="card-actions">
        <button class="ghost tiny" data-edit-place="${p.id}">Editar</button>
        <button class="ghost tiny" data-copy-place="${p.id}">Duplicar</button>
        ${p.url ? `<a class="ghost tiny" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">Abrir mapa/link</a>` : ""}
        <button class="ghost tiny danger" data-delete-place="${p.id}">Excluir</button>
      </div>
    </article>`).join("") || `<div class="empty-state">Nenhum lugar encontrado. Clique em + Novo lugar.</div>`;
  document.querySelectorAll("[data-edit-place]").forEach(el=>el.onclick=()=>openPlaceModal(data.places.find(p=>p.id===el.dataset.editPlace)));
  document.querySelectorAll("[data-delete-place]").forEach(el=>el.onclick=()=>deleteItem("places", el.dataset.deletePlace));
  document.querySelectorAll("[data-copy-place]").forEach(el=>el.onclick=()=>duplicatePlace(el.dataset.copyPlace));
  document.querySelectorAll("[data-focus-place]").forEach(el=>el.onclick=()=>selectPlace(el.dataset.focusPlace, true));
}
function renderReservations(){
  byId("reservationsList").innerHTML = data.reservations.map(r=>`
    <article class="generic-card">
      <h3>${escapeHtml(r.title)}</h3>
      <div class="place-meta"><span class="tag city">${escapeHtml(r.type)}</span><span class="tag pending">${escapeHtml(r.status)}</span><span class="tag wishlist">${escapeHtml(r.date||"Sem data")}</span></div>
      <p>${escapeHtml(r.notes||"")}</p>
      <p class="muted">Valor: ${formatCurrency(r.amount)}</p>
      <div class="card-actions"><button class="ghost tiny" data-edit-res="${r.id}">Editar</button>${r.link?`<a class="ghost tiny" target="_blank" rel="noopener" href="${escapeHtml(r.link)}">Abrir link</a>`:""}<button class="ghost tiny danger" data-delete-res="${r.id}">Excluir</button></div>
    </article>`).join("") || `<div class="empty-state">Nenhuma reserva cadastrada.</div>`;
  document.querySelectorAll("[data-edit-res]").forEach(el=>el.onclick=()=>openReservationModal(data.reservations.find(r=>r.id===el.dataset.editRes)));
  document.querySelectorAll("[data-delete-res]").forEach(el=>el.onclick=()=>deleteItem("reservations", el.dataset.deleteRes));
}
function renderDocuments(){
  byId("documentsList").innerHTML = data.documents.map(doc=>`
    <article class="generic-card">
      <h3>${escapeHtml(doc.title)}</h3>
      <div class="place-meta"><span class="tag city">${escapeHtml(doc.type)}</span><span class="tag pending">${escapeHtml(doc.status)}</span></div>
      <p>${escapeHtml(doc.notes||"")}</p>
      <div class="card-actions"><button class="ghost tiny" data-edit-doc="${doc.id}">Editar</button>${doc.link?`<a class="ghost tiny" target="_blank" rel="noopener" href="${escapeHtml(doc.link)}">Abrir arquivo/link</a>`:""}<button class="ghost tiny danger" data-delete-doc="${doc.id}">Excluir</button></div>
    </article>`).join("") || `<div class="empty-state">Nenhum documento cadastrado.</div>`;
  document.querySelectorAll("[data-edit-doc]").forEach(el=>el.onclick=()=>openDocumentModal(data.documents.find(d=>d.id===el.dataset.editDoc)));
  document.querySelectorAll("[data-delete-doc]").forEach(el=>el.onclick=()=>deleteItem("documents", el.dataset.deleteDoc));
}
function renderBudget(){
  const rows = data.expenses.map(e=>`
    <tr><td><strong>${escapeHtml(e.title)}</strong><br><small>${escapeHtml(e.category)} · ${escapeHtml(e.city||"")}</small></td><td>${formatCurrency(e.expected)}</td><td>${formatCurrency(e.paid)}</td><td>${escapeHtml(e.date||"-")}</td><td><button class="ghost tiny" data-edit-exp="${e.id}">Editar</button> <button class="ghost tiny danger" data-delete-exp="${e.id}">Excluir</button></td></tr>`).join("");
  byId("budgetContent").innerHTML = `<table class="budget-table"><thead><tr><th>Item</th><th>Previsto</th><th>Pago</th><th>Data</th><th>Ações</th></tr></thead><tbody>${rows}</tbody></table>`;
  document.querySelectorAll("[data-edit-exp]").forEach(el=>el.onclick=()=>openExpenseModal(data.expenses.find(e=>e.id===el.dataset.editExp)));
  document.querySelectorAll("[data-delete-exp]").forEach(el=>el.onclick=()=>deleteItem("expenses", el.dataset.deleteExp));
}

function initMap(){
  if(!window.L){
    byId("map").innerHTML = `<div class="empty-state">Mapa indisponível. Verifique a conexão para carregar a biblioteca Leaflet.</div>`;
    return;
  }
  map = L.map("map", { zoomControl:true }).setView([-31.7, -63.8], 4);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom:19, attribution:"&copy; OpenStreetMap" }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  map.on("click", (e)=>{ byId("mapHint").textContent = `Clique em '+ no centro' para adicionar lugar próximo a ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}.`; });
}
function renderMapMarkers(){
  if(!map || !markersLayer) return;
  markersLayer.clearLayers();
  data.places.filter(p=>Number(p.lat)&&Number(p.lng)).forEach(p=>{
    const marker = L.marker([Number(p.lat), Number(p.lng)]).addTo(markersLayer);
    marker.bindPopup(`<strong>${escapeHtml(p.name)}</strong><br>${escapeHtml(p.city)}<br>${statusLabel(p.status)}<br><button onclick="window.__selectPlaceFromMap('${p.id}')">Selecionar</button>`);
    marker.on("click",()=>selectPlace(p.id, false));
  });
}
window.__selectPlaceFromMap = (id)=>selectPlace(id, false);
function fitMap(){
  if(!map) return;
  const coords = data.places.filter(p=>Number(p.lat)&&Number(p.lng)).map(p=>[Number(p.lat), Number(p.lng)]);
  if(!coords.length) return;
  map.fitBounds(coords, { padding:[50,50], maxZoom:11 });
}
function selectPlace(id, zoom){
  selectedPlaceId = id;
  const p = data.places.find(x=>x.id===id);
  if(!p) return;
  byId("placeDetail").innerHTML = `
    <strong>${escapeHtml(p.name)}</strong>
    <p>${escapeHtml(p.city)} · ${escapeHtml(p.category)} · ${statusLabel(p.status)}</p>
    <p><b>Agenda:</b> ${dayName(p.dayId)} · ${periodLabel(p.period)}</p>
    <p>${escapeHtml(p.notes||"")}</p>
    <div class="card-actions"><button class="ghost tiny" onclick="openPlaceModal(data.places.find(p=>p.id==='${p.id}'))">Editar</button>${p.url?`<a class="ghost tiny" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">Abrir link</a>`:""}</div>`;
  if(map && Number(p.lat)&&Number(p.lng)){
    map.setView([Number(p.lat), Number(p.lng)], zoom ? 13 : map.getZoom());
  }
  renderPlaces();
}

function openModal(title, html, onSubmit){
  byId("modalTitle").textContent = title;
  byId("modalBody").innerHTML = html;
  byId("modalForm").onsubmit = (ev)=>{ ev.preventDefault(); onSubmit(new FormData(ev.currentTarget)); closeModal(); saveAndRender(); };
  byId("modal").showModal();
}
function closeModal(){ byId("modal").close(); }
const input = (name,label,value="",type="text",extra="") => `<label>${label}<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${extra}></label>`;
const textarea = (name,label,value="") => `<label>${label}<textarea name="${name}">${escapeHtml(value)}</textarea></label>`;
const select = (name,label,options,value="") => `<label>${label}<select name="${name}">${options.map(o=>`<option value="${escapeHtml(o.value)}" ${String(o.value)===String(value)?"selected":""}>${escapeHtml(o.label)}</option>`).join("")}</select></label>`;
const dayOptions = () => [{value:"",label:"Sem dia definido"}, ...data.days.map(d=>({value:d.id,label:`Dia ${String(d.number).padStart(2,"0")} · ${d.title}`}))];

function openTripModal(){
  const t = data.trip;
  openModal("Editar viagem", `<div class="form-grid">${input("title","Título",t.title)}${input("period","Período",t.period)}${input("base","Base inicial",t.base)}${input("people","Pessoas",t.people)}<div class="full">${textarea("subtitle","Descrição",t.subtitle)}</div></div>`, fd=>{
    data.trip = { title:fd.get("title"), period:fd.get("period"), base:fd.get("base"), people:fd.get("people"), subtitle:fd.get("subtitle") };
  });
}
function openDayModal(day){
  const d = day || { id:uid(), number:data.days.length+1, label:"", date:"", title:"Novo dia", city:"", morning:"", afternoon:"", night:"" };
  openModal(day?"Editar agenda do dia":"Novo dia / evento", `<div class="form-grid">
    ${input("number","Número do dia",d.number,"number")} ${input("label","Rótulo lateral",d.label)}
    ${input("date","Data",d.date)} ${input("city","Cidade/etapa",d.city)}
    <div class="full">${input("title","Título do dia",d.title)}</div>
    <div class="full">${textarea("morning","Manhã",d.morning)}</div>
    <div class="full">${textarea("afternoon","Tarde",d.afternoon)}</div>
    <div class="full">${textarea("night","Noite",d.night)}</div>
  </div>`, fd=>{
    const payload = { id:d.id, number:Number(fd.get("number")||1), label:fd.get("label"), date:fd.get("date"), title:fd.get("title"), city:fd.get("city"), morning:fd.get("morning"), afternoon:fd.get("afternoon"), night:fd.get("night") };
    if(day) Object.assign(day, payload); else data.days.push(payload);
    data.days.sort((a,b)=>a.number-b.number);
  });
}
function openPlaceModal(place, defaults={}){
  const centerByCity = defaults.city && cityCoords[defaults.city] ? cityCoords[defaults.city] : null;
  const p = place || { id:uid(), name:"", city:defaults.city||"", category:"Passeio", status:"wishlist", dayId:defaults.dayId||"", period:defaults.period||"free", lat:defaults.lat || centerByCity?.[0] || "", lng:defaults.lng || centerByCity?.[1] || "", priority:"Média", notes:"", url:"" };
  openModal(place?"Editar lugar":"Novo lugar para visitar", `<div class="form-grid">
    ${input("name","Nome do lugar",p.name)}${input("city","Cidade",p.city)}
    ${input("category","Categoria",p.category)}${select("status","Status",[{value:"wishlist",label:"Quero visitar"},{value:"planned",label:"Planejado no roteiro"},{value:"booked",label:"Reservado"},{value:"done",label:"Concluído"},{value:"discarded",label:"Descartado"}],p.status)}
    ${select("dayId","Vincular em qual dia?",dayOptions(),p.dayId)}${select("period","Período",[{value:"free",label:"Sem período"},{value:"morning",label:"Manhã"},{value:"afternoon",label:"Tarde"},{value:"night",label:"Noite"}],p.period)}
    ${input("lat","Latitude",p.lat,"number",'step="any"')}${input("lng","Longitude",p.lng,"number",'step="any"')}
    ${input("priority","Prioridade",p.priority)}<div class="full">${input("url","Link Google Maps/site",p.url,"url")}</div>
    <div class="full">${textarea("notes","Observações",p.notes)}</div>
    <div class="full field-help">Dica: para marcar no mapa, cole latitude/longitude do Google Maps ou use o botão “+ no centro” no mapa.</div>
  </div>`, fd=>{
    const payload = { id:p.id, name:fd.get("name"), city:fd.get("city"), category:fd.get("category"), status:fd.get("status"), dayId:fd.get("dayId"), period:fd.get("period"), lat:fd.get("lat"), lng:fd.get("lng"), priority:fd.get("priority"), url:fd.get("url"), notes:fd.get("notes") };
    if(place) Object.assign(place, payload); else data.places.push(payload);
    selectedPlaceId = payload.id;
  });
}
function openTaskModal(task){
  const t = task || { id:uid(), title:"", description:"", critical:false, done:false };
  openModal(task?"Editar pendência":"Nova pendência", `<div class="form-grid"><div class="full">${input("title","Título",t.title)}</div><div class="full">${textarea("description","Descrição",t.description)}</div>${select("critical","Criticidade",[{value:"false",label:"Normal"},{value:"true",label:"Crítica"}],String(t.critical))}${select("done","Status",[{value:"false",label:"Pendente"},{value:"true",label:"Concluído"}],String(t.done))}</div>`, fd=>{
    const payload = { id:t.id, title:fd.get("title"), description:fd.get("description"), critical:fd.get("critical")==="true", done:fd.get("done")==="true" };
    if(task) Object.assign(task,payload); else data.tasks.push(payload);
  });
}
function openReservationModal(res){
  const r = res || { id:uid(), type:"Hospedagem", title:"", status:"Pendente", date:"", amount:0, link:"", notes:"" };
  openModal(res?"Editar reserva":"Nova reserva", `<div class="form-grid">${input("type","Tipo",r.type)}${input("status","Status",r.status)}<div class="full">${input("title","Título",r.title)}</div>${input("date","Data",r.date)}${input("amount","Valor",r.amount,"number",'step="0.01"')}<div class="full">${input("link","Link",r.link,"url")}</div><div class="full">${textarea("notes","Observações",r.notes)}</div></div>`, fd=>{
    const payload = { id:r.id, type:fd.get("type"), status:fd.get("status"), title:fd.get("title"), date:fd.get("date"), amount:Number(fd.get("amount")||0), link:fd.get("link"), notes:fd.get("notes") };
    if(res) Object.assign(res,payload); else data.reservations.push(payload);
  });
}
function openDocumentModal(doc){
  const d = doc || { id:uid(), title:"", type:"PDF/Imagem", status:"Pendente", link:"", notes:"" };
  openModal(doc?"Editar documento":"Novo documento", `<div class="form-grid">${input("title","Título",d.title)}${input("type","Tipo",d.type)}${input("status","Status",d.status)}<div class="full">${input("link","Link do arquivo Drive/OneDrive",d.link,"url")}</div><div class="full">${textarea("notes","Observações",d.notes)}</div></div>`, fd=>{
    const payload = { id:d.id, title:fd.get("title"), type:fd.get("type"), status:fd.get("status"), link:fd.get("link"), notes:fd.get("notes") };
    if(doc) Object.assign(doc,payload); else data.documents.push(payload);
  });
}
function openExpenseModal(exp){
  const e = exp || { id:uid(), category:"", title:"", city:"", expected:0, paid:0, date:"", notes:"" };
  openModal(exp?"Editar despesa":"Nova despesa", `<div class="form-grid">${input("category","Categoria",e.category)}${input("city","Cidade",e.city)}<div class="full">${input("title","Título",e.title)}</div>${input("expected","Valor previsto",e.expected,"number",'step="0.01"')}${input("paid","Valor pago",e.paid,"number",'step="0.01"')}${input("date","Data",e.date)}<div class="full">${textarea("notes","Observações",e.notes)}</div></div>`, fd=>{
    const payload = { id:e.id, category:fd.get("category"), city:fd.get("city"), title:fd.get("title"), expected:Number(fd.get("expected")||0), paid:Number(fd.get("paid")||0), date:fd.get("date"), notes:fd.get("notes") };
    if(exp) Object.assign(exp,payload); else data.expenses.push(payload);
  });
}

function deleteItem(collection, id){
  if(!confirm("Excluir este item?")) return;
  data[collection] = data[collection].filter(x=>x.id!==id);
  if(collection==="places" && selectedPlaceId===id) selectedPlaceId=null;
  saveAndRender();
}
function deleteDay(id){
  if(!confirm("Excluir este dia? Os lugares vinculados ficarão sem dia definido.")) return;
  data.days = data.days.filter(d=>d.id!==id);
  data.places.forEach(p=>{ if(p.dayId===id){ p.dayId=""; p.period="free"; }});
  renumberDays(); saveAndRender();
}
function duplicateDay(id){
  const d = data.days.find(x=>x.id===id); if(!d) return;
  const copy = { ...d, id:uid(), number:data.days.length+1, title:d.title + " — cópia" };
  data.days.push(copy); renumberDays(); saveAndRender();
}
function moveDay(id, dir){
  const idx = data.days.findIndex(d=>d.id===id); if(idx<0) return;
  const target = dir==="up" ? idx-1 : idx+1;
  if(target<0 || target>=data.days.length) return;
  [data.days[idx], data.days[target]] = [data.days[target], data.days[idx]];
  renumberDays(); saveAndRender();
}
function renumberDays(){ data.days.forEach((d,i)=>d.number=i+1); }
function duplicatePlace(id){
  const p = data.places.find(x=>x.id===id); if(!p) return;
  data.places.push({ ...p, id:uid(), name:p.name + " — cópia", status:"wishlist", dayId:"", period:"free" });
  saveAndRender();
}
function exportJson(){
  const blob = new Blob([JSON.stringify(data,null,2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "central-viagem-dados.json"; a.click();
  URL.revokeObjectURL(url);
}
function importJson(ev){
  const file = ev.target.files?.[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = () => { try{ data = JSON.parse(reader.result); saveAndRender(); alert("Dados importados com sucesso."); }catch(e){ alert("Arquivo JSON inválido."); } };
  reader.readAsText(file);
  ev.target.value = "";
}
function resetData(){
  if(!confirm("Resetar dados locais e voltar para o modelo inicial?")) return;
  localStorage.removeItem(STORAGE_KEY); data = structuredClone(defaultData); selectedPlaceId=null; renderAll(); fitMap();
}

init();
