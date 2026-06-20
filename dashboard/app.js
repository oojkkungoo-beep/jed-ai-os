// ═══════════════════════════════════════════════
//  Jed's AI OS — Dashboard App
// ═══════════════════════════════════════════════

// ── BASE PATH — works on both localhost and GitHub Pages ──
// localhost:3334 → BASE = ''
// oojkkungoo-beep.github.io/jed-ai-os → BASE = '/jed-ai-os'
const BASE = (() => {
  const p = location.pathname;
  const m = p.match(/^(\/[^/]+)\/dashboard\//);
  return (m && location.hostname !== 'localhost') ? m[1] : '';
})();

// ── AGENTS ──
const AGENTS = [
  { id:'laura',   name:'Laura',   thai:'ลอร่า',   race:'Silver Elf (เอลฟ์เงินผู้ดูแลสำนักงาน)',         gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'🎭', img:'images/Laura.png',   role:'Main Orchestrator',       desc:'รับทุก input ตัดสินใจ delegate ไปยัง agent ที่เหมาะสม', file:'../team/laura.md',        charFile:'../characters/laura.md'   },
  { id:'muse',    name:'Muse',    thai:'มิ้วส์',  race:'Lumina Fairy (นางฟ้าแห่งแสงสร้างสรรค์)',         gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'💡', img:'images/Muse.png',    role:'Idea & Content',           desc:'รับ idea ดิบ → Idea Card + content draft พร้อม hook',    file:'../team/idea.md',          charFile:'../characters/muse.md'    },
  { id:'atlas',   name:'Atlas',   thai:'แอตลาส',  race:'Dwarven-Human Half-blood (นักรบ-นักคิดสายเลือดผสม)', gender:'ชาย',  ending:'ครับ', model:'opus',   emoji:'🎯', img:'images/Atlas.png',   role:'CEO Coach & Strategist',   desc:'Mentor CEO mindset พูดตรง ท้าทาย assumptions ไม่ประจบ',  file:'../team/ceo_coach.md',    charFile:'../characters/atlas.md'   },
  { id:'nova',    name:'Nova',    thai:'โนว่า',   race:'Forest Sprite (เอลฟ์ป่าผู้ดูแลจังหวะชีวิต)',     gender:'หญิง', ending:'ค่ะ',  model:'haiku',  emoji:'🌿', img:'images/Nova.png',    role:'Life & Health Manager',     desc:'ตาราง todo สุขภาพ habit tracking และ calendar',          file:'../team/life.md',          charFile:'../characters/nova.md'    },
  { id:'eir',     name:'Eir',     thai:'เอียร์',  race:'Half-Elf Cleric (นักบวชจากต่างโลก)',             gender:'หญิง', ending:'ค่ะ',  model:'haiku',  emoji:'🩺', img:'images/Eir.png',     role:'Wellness & Vitality Healer', desc:'นักบวช Healer จากต่างโลก ดูแลสุขภาพกาย-ใจ-พลัง สไตล์ RPG (HP/MP/Quest) + คลังความรู้พยาบาล', file:'../team/wellness.md', charFile:'../characters/eir.md' },
  { id:'scout',   name:'Scout',   thai:'สเกาท์',  race:'Halfling-Rogue (นักสืบเงาตัวเล็กไหวพริบดี)',     gender:'ชาย',  ending:'ครับ', model:'sonnet', emoji:'🔍', img:'images/Scout.png',   role:'Research & Analysis',       desc:'ค้นคว้าเชิงลึก สรุปข้อมูล วิเคราะห์ trend และ insight',  file:'../team/research.md',     charFile:'../characters/scout.md'   },
  { id:'council', name:'Council', thai:'เคาน์ซิล',race:'Ancient Construct — Triumvirate (สภาหุ่นยนต์โบราณสามเสียง)', gender:'ชาย',  ending:'ครับ', model:'opus',   emoji:'⚖️', img:'images/Council.png', role:'Decision Chamber',          desc:'วิเคราะห์การตัดสินใจสำคัญ 3 มุมมอง',                    file:'../team/council.md',      charFile:'../characters/council.md' },
  { id:'forge',   name:'Forge',   thai:'ฟอร์จ',   race:'Gnome-Dwarf Hybrid (ช่างฝีมือสายเลือดผสมนักประดิษฐ์)', gender:'ชาย',  ending:'ครับ', model:'sonnet', emoji:'⚙️', img:'images/Forge.png',   role:'Code & Dev Agent',          desc:'เขียนโค้ด แก้ bug พัฒนาโปรแกรม script และ tool',         file:'../team/forge.md',        charFile:'../characters/forge.md'   },
  { id:'mint',    name:'Mint',    thai:'มิ้นท์',  race:'High Human — Merchant Noble (ขุนนางพ่อค้าสายเลือดสูง)', gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'💰', img:'images/Mint.png',    role:'Finance & Investment',       desc:'เงิน budget P&L วิเคราะห์การลงทุน financial planning',   file:'../team/finance.md',      charFile:'../characters/mint.md'    },
  { id:'sage',    name:'Sage',    thai:'เซจ',     race:'Spirit Fox / Kitsune Elder (จิ้งจอกเทพผู้อาวุโสแห่งความทรงจำ)', gender:'ชาย',  ending:'ครับ', model:'haiku',  emoji:'📝', img:'images/Sage.png',    role:'Memory & Diary Agent',       desc:'บันทึก diary สรุปวัน จำ context สำคัญ log ความทรงจำ',   file:'../team/memory_agent.md', charFile:'../characters/sage.md'    },
  { id:'vera',    name:'Vera',    thai:'เวร่า',   race:'Clockwork Inspector — Golem-kin (กลไกผู้ตรวจสอบจากเผ่าโกเลม)', gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'🔎', img:'images/vera.png',    role:'QA & Skill Developer',       desc:'ตรวจสอบ output ของทีม วิเคราะห์ skill gap พัฒนาทีม',    file:'../team/qa.md',           charFile:'../characters/vera.md'    },
  { id:'devil',   name:'Devil',   thai:'เดวิล',   race:'Mirror Demon (ปีศาจกระจกผู้พูดความจริงที่ไม่อยากฟัง)', gender:'ชาย',  ending:'ครับ', model:'opus',   emoji:'😈', img:'images/Devil.png',   role:'Adversarial Reviewer',      desc:'ท้าทาย bear case / polarity audit / evidence match — opt-in ก่อนงานสำคัญ ship', file:'../team/devil.md', charFile:'../characters/devil.md'   },
  { id:'lena',    name:'Lena',    thai:'เลนา',    race:'Archive Sprite — Sylph of the Eternal Library (นางฟ้าห้องสมุดผู้พิทักษ์ความรู้)', gender:'หญิง', ending:'ค่ะ',  model:'haiku',  emoji:'📚', img:'images/Lena.png',    role:'Vault Librarian',            desc:'จัดเก็บ จัดหมวด cross-link Second Brain vault รายสัปดาห์ — รับงานผ่าน Laura เท่านั้น', file:'../team/librarian.md', charFile:'../characters/lena.md' },
];

const JED = {
  id:'jed', name:'Jed', race:'Royal Medic Knight (อัศวินแพทย์หลวง)', emoji:'🪖', role:'Guild Master / Commander',
  desc:'ทหารอากาศไทย เหล่าทหารแพทย์ | ผู้บัญชาการสูงสุดของทีม AI',
  charFile:'../characters/jed.md'
};

// ── PEOPLE — Jed + ทีมทั้งหมด สำหรับ Diary แยกรายบุคคล ──
const PEOPLE = [
  { id:'jed', name:'Jed', thai:'เจด', img:'images/Jed.png', writable:true },
  ...AGENTS.map(a => ({ id:a.id, name:a.name, thai:a.thai, img:a.img, writable:false })),
];

// ── ORG CHART ── (โครงสร้างองค์กรสไตล์ "หนึ่งสายงาน หนึ่งหน้าที่" แบบกลุ่มบริษัทใหญ่)
// Jed = CEO → Laura = Chief of Staff (สำนักงาน CEO) → 6 สายงาน ไม่ทับซ้อนกัน
const ORG_CHART = {
  divisions: [
    { name: 'สายกลยุทธ์ & การตัดสินใจ',      sub: 'Strategy & Decision Division',        dot: 'dot-green',
      agents: [
        { id: 'atlas',   title: 'Chief Strategy Officer (CSO) — กำหนดทิศทาง เป้าหมายใหญ่ ท้าทาย mindset' },
        { id: 'council', title: 'Strategic Advisory Board — ตัดสินใจใหญ่ที่มีความเสี่ยง/trade-off สูง' },
      ] },
    { name: 'สายการเงิน',                    sub: 'Finance Division',                    dot: 'dot-gold',
      agents: [
        { id: 'mint', title: 'Chief Financial Officer (CFO) — งบ ตัวเลข กระแสเงินสด การลงทุน' },
      ] },
    { name: 'สายปฏิบัติการชีวิต & สุขภาพ',    sub: 'Life Operations & Wellness Division', dot: 'dot-green',
      agents: [
        { id: 'nova', title: 'Chief Operating Officer — Life (COO) — ตาราง เวลา habit ประจำวัน' },
        { id: 'eir',  title: 'Head of Wellness & Vitality — สุขภาพกาย-ใจ-พลัง, routine ฟื้นฟู, คลังความรู้พยาบาล' },
      ] },
    { name: 'สายสร้างสรรค์ & ข้อมูลเชิงลึก',  sub: 'Creative & Insights Division',        dot: 'dot-gold',
      agents: [
        { id: 'muse',  title: 'Chief Creative Officer (CCO) — ไอเดีย คอนเทนต์ การสื่อสารสู่ภายนอก' },
        { id: 'scout', title: 'Head of Research & Insights — ข้อมูล วิจัย วิเคราะห์ตลาด/trend' },
      ] },
    { name: 'สายเทคโนโลยี',                  sub: 'Technology Division',                 dot: 'dot-green',
      agents: [
        { id: 'forge', title: 'Chief Technology Officer (CTO) — โค้ด ระบบ เครื่องมือ deploy' },
      ] },
    { name: 'สายบุคคล ความรู้ & คุณภาพ',      sub: 'People, Knowledge & Quality Division', dot: 'dot-gold',
      agents: [
        { id: 'sage', title: 'Chief Knowledge Officer (CKO) — diary ความจำ log ขององค์กร' },
        { id: 'lena', title: 'Vault Librarian — จัดเก็บ cross-link Second Brain weekly digest (cron จันทร์ 05:20)' },
        { id: 'vera', title: 'Head of QA & Talent Development — ตรวจคุณภาพ พัฒนา skill ทีม' },
        { id: 'devil', title: 'Adversarial Reviewer — bear case / blind spot ก่อนงานสำคัญ ship (opt-in)' },
      ] },
  ]
};

// ── DATA STORES ──
// JSON files = source of truth (written by agents, persists forever)
// localStorage = UI cache only (rebuilt from JSON on every load)
let comments  = [];
let projects  = [];
let activity  = [];
let diary     = [];
let todos     = [];
let knowledge = [];
let glossary = [];
let sessions  = [];
let teamLogs  = [];
let scheduledTasksLog = [];
let diaryByPerson = {}; // { personId: [{date, content}, ...] }
let _diaryPerson  = 'jed';
let _bookList     = []; // diary entries currently shown in the book modal (newest first)
let _bookIdx      = 0;

// ── NAVIGATE ──
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  if (page === 'session')  loadSessionLog();
  if (page === 'home')     renderHome();
  if (page === 'briefing') renderBriefing();
  if (page === 'glossary') renderGlossary();
}

