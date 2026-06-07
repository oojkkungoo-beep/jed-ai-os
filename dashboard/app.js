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
  { id:'laura',   name:'Laura',   thai:'ลอร่า',   gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'🎭', img:'images/Laura.png',   role:'Main Orchestrator',       desc:'รับทุก input ตัดสินใจ delegate ไปยัง agent ที่เหมาะสม', file:'/team/laura.md',        charFile:'/characters/laura.md'   },
  { id:'muse',    name:'Muse',    thai:'มิ้วส์',  gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'💡', img:'images/Muse.png',    role:'Idea & Content',           desc:'รับ idea ดิบ → Idea Card + content draft พร้อม hook',    file:'/team/idea.md',          charFile:'/characters/muse.md'    },
  { id:'atlas',   name:'Atlas',   thai:'แอตลาส',  gender:'ชาย',  ending:'ครับ', model:'opus',   emoji:'🎯', img:'images/Atlas.png',   role:'CEO Coach & Strategist',   desc:'Mentor CEO mindset พูดตรง ท้าทาย assumptions ไม่ประจบ',  file:'/team/ceo_coach.md',    charFile:'/characters/atlas.md'   },
  { id:'nova',    name:'Nova',    thai:'โนว่า',   gender:'หญิง', ending:'ค่ะ',  model:'haiku',  emoji:'🌿', img:'images/Nova.png',    role:'Life & Health Manager',     desc:'ตาราง todo สุขภาพ habit tracking และ calendar',          file:'/team/life.md',          charFile:'/characters/nova.md'    },
  { id:'scout',   name:'Scout',   thai:'สเกาท์',  gender:'ชาย',  ending:'ครับ', model:'sonnet', emoji:'🔍', img:'images/Scout.png',   role:'Research & Analysis',       desc:'ค้นคว้าเชิงลึก สรุปข้อมูล วิเคราะห์ trend และ insight',  file:'/team/research.md',     charFile:'/characters/scout.md'   },
  { id:'council', name:'Council', thai:'เคาน์ซิล',gender:'ชาย',  ending:'ครับ', model:'opus',   emoji:'⚖️', img:'images/Council.png', role:'Decision Chamber',          desc:'วิเคราะห์การตัดสินใจสำคัญ 3 มุมมอง',                    file:'/team/council.md',      charFile:'/characters/council.md' },
  { id:'forge',   name:'Forge',   thai:'ฟอร์จ',   gender:'ชาย',  ending:'ครับ', model:'sonnet', emoji:'⚙️', img:'images/Forge.png',   role:'Code & Dev Agent',          desc:'เขียนโค้ด แก้ bug พัฒนาโปรแกรม script และ tool',         file:'/team/forge.md',        charFile:'/characters/forge.md'   },
  { id:'mint',    name:'Mint',    thai:'มิ้นท์',  gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'💰', img:'images/Mint.png',    role:'Finance & Investment',       desc:'เงิน budget P&L วิเคราะห์การลงทุน financial planning',   file:'/team/finance.md',      charFile:'/characters/mint.md'    },
  { id:'sage',    name:'Sage',    thai:'เซจ',     gender:'ชาย',  ending:'ครับ', model:'haiku',  emoji:'📝', img:'images/Sage.png',    role:'Memory & Diary Agent',       desc:'บันทึก diary สรุปวัน จำ context สำคัญ log ความทรงจำ',   file:'/team/memory_agent.md', charFile:'/characters/sage.md'    },
  { id:'vera',    name:'Vera',    thai:'เวร่า',   gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'🔎', img:'images/vera.png',    role:'QA & Skill Developer',       desc:'ตรวจสอบ output ของทีม วิเคราะห์ skill gap พัฒนาทีม',    file:'/team/qa.md',           charFile:'/characters/vera.md'    },
];

const JED = {
  id:'jed', name:'Jed', emoji:'🪖', role:'Guild Master / Commander',
  desc:'ทหารอากาศไทย เหล่าทหารแพทย์ | ผู้บัญชาการสูงสุดของทีม AI',
  charFile:'/characters/jed.md'
};

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
        { id: 'nova', title: 'Chief Operating Officer — Life (COO) — ตาราง สุขภาพ habit ประจำวัน' },
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
        { id: 'vera', title: 'Head of QA & Talent Development — ตรวจคุณภาพ พัฒนา skill ทีม' },
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
let sessions  = [];
let teamLogs  = [];

// ── NAVIGATE ──
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  if (page === 'session')  loadSessionLog();
  if (page === 'home')     renderHome();
  if (page === 'briefing') renderBriefing();
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
          <div class="widget-text">หมวดหลัก: <strong>${s.topCategory || '—'}</strong></div>
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

function toggleTodoForm() {
  document.getElementById('todo-add-form').classList.toggle('open');
  document.getElementById('todo-text').focus();
}