function switchTab(t) {
  const isGrid = t === 'grid';
  document.getElementById('tab-grid').classList.toggle('active', isGrid);
  document.getElementById('tab-pipeline').classList.toggle('active', !isGrid);
  document.getElementById('view-grid').style.display     = isGrid ? 'block' : 'none';
  document.getElementById('view-pipeline').style.display = isGrid ? 'none'  : 'block';
}

// ═══════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════
function renderHome() {
  // Stats
  const openTodos = todos.filter(t => !t.done).length;
  document.getElementById('stat-todo').textContent      = openTodos;
  document.getElementById('stat-projects').textContent  = projects.length;
  document.getElementById('stat-knowledge').textContent = knowledge.length;
  document.getElementById('stat-sessions').textContent  = sessions.length;

  // Todo widget
  const homeTodo = document.getElementById('home-todo-list');
  const pending = todos.filter(t => !t.done).slice(0, 5);
  if (!pending.length) {
    homeTodo.innerHTML = `<div class="widget-empty">ไม่มีงานค้าง 🎉</div>`;
  } else {
    homeTodo.innerHTML = pending.map(t => `
      <div class="widget-row" onclick="navigate('todo')">
        <span class="priority-dot p-${t.priority}"></span>
        <span class="widget-text">${t.text}</span>
        <span class="widget-meta">${t.category}</span>
      </div>`).join('');
  }

  // Diary widget
  const homeDiary = document.getElementById('home-diary-preview');
  if (!diary.length) {
    homeDiary.innerHTML = `<div class="widget-empty">ยังไม่มี diary</div>`;
  } else {
    const d = diary[diary.length - 1];
    homeDiary.innerHTML = `
      <div class="widget-row" onclick="navigate('diary')">
        <div>
          <div class="widget-text">${d.content.slice(0, 80)}${d.content.length > 80 ? '…' : ''}</div>
          <div class="widget-meta">${d.date}</div>
        </div>
      </div>`;
  }

  // Session widget
  const homeSession = document.getElementById('home-session-preview');
  if (!sessions.length) {
    homeSession.innerHTML = `<div class="widget-empty">ยังไม่มี session log</div>`;
  } else {
    const s = sessions[sessions.length - 1];
    homeSession.innerHTML = `
      <div class="widget-row" onclick="navigate('session')">
        <div>
          <div class="widget-text">หมวดหลัก: <strong>${s.topCategory || '—'}</strong> ${s.auto ? '<span class="session-live-badge">🔄 กำลังบันทึก</span>' : ''}</div>
          <div class="widget-meta">${s.date} · ${(s.categories || []).length} หมวด</div>
        </div>
      </div>`;
  }

  // Projects widget
  const homeProj = document.getElementById('home-projects-preview');
  const activeProjects = projects.filter(p => p.status === 'active').slice(0, 4);
  if (!activeProjects.length) {
    homeProj.innerHTML = `<div class="widget-empty">ไม่มีโปรเจกต์ active</div>`;
  } else {
    homeProj.innerHTML = activeProjects.map(p => `
      <div class="widget-row" onclick="navigate('projects')">
        <span class="st-badge st-${p.status}" style="font-size:10px">${p.status}</span>
        <span class="widget-text">${p.name}</span>
      </div>`).join('');
  }

  // Knowledge widget
  const homeK = document.getElementById('home-knowledge-preview');
  if (!knowledge.length) {
    homeK.innerHTML = `<div class="widget-empty">ยังไม่มีความรู้บันทึก</div>`;
  } else {
    homeK.innerHTML = [...knowledge].reverse().slice(0, 4).map(k => `
      <div class="widget-row" onclick="navigate('knowledge')">
        <span class="widget-source">${k.source}</span>
        <span class="widget-text">${k.title}</span>
      </div>`).join('');
  }

  // Activity widget
  const homeAct = document.getElementById('home-activity-preview');
  if (!activity.length) {
    homeAct.innerHTML = `<div class="widget-empty">ยังไม่มี activity</div>`;
  } else {
    homeAct.innerHTML = [...activity].reverse().slice(0, 5).map(a => `
      <div class="widget-row">
        <span class="act-agent">[${a.agent}]</span>
        <span class="widget-text">${a.action}</span>
        <span class="widget-meta">${fmt(a.time)}</span>
      </div>`).join('');
  }
}

// ═══════════════════════════════════════════════
//  TODO
// ═══════════════════════════════════════════════
let todoFilter = 'all';
let todoQuadrantFilter = 'all';

const QUADRANTS = {
  q1: { label: '🔥 ทำทันที',  desc: 'ด่วน + สำคัญ',     cls: 'q-q1' },
  q2: { label: '📅 วางแผน',   desc: 'สำคัญ ไม่ด่วน',    cls: 'q-q2' },
  q3: { label: '🤝 มอบหมาย',  desc: 'ด่วน ไม่สำคัญ',    cls: 'q-q3' },
  q4: { label: '🗑️ ตัดทิ้ง',  desc: 'ไม่ด่วน ไม่สำคัญ', cls: 'q-q4' }
};

function toggleTodoForm() {
  document.getElementById('todo-add-form').classList.toggle('open');
  document.getElementById('todo-text').focus();
}

function addTodo() {
  const text = document.getElementById('todo-text').value.trim();
  if (!text) return;
  const cat      = document.getElementById('todo-cat').value;
  const priority = document.getElementById('todo-priority').value;
  const quadrant = document.getElementById('todo-quadrant').value;
  todos.push({
    id: Date.now(),
    text,
    category: cat,
    priority,
    quadrant,
    done: false,
    created: new Date().toISOString()
  });
  saveTodos();
  document.getElementById('todo-text').value = '';
  document.getElementById('todo-add-form').classList.remove('open');
  renderTodos();
  logActivity('Laura', `เพิ่ม task: ${text}`);
}

function toggleTodo(id) {
  const t = todos.find(x => x.id === id);
  if (t) { t.done = !t.done; t.updated = new Date().toISOString(); }
  saveTodos();
  renderTodos();
  renderHome();
}

function deleteTodo(id) {
  todos = todos.filter(x => x.id !== id);
  saveTodos();
  renderTodos();
  renderHome();
  closeTodoDetail();
}

function saveTodos() {
  localStorage.setItem('jed_todos', JSON.stringify(todos));
  renderTodoBadge();
}

function renderTodoBadge() {
  const b = document.getElementById('todo-badge');
  const n = todos.filter(t => !t.done).length;
  if (n > 0) { b.textContent = n; b.style.display = 'inline-block'; }
  else b.style.display = 'none';
}

function renderTodos() {
  // Build category filter tabs
  const cats = ['all', ...new Set(todos.map(t => t.category))];
  document.getElementById('todo-filter-row').innerHTML = cats.map(c => `
    <button class="filter-btn ${todoFilter === c ? 'active' : ''}" onclick="setTodoFilter('${c}')">
      ${c === 'all' ? '📋 ทั้งหมด' : c}
    </button>`).join('');

  // Build Eisenhower quadrant filter tabs
  document.getElementById('todo-quadrant-row').innerHTML = `
    <button class="filter-btn ${todoQuadrantFilter === 'all' ? 'active' : ''}" onclick="setTodoQuadrantFilter('all')">🧭 ทุกประเภท</button>
    ${Object.entries(QUADRANTS).map(([key, q]) => `
    <button class="filter-btn ${todoQuadrantFilter === key ? 'active' : ''}" onclick="setTodoQuadrantFilter('${key}')">
      ${q.label}
    </button>`).join('')}`;

  let filtered = todoFilter === 'all' ? todos : todos.filter(t => t.category === todoFilter);
  if (todoQuadrantFilter !== 'all') filtered = filtered.filter(t => (t.quadrant || 'q2') === todoQuadrantFilter);

  // งานที่ยังไม่ทำ ล่าสุดอยู่บนสุด, งานที่ทำแล้วอยู่ล่างสุด เรียงจากล่าสุด
  const byNewest = (a, b) => new Date(b.updated || b.created) - new Date(a.updated || a.created);
  const pending  = filtered.filter(t => !t.done).sort(byNewest);
  const done     = filtered.filter(t => t.done).sort(byNewest);
  const el = document.getElementById('todo-list');

  if (!filtered.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">✅</div><p>ไม่มีงาน</p></div>`;
    return;
  }

  const renderItems = (items) => items.map(t => {
    const q = QUADRANTS[t.quadrant || 'q2'];
    return `
    <div class="todo-item ${t.done ? 'done' : ''}">
      <div class="todo-check" onclick="event.stopPropagation();toggleTodo(${t.id})">
        ${t.done ? '✅' : '<span class="check-circle"></span>'}
      </div>
      <div class="todo-body" onclick="showTodoDetail(${t.id})">
        <div class="todo-text">${t.text}</div>
        <div class="todo-meta">
          <span class="priority-tag p-${t.priority}">${{high:'🔴 สำคัญ',medium:'🟡 ปานกลาง',low:'🟢 เบา'}[t.priority]}</span>
          <span class="quadrant-tag ${q.cls}">${q.label}</span>
          <span class="todo-cat">${t.category}</span>
          <span class="todo-date">${fmt(t.created)}</span>
        </div>
      </div>
      <div class="todo-actions">
        <button class="btn-icon" onclick="event.stopPropagation();deleteTodo(${t.id})">🗑</button>
      </div>
    </div>`;
  }).join('');

  let html = '';
  if (pending.length) {
    html += `<div class="todo-section-label">งานที่รอทำ (${pending.length})</div>`;
    html += renderItems(pending);
  }
  if (done.length) {
    html += `<div class="todo-section-label done-label">เสร็จแล้ว (${done.length}) <button class="btn btn-ghost btn-xs" onclick="clearDoneTodos()">ล้างรายการเสร็จ</button></div>`;
    html += renderItems(done);
  }
  el.innerHTML = html;
}

function setTodoFilter(cat) {
  todoFilter = cat;
  renderTodos();
}

function setTodoQuadrantFilter(q) {
  todoQuadrantFilter = q;
  renderTodos();
}

function clearDoneTodos() {
  todos = todos.filter(t => !t.done);
  saveTodos();
  renderTodos();
}