function addTodo() {
  const text = document.getElementById('todo-text').value.trim();
  if (!text) return;
  const cat      = document.getElementById('todo-cat').value;
  const priority = document.getElementById('todo-priority').value;
  todos.push({
    id: Date.now(),
    text,
    category: cat,
    priority,
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
  // Build filter tabs
  const cats = ['all', ...new Set(todos.map(t => t.category))];
  document.getElementById('todo-filter-row').innerHTML = cats.map(c => `
    <button class="filter-btn ${todoFilter === c ? 'active' : ''}" onclick="setTodoFilter('${c}')">
      ${c === 'all' ? '📋 ทั้งหมด' : c}
    </button>`).join('');

  const filtered = todoFilter === 'all' ? todos : todos.filter(t => t.category === todoFilter);
  const pending  = filtered.filter(t => !t.done);
  const done     = filtered.filter(t => t.done);
  const el = document.getElementById('todo-list');

  if (!filtered.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">✅</div><p>ไม่มีงาน</p></div>`;
    return;
  }

  const renderItems = (items) => items.map(t => `
    <div class="todo-item ${t.done ? 'done' : ''}">
      <div class="todo-check" onclick="toggleTodo(${t.id})">
        ${t.done ? '✅' : '<span class="check-circle"></span>'}
      </div>
      <div class="todo-body">
        <div class="todo-text">${t.text}</div>
        <div class="todo-meta">
          <span class="priority-tag p-${t.priority}">${{high:'🔴 สำคัญ',medium:'🟡 ปานกลาง',low:'🟢 เบา'}[t.priority]}</span>
          <span class="todo-cat">${t.category}</span>
          <span class="todo-date">${fmt(t.created)}</span>
        </div>
      </div>
      <div class="todo-actions">
        <button class="btn-icon" onclick="deleteTodo(${t.id})">🗑</button>
      </div>
    </div>`).join('');

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

function clearDoneTodos() {
  todos = todos.filter(t => !t.done);
  saveTodos();
  renderTodos();
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
        <div class="session-top-cat">${s.topCategory || '—'}</div>
      </div>
      ${s.tags && s.tags.length ? `
        <div class="session-cats">
          ${s.tags.map(t => `<span class="cat-chip">${t}</span>`).join('')}
        </div>` : ''}
      ${s.summary ? `<div class="session-summary-text">${s.summary}</div>` : ''}
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
    <h2 class="k-detail-title">${s.topCategory || ''}</h2>
    ${s.summary ? `<div class="k-detail-content" style="font-style:italic;color:var(--muted)">${s.summary}</div>` : ''}
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
//  DIARY
// ═══════════════════════════════════════════════
function renderDiary() {
  const el = document.getElementById('diary-list');
  if (!diary.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📖</div><p>ยังไม่มี diary<br>บันทึกสิ่งที่ทำวันนี้ได้เลย</p></div>`;
    return;
  }
  el.innerHTML = [...diary].reverse().map(d => `
    <div class="diary-card">
      <div class="diary-date">${d.date}</div>
      <div class="diary-content">${d.content}</div>
    </div>`).join('');
}

function writeDiary() {
  const content = document.getElementById('diary-input').value.trim();
  if (!content) return;
  const today = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric', weekday:'long' });
  diary.push({ date: today, content });
  localStorage.setItem('jed_diary', JSON.stringify(diary));
  document.getElementById('diary-input').value = '';
  renderDiary();
  logActivity('Sage', 'บันทึก diary ประจำวัน');
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
  document.getElementById('modal-name').textContent = a.name;
  document.getElementById('modal-role').textContent = a.role;
  document.getElementById('modal-agent-id').value   = id;
  document.getElementById('comment-input').value    = '';
  document.getElementById('modal-overlay').classList.add('open');
  setModalTab('prompt');
}

function openCharModal(id) {
  if (id === 'jed') {
    _modalAgentId = 'jed';
    document.getElementById('modal-name').textContent = JED.name;
    document.getElementById('modal-role').textContent = JED.role;
    document.getElementById('modal-agent-id').value   = 'jed';
    document.getElementById('comment-input').value    = '';
    document.getElementById('modal-overlay').classList.add('open');
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
        <div class="briefing-card-title">📋 Agent Daily Logs — ${teamLogs[teamLogs.length-1].dateDisplay}</div>
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
  // Files written by agents — always authoritative
  const fileSources = [
    { url: `${BASE}/output/diary.json`,        set: v => { diary = v; }      },
    { url: `${BASE}/output/projects.json`,     set: v => { projects = v; }   },
    { url: `${BASE}/output/activity.json`,     set: v => { activity = v; }   },
    { url: `${BASE}/output/session_log.json`,  set: v => { sessions = v; }   },
    { url: `${BASE}/output/knowledge.json`,    set: v => { knowledge = v; }  },
  ];

  // Team logs (no-cache because agents update often)
  try {
    const r = await fetch(`${BASE}/output/team_logs.json`, { cache: 'no-cache' });
    if (r.ok) teamLogs = await r.json();
  } catch (_) {}

  // Load all agent-written files in parallel
  await Promise.all(fileSources.map(async ({ url, set }) => {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) set(data);
    } catch (_) {}
  }));

  // Todos: merge JSON file (agent-written) + localStorage (UI-added)
  try {
    const res = await fetch(`${BASE}/output/todos.json`, { cache: 'no-cache' });
    if (res.ok) {
      const fileTodos = await res.json();
      const localTodos = JSON.parse(localStorage.getItem('jed_todos') || '[]');
      // Merge: file first, then local items not already in file
      const merged = [...fileTodos];
      localTodos.forEach(item => {
        if (!merged.find(f => f.id === item.id)) merged.push(item);
      });
      todos = merged;
    } else {
      todos = JSON.parse(localStorage.getItem('jed_todos') || '[]');
    }
  } catch (_) {
    todos = JSON.parse(localStorage.getItem('jed_todos') || '[]');
  }
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
  renderTodoBadge();
  renderBriefing();
  renderHome();
  navigate('home');
});