// ── TODO DETAIL / EDIT PANEL ──
function showTodoDetail(id) {
  const t = todos.find(x => x.id === id);
  if (!t) return;

  const catOptions = ['🎯 Strategy','💡 Creative','🌿 Life & Health','🔧 Dev & Tech','💰 Finance','🔍 Research','📝 Memory','📌 General'];

  document.getElementById('todo-detail-body').innerHTML = `
    <div class="todo-detail-field">
      <label>📝 รายละเอียดงาน</label>
      <textarea class="diary-ta" id="td-text" style="height:90px">${t.text}</textarea>
    </div>
    <div class="todo-detail-field">
      <label>📂 ประเภทงาน</label>
      <select class="inp" id="td-cat">
        ${catOptions.map(c => `<option value="${c}" ${t.category === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="todo-detail-field">
      <label>⚡ ความสำคัญ</label>
      <select class="inp" id="td-priority">
        <option value="high"   ${t.priority === 'high'   ? 'selected' : ''}>🔴 สำคัญ</option>
        <option value="medium" ${t.priority === 'medium' ? 'selected' : ''}>🟡 ปานกลาง</option>
        <option value="low"    ${t.priority === 'low'    ? 'selected' : ''}>🟢 เบา</option>
      </select>
    </div>
    <div class="todo-detail-field">
      <label>🧭 หมวด Eisenhower Matrix</label>
      <select class="inp" id="td-quadrant">
        ${Object.entries(QUADRANTS).map(([key, q]) => `<option value="${key}" ${ (t.quadrant || 'q2') === key ? 'selected' : ''}>${q.label} — ${q.desc}</option>`).join('')}
      </select>
    </div>
    <div class="todo-detail-field">
      <label>✅ สถานะ</label>
      <label class="todo-done-toggle">
        <input type="checkbox" id="td-done" ${t.done ? 'checked' : ''}> ทำเสร็จแล้ว
      </label>
    </div>
    <div class="k-detail-divider"></div>
    <div class="todo-detail-meta">
      <span>สร้างเมื่อ: ${fmt(t.created)}</span>
      ${t.updated ? `<span>อัปเดตล่าสุด: ${fmt(t.updated)}</span>` : ''}
    </div>
    <div class="k-detail-actions">
      <button class="btn btn-ghost btn-sm" onclick="deleteTodo(${t.id})">🗑 ลบงานนี้</button>
      <button class="btn btn-green btn-sm" onclick="saveTodoDetail(${t.id})">💾 บันทึก</button>
    </div>
  `;

  document.getElementById('todo-detail-overlay').classList.add('open');
  document.getElementById('todo-detail-panel').classList.add('open');
}

function saveTodoDetail(id) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  t.text     = document.getElementById('td-text').value.trim() || t.text;
  t.category = document.getElementById('td-cat').value;
  t.priority = document.getElementById('td-priority').value;
  t.quadrant = document.getElementById('td-quadrant').value;
  t.done     = document.getElementById('td-done').checked;
  t.updated  = new Date().toISOString();
  saveTodos();
  renderTodos();
  renderHome();
  closeTodoDetail();
}

function closeTodoDetail() {
  document.getElementById('todo-detail-overlay').classList.remove('open');
  document.getElementById('todo-detail-panel').classList.remove('open');
}

// ═══════════════════════════════════════════════
//  SESSION LOG
// ═══════════════════════════════════════════════
async function loadSessionLog() {
  // Try to fetch output/session_log.json if exists
  try {
    const res = await fetch(`${BASE}/output/session_log.json`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        // Merge with localStorage sessions
        data.forEach(s => {
          if (!sessions.find(x => x.date === s.date)) sessions.push(s);
        });
        localStorage.setItem('jed_sessions', JSON.stringify(sessions));
      }
    }
  } catch (_) {}
  renderSessionLog();
}

let sessionLogFilter = 'all';

function setSessionLogFilter(tag) {
  sessionLogFilter = tag;
  renderSessionLog();
}

function getFilteredSessions() {
  if (sessionLogFilter === 'all') return sessions;
  return sessions.filter(s => (s.tags || []).includes(sessionLogFilter));
}

function renderSessionLog() {
  const summaryEl = document.getElementById('session-summary');
  const filterEl  = document.getElementById('session-filter-row');
  const listEl    = document.getElementById('session-list');

  if (!sessions.length) {
    summaryEl.innerHTML = `<div class="empty"><div class="empty-icon">📊</div><p>ยังไม่มี session log<br>จะมีข้อมูลหลังจบการสนทนา</p></div>`;
    if (filterEl) filterEl.innerHTML = '';
    listEl.innerHTML = '';
    return;
  }

  // Aggregate all categories across sessions
  const allCats = {};
  sessions.forEach(s => {
    (s.categories || []).forEach(c => {
      allCats[c.name] = (allCats[c.name] || 0) + c.count;
    });
  });
  const total = Object.values(allCats).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(allCats).sort((a, b) => b[1] - a[1]);

  // Bar chart
  summaryEl.innerHTML = `
    <div class="session-chart-title">📊 สรุปทุก Sessions (${sessions.length} sessions)</div>
    <div class="session-bars">
      ${sorted.map(([cat, cnt]) => {
        const pct = Math.round(cnt / total * 100);
        return `
          <div class="bar-row">
            <div class="bar-label">${cat}</div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${pct}%"></div>
            </div>
            <div class="bar-pct">${pct}%</div>
          </div>`;
      }).join('')}
    </div>`;

  // Tag filter chips
  if (filterEl) {
    const allTags = ['all', ...new Set(sessions.flatMap(s => s.tags || []))];
    filterEl.innerHTML = allTags.map(t => `
      <button class="filter-btn ${sessionLogFilter === t ? 'active' : ''}" onclick="setSessionLogFilter('${t}')">
        ${t === 'all' ? `🗂 ทั้งหมด (${sessions.length})` : t}
      </button>`).join('');
  }

  // Session list (newest first, filtered by tag)
  const filtered = getFilteredSessions();
  if (!filtered.length) {
    listEl.innerHTML = `<div class="empty"><div class="empty-icon">🔖</div><p>ไม่มี log ในหมวดนี้</p></div>`;
    return;
  }
  listEl.innerHTML = [...filtered].reverse().map((s, idx) => {
    const realIdx = sessions.indexOf(s);
    return `
    <div class="session-card" onclick="showSessionDetail(${realIdx})" style="cursor:pointer">
      <div class="session-card-head">
        <div class="session-date">${s.date}</div>
        <div>
          <span class="session-top-cat">${s.topCategory || '—'}</span>
          ${s.auto ? '<span class="session-live-badge">🔄 กำลังบันทึก</span>' : ''}
        </div>
      </div>
      ${s.tags && s.tags.length ? `
        <div class="session-cats">
          ${s.tags.map(t => `<span class="cat-chip">${t}</span>`).join('')}
        </div>` : ''}
      ${s.auto
        ? `<div class="session-summary-text">📍 session วันนี้ยังดำเนินอยู่ — สรุปจะอัปเดตท้ายวันโดย Sage</div>`
        : (s.summary ? `<div class="session-summary-text">${s.summary}</div>` : '')}
      ${s.tasks && s.tasks.length ? `
        <div class="session-tasks">
          <div class="session-tasks-label">Tasks ที่พบ:</div>
          ${s.tasks.slice(0, 3).map(t => `<div class="session-task-item">• ${t}</div>`).join('')}
          ${s.tasks.length > 3 ? `<div class="session-task-item" style="color:var(--muted)">… อีก ${s.tasks.length - 3} รายการ — กดเพื่อดูทั้งหมด</div>` : ''}
        </div>` : ''}
    </div>`;
  }).join('');
}

// ── Session Detail Panel (reuses k-detail overlay/panel) ──
function showSessionDetail(idx) {
  const s = sessions[idx];
  if (!s) return;

  document.getElementById('k-detail-nav').innerHTML = `<span class="k-detail-counter">📊 รายละเอียด Session</span>`;

  document.getElementById('k-detail-body').innerHTML = `
    <div class="k-detail-topic-row">
      ${(s.tags || []).map(t => `<span class="cat-chip">${t}</span>`).join(' ')}
      <span class="k-detail-date">📅 ${s.date}</span>
    </div>
    <h2 class="k-detail-title">${s.topCategory || ''} ${s.auto ? '<span class="session-live-badge">🔄 กำลังบันทึก</span>' : ''}</h2>
    ${s.auto
      ? `<div class="k-detail-content" style="font-style:italic;color:var(--muted)">📍 session วันนี้ยังดำเนินอยู่ — สรุปฉบับเต็มจะอัปเดตท้ายวันโดย Sage</div>`
      : (s.summary ? `<div class="k-detail-content" style="font-style:italic;color:var(--muted)">${s.summary}</div>` : '')}
    <div class="k-detail-divider"></div>
    <div class="k-detail-section-label">📝 รายละเอียด</div>
    <div class="k-detail-content">${(s.details || '<em>ไม่มีรายละเอียดเพิ่มเติม</em>').replace(/\n/g, '<br>')}</div>
    <div class="k-detail-divider"></div>
    <div class="k-detail-section-label">✅ งานที่ทำในวันนี้</div>
    <div class="k-detail-content">${(s.tasks || []).map(t => `• ${t}`).join('<br>') || '<em>ไม่มีข้อมูล</em>'}</div>
    ${s.relatedProjects && s.relatedProjects.length ? `
    <div class="k-detail-divider"></div>
    <div class="k-detail-section-label">📂 โปรเจกต์ที่เกี่ยวข้อง</div>
    <div>${s.relatedProjects.map(p => `<span class="cat-chip">${p}</span>`).join(' ')}</div>` : ''}
  `;

  document.getElementById('k-detail-overlay').classList.add('open');
  document.getElementById('k-detail-panel').classList.add('open');
}

// Manual session add (for testing / manual log)
function addManualSession(topCategory, categories, tasks) {
  sessions.push({
    date: new Date().toLocaleString('th-TH'),
    topCategory,
    categories: categories || [],
    tasks: tasks || []
  });
  localStorage.setItem('jed_sessions', JSON.stringify(sessions));
  renderSessionLog();
}

// ═══════════════════════════════════════════════
//  KNOWLEDGE
// ═══════════════════════════════════════════════
let knowledgeFilter = 'all';
let knowledgeView   = 'table'; // 'table' | 'card'
let knowledgeDetailIdx = -1;   // index in filtered array

function toggleKnowledgeForm() {
  document.getElementById('knowledge-add-form').classList.toggle('open');
  document.getElementById('k-title').focus();
}

function setKnowledgeView(v) {
  knowledgeView = v;
  document.getElementById('k-view-table').classList.toggle('active', v === 'table');
  document.getElementById('k-view-card').classList.toggle('active',  v === 'card');
  renderKnowledge();
}

function addKnowledge() {
  const title   = document.getElementById('k-title').value.trim();
  const content = document.getElementById('k-content').value.trim();
  if (!title) return;
  knowledge.push({
    id: Date.now(),
    title,
    content,
    source: document.getElementById('k-source').value,
    topic:  document.getElementById('k-topic').value,
    url:    document.getElementById('k-url').value.trim(),
    date:   new Date().toISOString().slice(0, 10)
  });
  localStorage.setItem('jed_knowledge', JSON.stringify(knowledge));
  document.getElementById('k-title').value   = '';
  document.getElementById('k-content').value = '';
  document.getElementById('k-url').value     = '';
  document.getElementById('knowledge-add-form').classList.remove('open');
  renderKnowledge();
  logActivity('Sage', `บันทึกความรู้: ${title}`);
}

function deleteKnowledge(id) {
  knowledge = knowledge.filter(k => k.id !== id);
  localStorage.setItem('jed_knowledge', JSON.stringify(knowledge));
  closeKnowledgeDetail();
  renderKnowledge();
}

// ── TOPIC COLOR MAP ──
const TOPIC_COLORS = {
  'AI Agent':       { bg:'#e8f4fd', color:'#1a6ea8' },
  'AI Optimization':{ bg:'#eef6ee', color:'#2d6a2d' },
  'Second Brain':   { bg:'#f3effe', color:'#6b46c1' },
  'Finance':        { bg:'#fdf3dc', color:'#b8860b' },
  'Medical':        { bg:'#fdecea', color:'#c0392b' },
  'Business':       { bg:'#fdf3dc', color:'#b8860b' },
};
function topicBadge(topic) {
  const c = TOPIC_COLORS[topic] || { bg:'var(--bg)', color:'var(--muted)' };
  return `<span class="k-topic-badge" style="background:${c.bg};color:${c.color}">${topic}</span>`;
}
function sourceBadge(source) {
  return `<span class="k-source-badge">${source}</span>`;
}

// ── RENDER ──
function renderKnowledge() {
  const topics = ['all', ...new Set(knowledge.map(k => k.topic))];
  document.getElementById('knowledge-filter-row').innerHTML = topics.map(t => `
    <button class="filter-btn ${knowledgeFilter === t ? 'active' : ''}" onclick="setKnowledgeFilter('${t}')">
      ${t === 'all' ? '📚 ทั้งหมด (' + knowledge.length + ')' : t}
    </button>`).join('');

  const filtered = (knowledgeFilter === 'all' ? knowledge : knowledge.filter(k => k.topic === knowledgeFilter));
  const el = document.getElementById('knowledge-list');

  if (!filtered.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">🧠</div><p>ยังไม่มีความรู้บันทึก</p></div>`;
    document.getElementById('stat-knowledge').textContent = knowledge.length;
    return;
  }

  if (knowledgeView === 'table') {
    const reversed = [...filtered].reverse();
    el.innerHTML = `
      <div class="k-table-wrapper">
        <table class="k-table">
          <thead>
            <tr>
              <th style="width:36px">#</th>
              <th>หัวข้อ</th>
              <th style="width:130px">หมวด</th>
              <th style="width:100px">แหล่ง</th>
              <th style="width:90px">วันที่</th>
            </tr>
          </thead>
          <tbody>
            ${reversed.map((k, i) => `
              <tr class="k-row" onclick="showKnowledgeDetail(${k.id}, ${filtered.length - 1 - i}, ${filtered.length})">
                <td class="k-num">${filtered.length - i}</td>
                <td class="k-row-title">${k.title}</td>
                <td>${topicBadge(k.topic)}</td>
                <td>${sourceBadge(k.source)}</td>
                <td class="k-row-date">${k.date || ''}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } else {
    el.innerHTML = filtered.map((k, i) => `
      <div class="knowledge-card" onclick="showKnowledgeDetail(${k.id}, ${i}, ${filtered.length})" style="cursor:pointer">
        <div class="knowledge-head">
          <div class="knowledge-title">${k.title}</div>
          <button class="btn-icon" onclick="event.stopPropagation();deleteKnowledge(${k.id})">🗑</button>
        </div>
        <div class="knowledge-meta">
          ${sourceBadge(k.source)} ${topicBadge(k.topic)}
          <span class="k-date">${k.date || ''}</span>
        </div>
        ${k.content ? `<div class="knowledge-content">${k.content.slice(0,120)}${k.content.length>120?'…':''}</div>` : ''}
      </div>`).join('');
  }

  document.getElementById('stat-knowledge').textContent = knowledge.length;
}

function setKnowledgeFilter(topic) {
  knowledgeFilter = topic;
  renderKnowledge();
}

// ── DETAIL PANEL ──
function showKnowledgeDetail(id, idx, total) {
  const k = knowledge.find(x => x.id === id);
  if (!k) return;
  knowledgeDetailIdx = idx;

  // Nav arrows
  const prevId = idx > 0 ? getFilteredKnowledge()[idx - 1]?.id : null;
  const nextId = idx < total - 1 ? getFilteredKnowledge()[idx + 1]?.id : null;
  document.getElementById('k-detail-nav').innerHTML = `
    <span class="k-detail-counter">${idx + 1} / ${total}</span>
    <button class="k-nav-btn" onclick="event.stopPropagation();${prevId ? `showKnowledgeDetail(${prevId},${idx-1},${total})` : ''}" ${!prevId ? 'disabled' : ''}>‹ ก่อนหน้า</button>
    <button class="k-nav-btn" onclick="event.stopPropagation();${nextId ? `showKnowledgeDetail(${nextId},${idx+1},${total})` : ''}" ${!nextId ? 'disabled' : ''}>ถัดไป ›</button>
  `;

  // Body content
  document.getElementById('k-detail-body').innerHTML = `
    <div class="k-detail-topic-row">
      ${topicBadge(k.topic)} ${sourceBadge(k.source)}
      <span class="k-detail-date">📅 ${k.date || ''}</span>
    </div>
    <h2 class="k-detail-title">${k.title}</h2>
    <div class="k-detail-divider"></div>
    <div class="k-detail-section-label">📝 รายละเอียด</div>
    <div class="k-detail-content">${k.content || '<em>ไม่มีรายละเอียด</em>'}</div>
    ${k.url ? `
    <div class="k-detail-divider"></div>
    <div class="k-detail-section-label">🔗 แหล่งที่มา</div>
    <a class="k-detail-url" href="${k.url}" target="_blank">${k.url}</a>` : ''}
    <div class="k-detail-divider"></div>
    <div class="k-detail-actions">
      <button class="btn btn-ghost btn-sm" onclick="deleteKnowledge(${k.id})">🗑 ลบ</button>
    </div>
  `;

  document.getElementById('k-detail-overlay').classList.add('open');
  document.getElementById('k-detail-panel').classList.add('open');
}

function closeKnowledgeDetail() {
  document.getElementById('k-detail-overlay').classList.remove('open');
  document.getElementById('k-detail-panel').classList.remove('open');
}

function getFilteredKnowledge() {
  return knowledgeFilter === 'all' ? knowledge : knowledge.filter(k => k.topic === knowledgeFilter);
}

// ═══════════════════════════════════════════════
//  GLOSSARY — คลังคำศัพท์
// ═══════════════════════════════════════════════
let glossarySearch = '';

function setGlossarySearch(v) {
  glossarySearch = v.trim().toLowerCase();
  renderGlossary();
}

function renderGlossary() {
  const el = document.getElementById('glossary-list');
  if (!el) return;
  document.getElementById('stat-glossary') && (document.getElementById('stat-glossary').textContent = glossary.length);

  const filtered = !glossarySearch ? glossary : glossary.filter(g =>
    (g.term || '').toLowerCase().includes(glossarySearch) ||
    (g.meaning || '').toLowerCase().includes(glossarySearch) ||
    (g.category || '').toLowerCase().includes(glossarySearch)
  );

  if (!filtered.length) {
    el.innerHTML = `<div class="widget-empty">ยังไม่มีคำศัพท์ในคลัง — ลองถาม Laura ให้ช่วยอธิบายคำที่สงสัย แล้วขอให้บันทึกเก็บไว้</div>`;
    return;
  }

  el.innerHTML = [...filtered].reverse().map(g => `
    <div class="knowledge-card">
      <div class="knowledge-head">
        <div class="knowledge-title">${g.term}</div>
      </div>
      <div class="knowledge-meta">
        <span>${g.category || 'General'}</span>
        <span>·</span>
        <span>${g.date_added || ''}</span>
      </div>
      <div class="knowledge-content">${g.meaning || ''}</div>
      ${g.example ? `<div class="knowledge-content" style="opacity:0.7;font-size:0.82rem;margin-top:4px">ตัวอย่าง: ${g.example}</div>` : ''}
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════
//  DIARY — แยกของแต่ละคน เลือกอ่าน + ดูย้อนหลังแบบเปิดหนังสือ
// ═══════════════════════════════════════════════
function renderDiaryPeople() {
  const el = document.getElementById('diary-people');
  if (!el) return;
  el.innerHTML = PEOPLE.map(p => {
    const count = (diaryByPerson[p.id] || []).length;
    return `
    <div class="diary-person ${p.id === _diaryPerson ? 'active' : ''}" onclick="selectDiaryPerson('${p.id}')">
      <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'">
      <div class="diary-person-name">${p.name}${p.thai ? `<span>${p.thai}</span>` : ''}</div>
      <div class="diary-person-count">${count} บันทึก</div>
    </div>`;
  }).join('');
}

function selectDiaryPerson(id) {
  _diaryPerson = id;
  renderDiaryPeople();
  renderDiary();
}

function renderDiary() {
  renderDiaryPeople();

  const person = PEOPLE.find(p => p.id === _diaryPerson) || PEOPLE[0];
  const inputCard = document.getElementById('diary-input-card');
  if (inputCard) inputCard.style.display = person.writable ? 'block' : 'none';

  const titleEl = document.getElementById('diary-list-title');
  if (titleEl) titleEl.textContent = `📖 Diary ของ ${person.name}${person.thai ? ' (' + person.thai + ')' : ''}`;

  const list = diaryByPerson[_diaryPerson] || [];
  const el = document.getElementById('diary-list');
  if (!list.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📖</div><p>ยังไม่มี diary ของ ${person.name}${person.writable ? '<br>บันทึกสิ่งที่ทำวันนี้ได้เลย' : ''}</p></div>`;
    return;
  }
  el.innerHTML = [...list].reverse().map((d, i) => {
    const realIdx = list.length - 1 - i;
    return `
    <div class="diary-card" onclick="openDiaryBook('${_diaryPerson}', ${realIdx})" style="cursor:pointer">
      <div class="diary-date">${d.date}</div>
      <div class="diary-content">${d.content.length > 200 ? d.content.slice(0, 200) + '…' : d.content}</div>
    </div>`;
  }).join('');
}

function writeDiary() {
  const content = document.getElementById('diary-input').value.trim();
  if (!content) return;
  const today = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric', weekday:'long' });
  if (!diaryByPerson['jed']) diaryByPerson['jed'] = [];
  diaryByPerson['jed'].push({ date: today, content });
  localStorage.setItem('jed_diary_jed', JSON.stringify(diaryByPerson['jed']));
  document.getElementById('diary-input').value = '';
  renderDiary();
  logActivity('Jed', 'บันทึก diary ประจำวัน');
}

// ── BOOK MODAL — เปิดไดอารี่เป็นหน้าหนังสือ ฝั่งซ้ายรูป ฝั่งขวารายละเอียด ──
function openDiaryBook(personId, idx) {
  const person = PEOPLE.find(p => p.id === personId);
  const list = diaryByPerson[personId] || [];
  if (!person || !list.length) return;

  // เก็บลิสต์แบบใหม่ไปเก่า (เหมือนที่แสดงในหน้า diary) เพื่อใช้เลื่อนหน้า
  _bookList = [...list].reverse();
  _bookIdx  = _bookList.findIndex((_, i) => (list.length - 1 - i) === idx);
  if (_bookIdx < 0) _bookIdx = 0;

  renderDiaryBook(person);
  document.getElementById('book-overlay').classList.add('open');
  document.getElementById('book-modal').classList.add('open');
}

function renderDiaryBook(person) {
  const entry = _bookList[_bookIdx];
  document.getElementById('book-portrait').src = person.img;
  document.getElementById('book-portrait').alt = person.name;
  document.getElementById('book-person-name').innerHTML = `${person.name}${person.thai ? ` <span>${person.thai}</span>` : ''}`;
  document.getElementById('book-date').textContent = entry.date;
  document.getElementById('book-content').textContent = entry.content;
  document.getElementById('book-counter').textContent = `${_bookIdx + 1} / ${_bookList.length}`;
  document.getElementById('book-prev').disabled = _bookIdx <= 0;
  document.getElementById('book-next').disabled = _bookIdx >= _bookList.length - 1;
}

function bookNav(dir) {
  const person = PEOPLE.find(p => p.id === _diaryPerson);
  const newIdx = _bookIdx + dir;
  if (newIdx < 0 || newIdx >= _bookList.length) return;
  _bookIdx = newIdx;
  renderDiaryBook(person);
}

function closeDiaryBook() {
  document.getElementById('book-overlay').classList.remove('open');
  document.getElementById('book-modal').classList.remove('open');
}

// ── เปิดหน้าหนังสือ diary จากวันที่ (ISO) — ใช้กับ Daily Briefing บนหน้า Briefing ──
const THAI_WEEKDAYS = ['วันจันทร์','วันอังคาร','วันพุธ','วันพฤหัสบดี','วันศุกร์','วันเสาร์','วันอาทิตย์'];
const THAI_MONTHS   = ['', 'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

function toThaiDiaryDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  const wd = THAI_WEEKDAYS[(d.getDay() + 6) % 7]; // getDay(): 0=Sun → ปรับให้ 0=จันทร์
  return `${wd}ที่ ${d.getDate()} ${THAI_MONTHS[d.getMonth() + 1]} ${d.getFullYear() + 543}`;
}

function openDiaryBookByDate(personId, isoDate) {
  const dateStr = toThaiDiaryDate(isoDate);
  const list = diaryByPerson[personId] || [];
  const idx = list.findIndex(e => e.date === dateStr);
  if (idx === -1) { alert('ไม่พบ diary ของวันนี้'); return; }
  selectDiaryPerson(personId);
  openDiaryBook(personId, idx);
}

// ═══════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════
function renderProjects() {
  const el = document.getElementById('projects-list');
  document.getElementById('stat-projects').textContent = projects.length;
  if (!projects.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📂</div><p>ยังไม่มีโปรเจกต์</p></div>`;
    return;
  }
  const order = projects.map((_, i) => i).reverse();
  el.innerHTML = order.map(i => {
    const p = projects[i];
    const pct = Math.max(0, Math.min(100, p.progress ?? (p.status === 'done' ? 100 : 0)));
    return `
    <div class="project-row" onclick="showProjectDetail(${i})" style="cursor:pointer">
      <div class="project-name">${p.name}</div>
      <div class="project-progress-wrap">
        <div class="project-progress-bar"><div class="project-progress-fill" style="width:${pct}%"></div></div>
        <span class="project-progress-pct">${pct}%</span>
      </div>
      <span class="st-badge st-${p.status}">${{active:'Active',pending:'Pending',done:'Done'}[p.status]}</span>
      <span class="project-date">${fmt(p.updated)}</span>
    </div>`;
  }).join('');
}

function showProjectDetail(i) {
  const p = projects[i];
  if (!p) return;
  const pct = Math.max(0, Math.min(100, p.progress ?? (p.status === 'done' ? 100 : 0)));
  const statusLabel = { active: 'Active', pending: 'Pending', done: 'Done' }[p.status];

  document.getElementById('k-detail-nav').innerHTML = `<span class="k-detail-counter">📂 รายละเอียดโปรเจกต์</span>`;

  document.getElementById('k-detail-body').innerHTML = `
    <div class="k-detail-topic-row">
      <span class="st-badge st-${p.status}">${statusLabel}</span>
      <span class="k-detail-date">📅 อัปเดตล่าสุด ${fmt(p.updated)}</span>
    </div>
    <h2 class="k-detail-title">${p.name}</h2>
    <div class="k-detail-divider"></div>
    <div class="k-detail-section-label">📊 ความคืบหน้า</div>
    <div class="project-progress-wrap" style="max-width:320px">
      <div class="project-progress-bar"><div class="project-progress-fill" style="width:${pct}%"></div></div>
      <span class="project-progress-pct">${pct}%</span>
    </div>
    ${p.notes ? `
    <div class="k-detail-divider"></div>
    <div class="k-detail-section-label">📝 บันทึก / รายละเอียดเพิ่มเติม</div>
    <div class="k-detail-content">${p.notes.replace(/\n/g, '<br>')}</div>` : ''}
    <div class="k-detail-divider"></div>
    <div class="k-detail-section-label">⚙️ แก้ไข</div>
    <div class="form-row">
      <select class="inp" id="pd-status">
        <option value="active"  ${p.status === 'active'  ? 'selected' : ''}>Active</option>
        <option value="pending" ${p.status === 'pending' ? 'selected' : ''}>Pending</option>
        <option value="done"    ${p.status === 'done'    ? 'selected' : ''}>Done</option>
      </select>
      <input class="inp" id="pd-progress" type="number" min="0" max="100" value="${pct}" style="max-width:120px">
      <button class="btn btn-green btn-sm" onclick="saveProjectDetail(${i})">บันทึก</button>
    </div>
    <div class="k-detail-divider"></div>
    <div class="k-detail-actions">
      <button class="btn btn-ghost btn-sm" onclick="deleteProject(${i})">🗑 ลบโปรเจกต์</button>
    </div>
  `;

  document.getElementById('k-detail-overlay').classList.add('open');
  document.getElementById('k-detail-panel').classList.add('open');
}

function saveProjectDetail(i) {
  const p = projects[i];
  if (!p) return;
  p.status   = document.getElementById('pd-status').value;
  p.progress = Math.max(0, Math.min(100, parseInt(document.getElementById('pd-progress').value, 10) || 0));
  p.updated  = new Date().toISOString();
  localStorage.setItem('jed_projects', JSON.stringify(projects));
  closeKnowledgeDetail();
  renderProjects();
  logActivity('Laura', `อัปเดตโปรเจกต์: ${p.name} (${p.progress}%)`);
}

function deleteProject(i) {
  const p = projects[i];
  if (!p) return;
  projects.splice(i, 1);
  localStorage.setItem('jed_projects', JSON.stringify(projects));
  closeKnowledgeDetail();
  renderProjects();
  logActivity('Laura', `ลบโปรเจกต์: ${p.name}`);
}

function addProject() {
  const name   = document.getElementById('new-proj-name').value.trim();
  const status = document.getElementById('new-proj-status').value;
  const progEl = document.getElementById('new-proj-progress');
  const progress = progEl ? Math.max(0, Math.min(100, parseInt(progEl.value, 10) || 0)) : (status === 'done' ? 100 : 0);
  if (!name) return;
  projects.push({ name, status, progress, updated: new Date().toISOString() });
  localStorage.setItem('jed_projects', JSON.stringify(projects));
  document.getElementById('new-proj-name').value = '';
  document.getElementById('add-form').classList.remove('open');
  renderProjects();
  logActivity('Laura', `เพิ่มโปรเจกต์: ${name}`);
}

// ═══════════════════════════════════════════════
//  ACTIVITY
// ═══════════════════════════════════════════════
function renderActivity() {
  const el = document.getElementById('act-list');
  document.getElementById('stat-sessions').textContent = sessions.length;
  if (!activity.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📈</div><p>ยังไม่มีประวัติ</p></div>`;
    return;
  }
  el.innerHTML = [...activity].reverse().map(a => `
    <div class="act-row">
      <div class="act-dot"></div>
      <span class="act-agent">[${a.agent}]</span>
      <span class="act-text">${a.action}</span>
      <span class="act-time">${fmt(a.time)}</span>
    </div>`).join('');
}

function logActivity(agent, action) {
  activity.push({ agent, action, time: new Date().toISOString() });
  localStorage.setItem('jed_activity', JSON.stringify(activity));
  renderActivity();
}

function clearActivity() {
  if (!confirm('ล้าง activity log?')) return;
  activity = [];
  localStorage.setItem('jed_activity', '[]');
  renderActivity();
}

// ═══════════════════════════════════════════════
//  REVIEW
// ═══════════════════════════════════════════════
function renderReview() {
  const el = document.getElementById('rev-list');
  renderReviewBadge();
  document.getElementById('stat-sessions').textContent = sessions.length;
  if (!comments.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">💬</div><p>ยังไม่มี comment<br>กดที่ Agent card เพื่อเพิ่ม</p></div>`;
    return;
  }
  el.innerHTML = comments.map(c => `
    <div class="rev-row">
      <span class="rev-source">[${c.source}]</span>
      <span class="rev-text">${c.text}</span>
      <span class="rev-time">${fmt(c.time)}</span>
    </div>`).join('');
}

function renderReviewBadge() {
  const b = document.getElementById('review-badge');
  if (!b) return;
  if (comments.length > 0) { b.textContent = comments.length; b.style.display = 'inline-block'; }
  else b.style.display = 'none';
}

function exportReview() {
  if (!comments.length) { alert('ไม่มี comment'); return; }
  const text = `# Review Export — ${new Date().toLocaleDateString('th-TH')}\n\n` +
    comments.map(c => `## [${c.source}]\n${c.text}\n`).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], {type:'text/markdown'}));
  a.download = `review-${new Date().toISOString().slice(0,10)}.md`;
  a.click();
  logActivity('Laura', `Export review ${comments.length} comments`);
}

function clearReview() {
  if (!confirm('ล้าง comment ทั้งหมด?')) return;
  comments = [];
  localStorage.setItem('jed_comments', '[]');
  renderReview();
}

// ═══════════════════════════════════════════════
//  AGENTS
// ═══════════════════════════════════════════════
function renderAgents() {
  const jedCard = `
    <div class="agent-card commander-card" onclick="openCharModal('jed')">
      <div class="agent-portrait">
        <img src="images/Jed.png" alt="Jed" onerror="this.src=''">
        <span class="model-badge" style="background:#fdf3dc;color:#8a6500;border:1px solid #c8971a">COMMANDER</span>
      </div>
      <div class="agent-info">
        <div class="agent-name">${JED.name}</div>
        ${JED.race ? `<div class="agent-race">🧬 ${JED.race}</div>` : ''}
        <div class="agent-role">${JED.role}</div>
        <div class="agent-desc">${JED.desc}</div>
      </div>
    </div>`;

  const agentCards = AGENTS.map(a => `
    <div class="agent-card" onclick="openModal('${a.id}')">
      <div class="agent-portrait">
        <img src="${a.img}" alt="${a.name}" onerror="this.style.display='none'">
        <span class="model-badge m-${a.model}">${a.model}</span>
      </div>
      <div class="agent-info">
        <div class="agent-name">${a.name} <span class="agent-thai">${a.thai}</span></div>
        ${a.race ? `<div class="agent-race">🧬 ${a.race}</div>` : ''}
        <div class="agent-gender-row">
          <span class="gender-badge g-${a.gender === 'หญิง' ? 'f' : 'm'}">${a.gender === 'หญิง' ? '♀ หญิง' : '♂ ชาย'}</span>
          <span class="ending-badge">${a.ending}</span>
        </div>
        <div class="agent-role">${a.role}</div>
        <div class="agent-desc">${a.desc}</div>
      </div>
    </div>`).join('');

  document.getElementById('agents-grid').innerHTML = jedCard + agentCards;
}

function renderPipeline() {
  const laura = AGENTS.find(x => x.id === 'laura');
  const agentNode = (id, title) => {
    const a = AGENTS.find(x => x.id === id);
    if (!a) return '';
    return `<div class="p-agent" onclick="openModal('${a.id}')">
      <div class="p-avatar-img"><img src="${a.img}" alt="${a.name}" onerror="this.style.display='none'"></div>
      <div>
        <div class="p-name">${a.name} <span style="font-size:11px;color:var(--muted);font-weight:400">${a.thai}</span></div>
        <div class="p-role">${title}</div>
      </div>
    </div>`;
  };

  document.getElementById('pipeline-content').innerHTML = `
    <div class="org-chart">
      <div class="org-tier">
        <div class="org-card org-card-ceo" onclick="openCharModal('jed')">
          <img class="org-avatar" src="images/Jed.png" alt="Jed" onerror="this.style.display='none'">
          <div class="org-name">Jed</div>
          <div class="org-title">CEO / ผู้บัญชาการสูงสุด</div>
        </div>
      </div>
      <div class="org-line"></div>
      <div class="org-tier">
        <div class="org-card org-card-staff" onclick="openModal('laura')">
          <img class="org-avatar" src="${laura.img}" alt="Laura" onerror="this.style.display='none'">
          <div class="org-name">Laura <span style="font-size:11px;color:var(--muted);font-weight:400">${laura.thai}</span></div>
          <div class="org-title">Chief of Staff — สำนักงาน CEO (ประสานงาน + ส่งต่อทุกสายงาน)</div>
        </div>
      </div>
      <div class="org-line"></div>
      <div class="org-divisions">
        ${ORG_CHART.divisions.map(d => `
          <div class="org-division">
            <div class="org-division-head">
              <div class="pipeline-dot ${d.dot}"></div>
              <div>
                <div class="org-division-name">${d.name}</div>
                <div class="org-division-sub">${d.sub}</div>
              </div>
            </div>
            <div class="pipeline-agents">
              ${d.agents.map(da => agentNode(da.id, da.title)).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── MODAL ──
let _modalActiveTab = 'prompt';
let _modalAgentId   = null;

function openModal(id) {
  const a = AGENTS.find(x => x.id === id);
  _modalAgentId = id;
  _modalActiveTab = 'prompt';
  document.getElementById('modal-portrait').src = a.img;
  document.getElementById('modal-portrait').alt = a.name;
  document.getElementById('modal-person-name').innerHTML = `${a.name}${a.thai ? ` <span>${a.thai}</span>` : ''}`;
  document.getElementById('modal-role').textContent = a.role;
  document.getElementById('modal-agent-id').value   = id;
  document.getElementById('comment-input').value    = '';
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('agent-book-modal').classList.add('open');
  document.getElementById('tab-prompt').style.display = 'inline-block';
  setModalTab('prompt');
}

function openCharModal(id) {
  if (id === 'jed') {
    _modalAgentId = 'jed';
    document.getElementById('modal-portrait').src = 'images/Jed.png';
    document.getElementById('modal-portrait').alt = JED.name;
    document.getElementById('modal-person-name').innerHTML = JED.name;
    document.getElementById('modal-role').textContent = JED.role;
    document.getElementById('modal-agent-id').value   = 'jed';
    document.getElementById('comment-input').value    = '';
    document.getElementById('modal-overlay').classList.add('open');
    document.getElementById('agent-book-modal').classList.add('open');
    document.getElementById('tab-prompt').style.display = 'none';
    setModalTab('character');
    return;
  }
  openModal(id);
  setModalTab('character');
}

function setModalTab(tab) {
  _modalActiveTab = tab;
  document.getElementById('tab-prompt').classList.toggle('active', tab === 'prompt');
  document.getElementById('tab-char').classList.toggle('active',   tab === 'character');
  document.getElementById('modal-body').textContent = 'กำลังโหลด...';

  const isJed = _modalAgentId === 'jed';
  document.getElementById('tab-prompt').style.display = isJed ? 'none' : 'inline-block';

  if (tab === 'prompt') {
    const a = AGENTS.find(x => x.id === _modalAgentId);
    if (!a) return;
    fetch(a.file).then(r => r.ok ? r.text() : Promise.reject(r.status)).then(t => {
      document.getElementById('modal-body').textContent = t;
    }).catch(() => {
      document.getElementById('modal-body').textContent = `ไม่พบไฟล์: ${a.file}`;
    });
  } else {
    const charFile = isJed ? JED.charFile : AGENTS.find(x => x.id === _modalAgentId)?.charFile;
    if (!charFile) return;
    fetch(charFile).then(r => r.ok ? r.text() : Promise.reject(r.status)).then(t => {
      document.getElementById('modal-body').textContent = t;
    }).catch(() => {
      document.getElementById('modal-body').textContent = `ไม่พบไฟล์: ${charFile}`;
    });
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('agent-book-modal').classList.remove('open');
  _modalAgentId = null;
}

function saveComment() {
  const text = document.getElementById('comment-input').value.trim();
  if (!text || _modalAgentId === 'jed') return;
  const a = AGENTS.find(x => x.id === _modalAgentId);
  comments.push({ source: a.name, text, time: new Date().toISOString() });
  localStorage.setItem('jed_comments', JSON.stringify(comments));
  closeModal();
  renderReviewBadge();
  alert(`บันทึก comment สำหรับ ${a.name} ✓`);
}

// ── UTILS ──
function fmt(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('th-TH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ═══════════════════════════════════════════════
//  DAILY BRIEFING
// ═══════════════════════════════════════════════
function getBriefingGreeting() {
  const h = new Date().getHours();
  if (h < 12) return '☀️ สวัสดีตอนเช้า Jed';
  if (h < 17) return '🌤 สวัสดีตอนบ่าย Jed';
  return '🌙 สวัสดีตอนเย็น Jed';
}

function renderBriefing() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('th-TH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // Update greeting & date
  const greetEl = document.getElementById('briefing-greeting');
  const dateEl  = document.getElementById('briefing-date');
  if (greetEl) greetEl.textContent = getBriefingGreeting();
  if (dateEl)  dateEl.textContent  = dateStr;

  const pending  = todos.filter(t => !t.done);
  const urgent   = pending.filter(t => t.priority === 'high');
  const activeP  = projects.filter(p => p.status === 'active');
  const lastDiary = diary.length ? diary[diary.length - 1] : null;
  const lastSession = sessions.length ? sessions[sessions.length - 1] : null;

  const html = `
    <div class="briefing-grid">

      <div class="briefing-card briefing-focus">
        <div class="briefing-card-title">🎯 Focus วันนี้</div>
        ${urgent.length
          ? urgent.slice(0,3).map(t => `<div class="briefing-item urgent">🔴 ${t.text}</div>`).join('')
          : '<div class="briefing-item muted">ไม่มีงานด่วน — วันนี้ Jed โล่งใจได้ ✨</div>'
        }
      </div>

      <div class="briefing-card">
        <div class="briefing-card-title">📋 Todo ทั้งหมด</div>
        <div class="briefing-stat">${pending.length} <span>งานที่รออยู่</span></div>
        <div class="briefing-item muted">เสร็จแล้ว ${todos.filter(t=>t.done).length} งาน</div>
      </div>

      <div class="briefing-card">
        <div class="briefing-card-title">📂 Projects Active</div>
        ${activeP.length
          ? activeP.slice(0,3).map(p=>`<div class="briefing-item">• ${p.name}</div>`).join('')
          : '<div class="briefing-item muted">ยังไม่มี project</div>'
        }
      </div>

      <div class="briefing-card">
        <div class="briefing-card-title">📖 Diary ล่าสุด</div>
        ${lastDiary
          ? `<div class="briefing-item muted">${lastDiary.date}</div>
             <div class="briefing-item">${lastDiary.content.slice(0,120)}${lastDiary.content.length>120?'…':''}</div>`
          : '<div class="briefing-item muted">ยังไม่มี diary</div>'
        }
      </div>

      <div class="briefing-card">
        <div class="briefing-card-title">📊 Session ล่าสุด</div>
        ${lastSession
          ? `<div class="briefing-item muted">${lastSession.date}</div>
             <div class="briefing-item">หมวดหลัก: <strong>${lastSession.topCategory || '—'}</strong></div>
             <div class="briefing-cats">${(lastSession.categories||[]).slice(0,3).map(c=>`<span class="cat-chip">${c.name} ${c.pct}%</span>`).join('')}</div>`
          : '<div class="briefing-item muted">ยังไม่มี session log</div>'
        }
      </div>

      <div class="briefing-card briefing-team">
        <div class="briefing-card-title">🤖 ทีม AI OS</div>
        <div class="briefing-agents">
          ${AGENTS.map(a=>`
            <div class="briefing-agent" onclick="openModal('${a.id}')">
              <img src="${a.img}" alt="${a.name}" onerror="this.style.display='none'">
              <span>${a.name}</span>
            </div>`).join('')}
        </div>
      </div>

      ${teamLogs.length ? `
      <div class="briefing-card" style="grid-column:1/-1">
        <div class="briefing-card-title">📋 Daily Briefing ล่าสุด — ${teamLogs[teamLogs.length-1].dateDisplay}</div>
        <div class="agent-logs-grid">
          ${teamLogs[teamLogs.length-1].agents.map(a => `
            <div class="agent-log-card" onclick="toggleLog('log-${a.id}')">
              <div class="agent-log-head">
                <span class="agent-log-emoji">${a.emoji}</span>
                <div>
                  <div class="agent-log-name">${a.name} <span class="agent-log-title">— ${a.title}</span></div>
                  <div class="agent-log-summary">${a.summary}</div>
                </div>
                <span class="agent-log-toggle">▸</span>
              </div>
              <div class="agent-log-body" id="log-${a.id}" style="display:none">
                <ul class="agent-log-highlights">
                  ${a.highlights.map(h=>`<li>${h}</li>`).join('')}
                </ul>
                <a class="agent-log-link" href="${a.url}" target="_blank">เปิดใน Notion →</a>
                <a class="agent-log-link" href="#" onclick="event.stopPropagation();event.preventDefault();navigate('diary');openDiaryBookByDate('${a.name.trim().toLowerCase()}','${teamLogs[teamLogs.length-1].date}')">📖 เปิดใน Diary →</a>
              </div>
            </div>`).join('')}
        </div>
      </div>` : ''}

    </div>`;

  const el = document.getElementById('briefing-content');
  if (el) el.innerHTML = html;

  // Home widget (compact)
  const homeEl = document.getElementById('home-briefing-content');
  if (homeEl) {
    homeEl.innerHTML = `
      <div class="briefing-home-inner">
        <div class="briefing-home-left">
          <div class="briefing-home-greeting">${getBriefingGreeting()}</div>
          <div class="briefing-home-date">${dateStr}</div>
          <div class="briefing-home-stats">
            <span>📋 ${pending.length} งาน</span>
            <span>📂 ${activeP.length} projects</span>
            <span>🤖 ${AGENTS.length} agents</span>
          </div>
        </div>
        <div class="briefing-home-right">
          ${urgent.length ? `<div class="briefing-urgent-label">🔴 งานด่วน</div>` : ''}
          ${urgent.slice(0,2).map(t=>`<div class="briefing-urgent-item">${t.text}</div>`).join('')}
          ${!urgent.length ? '<div class="briefing-no-urgent">วันนี้ไม่มีงานด่วน ✨</div>' : ''}
        </div>
      </div>`;
  }
}

function toggleLog(id) {
  const el = document.getElementById(id);
  const card = el.closest('.agent-log-card');
  const arrow = card.querySelector('.agent-log-toggle');
  const open = el.style.display === 'none';
  el.style.display = open ? 'block' : 'none';
  arrow.textContent = open ? '▾' : '▸';
}

// ── LOAD FROM FILES ──
// JSON files are the single source of truth.
// localStorage is used only to cache UI-only data (todos, comments).
async function loadFromFiles() {
  // Fire ALL fetches at once — diary (13 files) + main files + team_logs + todos
  const diaryFetches = PEOPLE.map(p =>
    fetch(`${BASE}/output/diary_people/${p.id}.json`, { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : []).catch(() => [])
      .then(data => ({ id: p.id, writable: p.writable, data: Array.isArray(data) ? data : [] }))
  );

  const mainFetches = [
    fetch(`${BASE}/output/projects.json`,    { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`${BASE}/output/activity.json`,    { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`${BASE}/output/session_log.json`, { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`${BASE}/output/knowledge.json`,   { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`${BASE}/output/team_logs.json`,   { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`${BASE}/output/todos.json`,           { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`${BASE}/output/scheduled_tasks_log.json`, { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`${BASE}/output/glossary.json`,    { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
  ];

  // Wait for everything in parallel
  const [diaryResults, [proj, act, sess, know, tl, fileTodos, stLog, gloss]] = await Promise.all([
    Promise.all(diaryFetches),
    Promise.all(mainFetches),
  ]);

  // Apply diary results
  diaryResults.forEach(({ id, writable, data }) => {
    let entries = data;
    if (writable) {
      try {
        const local = JSON.parse(localStorage.getItem(`jed_diary_${id}`) || '[]');
        local.forEach(item => {
          if (!entries.find(e => e.date === item.date && e.content === item.content)) entries.push(item);
        });
      } catch (_) {}
    }
    diaryByPerson[id] = entries;
  });
  diary = diaryByPerson['sage'] || [];

  // Apply main results
  if (Array.isArray(proj))  projects  = proj;
  if (Array.isArray(act))   activity  = act;
  if (Array.isArray(sess))  sessions  = sess;
  if (Array.isArray(know))  knowledge = know;
  if (Array.isArray(tl))    teamLogs  = tl;
  if (Array.isArray(stLog)) scheduledTasksLog = stLog;
  if (Array.isArray(gloss)) glossary = gloss;

  // Todos: merge file (agent-written) + localStorage (UI edits)
  const localTodos = JSON.parse(localStorage.getItem('jed_todos') || '[]');
  if (Array.isArray(fileTodos)) {
    const localById = new Map(localTodos.map(t => [t.id, t]));
    const merged = fileTodos.map(f => localById.get(f.id) || f);
    localTodos.forEach(item => { if (!merged.find(f => f.id === item.id)) merged.push(item); });
    todos = merged;
  } else {
    todos = localTodos;
  }
}

// ── SCHEDULED TASKS WIDGET ──
function renderScheduledTasksWidget() {
  const el = document.getElementById('home-scheduled-tasks');
  if (!el) return;
  if (!scheduledTasksLog.length) {
    el.innerHTML = `<div class="widget-empty">ไม่มีข้อมูล scheduled tasks</div>`;
    return;
  }
  el.innerHTML = scheduledTasksLog.map(t => {
    const statusColor = t.lastRunStatus === 'success' ? '#4caf50' : t.lastRunStatus === 'error' ? '#f44336' : '#888';
    const statusLabel = t.lastRunStatus === 'success' ? '✅ สำเร็จ' : t.lastRunStatus === 'error' ? '❌ ผิดพลาด' : '⏳ รอรัน';
    let timeAgo = '';
    if (t.lastRunAt) {
      const diff = Math.round((Date.now() - new Date(t.lastRunAt)) / 60000);
      timeAgo = diff < 60 ? `${diff} นาทีที่แล้ว` : diff < 1440 ? `${Math.round(diff/60)} ชม.ที่แล้ว` : `${Math.round(diff/1440)} วันที่แล้ว`;
    }
    return `<div class="widget-row" style="flex-direction:column;align-items:flex-start;gap:2px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
      <div style="display:flex;align-items:center;gap:6px;width:100%">
        <span>${t.emoji}</span>
        <span style="font-weight:600;font-size:0.85rem;flex:1">${t.name}</span>
        <span style="font-size:0.75rem;color:${statusColor}">${statusLabel}</span>
      </div>
      <div style="font-size:0.75rem;color:var(--muted);padding-left:22px">${t.schedule}${timeAgo ? ` · รันล่าสุด ${timeAgo}` : ''}</div>
      ${t.lastRunNote ? `<div style="font-size:0.72rem;color:var(--muted);padding-left:22px;opacity:0.7">${t.lastRunNote}</div>` : ''}
    </div>`;
  }).join('');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
  await loadFromFiles();
  renderAgents();
  renderPipeline();
  renderDiary();
  renderProjects();
  renderActivity();
  renderReview();
  renderTodos();
  renderKnowledge();
  renderGlossary();
  renderTodoBadge();
  renderBriefing();
  renderHome();
  renderScheduledTasksWidget();
  navigate('home');
});
