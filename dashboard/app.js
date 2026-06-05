// ═══════════════════════════════════════════════
//  Jed's AI OS — Dashboard App
// ═══════════════════════════════════════════════

// ── AGENTS ──
const AGENTS = [
  { id:'laura',   name:'Laura',   thai:'ลอร่า',   gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'🎭', img:'/dashboard/images/Laura.png',   role:'Main Orchestrator',       desc:'รับทุก input ตัดสินใจ delegate ไปยัง agent ที่เหมาะสม', file:'/team/laura.md',        charFile:'/characters/laura.md'   },
  { id:'muse',    name:'Muse',    thai:'มิ้วส์',  gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'💡', img:'/dashboard/images/Muse.png',    role:'Idea & Content',           desc:'รับ idea ดิบ → Idea Card + content draft พร้อม hook',    file:'/team/idea.md',          charFile:'/characters/muse.md'    },
  { id:'atlas',   name:'Atlas',   thai:'แอตลาส',  gender:'ชาย',  ending:'ครับ', model:'opus',   emoji:'🎯', img:'/dashboard/images/Atlas.png',   role:'CEO Coach & Strategist',   desc:'Mentor CEO mindset พูดตรง ท้าทาย assumptions ไม่ประจบ',  file:'/team/ceo_coach.md',    charFile:'/characters/atlas.md'   },
  { id:'nova',    name:'Nova',    thai:'โนว่า',   gender:'หญิง', ending:'ค่ะ',  model:'haiku',  emoji:'🌿', img:'/dashboard/images/Nova.png',    role:'Life & Health Manager',     desc:'ตาราง todo สุขภาพ habit tracking และ calendar',          file:'/team/life.md',          charFile:'/characters/nova.md'    },
  { id:'scout',   name:'Scout',   thai:'สเกาท์',  gender:'ชาย',  ending:'ครับ', model:'sonnet', emoji:'🔍', img:'/dashboard/images/Scout.png',   role:'Research & Analysis',       desc:'ค้นคว้าเชิงลึก สรุปข้อมูล วิเคราะห์ trend และ insight',  file:'/team/research.md',     charFile:'/characters/scout.md'   },
  { id:'council', name:'Council', thai:'เคาน์ซิล',gender:'ชาย',  ending:'ครับ', model:'opus',   emoji:'⚖️', img:'/dashboard/images/Council.png', role:'Decision Chamber',          desc:'วิเคราะห์การตัดสินใจสำคัญ 3 มุมมอง',                    file:'/team/council.md',      charFile:'/characters/council.md' },
  { id:'forge',   name:'Forge',   thai:'ฟอร์จ',   gender:'ชาย',  ending:'ครับ', model:'sonnet', emoji:'⚙️', img:'/dashboard/images/Forge.png',   role:'Code & Dev Agent',          desc:'เขียนโค้ด แก้ bug พัฒนาโปรแกรม script และ tool',         file:'/team/forge.md',        charFile:'/characters/forge.md'   },
  { id:'mint',    name:'Mint',    thai:'มิ้นท์',  gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'💰', img:'/dashboard/images/Mint.png',    role:'Finance & Investment',       desc:'เงิน budget P&L วิเคราะห์การลงทุน financial planning',   file:'/team/finance.md',      charFile:'/characters/mint.md'    },
  { id:'sage',    name:'Sage',    thai:'เซจ',     gender:'ชาย',  ending:'ครับ', model:'haiku',  emoji:'📝', img:'/dashboard/images/Sage.png',    role:'Memory & Diary Agent',       desc:'บันทึก diary สรุปวัน จำ context สำคัญ log ความทรงจำ',   file:'/team/memory_agent.md', charFile:'/characters/sage.md'    },
  { id:'vera',    name:'Vera',    thai:'เวร่า',   gender:'หญิง', ending:'ค่ะ',  model:'sonnet', emoji:'🔎', img:'/dashboard/images/vera.png',    role:'QA & Skill Developer',       desc:'ตรวจสอบ output ของทีม วิเคราะห์ skill gap พัฒนาทีม',    file:'/team/qa.md',           charFile:'/characters/vera.md'    },
];

const JED = {
  id:'jed', name:'Jed', emoji:'🪖', role:'Guild Master / Commander',
  desc:'ทหารอากาศไทย เหล่าทหารแพทย์ | ผู้บัญชาการสูงสุดของทีม AI',
  charFile:'/characters/jed.md'
};

const PIPELINE = [
  { label:'orchestration',     dot:'dot-green', title:'Orchestrator',      sub:'routes every task',          agents:['laura']         },
  { label:'content · pipeline',dot:'dot-gold',  title:'Ideas & Content',   sub:'idea → draft → publish',     agents:['muse','scout']  },
  { label:'strategy · pipeline',dot:'dot-green',title:'Strategy & Life',   sub:'CEO mindset + daily ops',    agents:['atlas','nova']  },
  { label:'finance · pipeline', dot:'dot-gold',  title:'Finance & Dev',    sub:'money + code',               agents:['mint','forge']  },
  { label:'memory · pipeline',  dot:'dot-green', title:'Memory & Decision',sub:'diary + big decisions',      agents:['sage','council']},
  { label:'qa · pipeline',      dot:'dot-green', title:'QA & Skill Dev',   sub:'review + optimize team',     agents:['vera']          },
];

// ── DATA STORES ──
let comments  = JSON.parse(localStorage.getItem('jed_comments')  || '[]');
let projects  = JSON.parse(localStorage.getItem('jed_projects')  || '[]');
let activity  = JSON.parse(localStorage.getItem('jed_activity')  || '[]');
let diary     = JSON.parse(localStorage.getItem('jed_diary')     || '[]');
let todos     = JSON.parse(localStorage.getItem('jed_todos')     || '[]');
let knowledge = JSON.parse(localStorage.getItem('jed_knowledge') || '[]');
let sessions  = JSON.parse(localStorage.getItem('jed_sessions')  || '[]');
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
    const res = await fetch('/output/session_log.json');
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

function renderSessionLog() {
  const summaryEl = document.getElementById('session-summary');
  const listEl    = document.getElementById('session-list');

  if (!sessions.length) {
    summaryEl.innerHTML = `<div class="empty"><div class="empty-icon">📊</div><p>ยังไม่มี session log<br>จะมีข้อมูลหลังจบการสนทนา</p></div>`;
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

  // Session list (newest first)
  listEl.innerHTML = [...sessions].reverse().map(s => `
    <div class="session-card">
      <div class="session-card-head">
        <div class="session-date">${s.date}</div>
        <div class="session-top-cat">${s.topCategory || '—'}</div>
      </div>
      <div class="session-cats">
        ${(s.categories || []).slice(0, 5).map(c => `
          <span class="cat-chip">${c.name} <strong>${c.pct}%</strong></span>`).join('')}
      </div>
      ${s.tasks && s.tasks.length ? `
        <div class="session-tasks">
          <div class="session-tasks-label">Tasks ที่พบ:</div>
          ${s.tasks.slice(0, 3).map(t => `<div class="session-task-item">• ${t}</div>`).join('')}
        </div>` : ''}
    </div>`).join('');
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

function toggleKnowledgeForm() {
  document.getElementById('knowledge-add-form').classList.toggle('open');
  document.getElementById('k-title').focus();
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
    date:   new Date().toISOString()
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
  renderKnowledge();
}

function renderKnowledge() {
  const topics = ['all', ...new Set(knowledge.map(k => k.topic))];
  document.getElementById('knowledge-filter-row').innerHTML = topics.map(t => `
    <button class="filter-btn ${knowledgeFilter === t ? 'active' : ''}" onclick="setKnowledgeFilter('${t}')">
      ${t === 'all' ? '📚 ทั้งหมด' : t}
    </button>`).join('');

  const filtered = knowledgeFilter === 'all' ? knowledge : knowledge.filter(k => k.topic === knowledgeFilter);
  const el = document.getElementById('knowledge-list');

  if (!filtered.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">🧠</div><p>ยังไม่มีความรู้บันทึก<br>กด "+ เพิ่ม" เพื่อบันทึกสิ่งที่เรียนรู้</p></div>`;
    return;
  }

  el.innerHTML = [...filtered].reverse().map(k => `
    <div class="knowledge-card">
      <div class="knowledge-head">
        <div class="knowledge-title">${k.title}</div>
        <button class="btn-icon" onclick="deleteKnowledge(${k.id})">🗑</button>
      </div>
      <div class="knowledge-meta">
        <span class="k-source">${k.source}</span>
        <span class="k-topic">${k.topic}</span>
        <span class="k-date">${fmt(k.date)}</span>
      </div>
      ${k.content ? `<div class="knowledge-content">${k.content}</div>` : ''}
      ${k.url ? `<a class="knowledge-link" href="${k.url}" target="_blank">🔗 เปิด Link</a>` : ''}
    </div>`).join('');

  document.getElementById('stat-knowledge').textContent = knowledge.length;
}

function setKnowledgeFilter(topic) {
  knowledgeFilter = topic;
  renderKnowledge();
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
  el.innerHTML = [...projects].reverse().map(p => `
    <div class="project-row">
      <div class="project-name">${p.name}</div>
      <span class="st-badge st-${p.status}">${{active:'Active',pending:'Pending',done:'Done'}[p.status]}</span>
      <span class="project-date">${fmt(p.updated)}</span>
    </div>`).join('');
}

function addProject() {
  const name   = document.getElementById('new-proj-name').value.trim();
  const status = document.getElementById('new-proj-status').value;
  if (!name) return;
  projects.push({ name, status, updated: new Date().toISOString() });
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
        <img src="/dashboard/images/Jed.png" alt="Jed" onerror="this.src=''">
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
  document.getElementById('pipeline-content').innerHTML = PIPELINE.map(p => `
    <div class="pipeline-box">
      <div class="pipeline-header">
        <span class="pipeline-tag">${p.label}</span>
        <div class="pipeline-dot ${p.dot}"></div>
        <div><div class="pipeline-h-title">${p.title}</div><div class="pipeline-h-sub">${p.sub}</div></div>
      </div>
      <div class="pipeline-agents">
        ${p.agents.map(id => {
          const a = AGENTS.find(x => x.id === id);
          if (!a) return '';
          return `<div class="p-agent" onclick="openModal('${a.id}')">
            <div class="p-avatar-img">
              <img src="${a.img}" alt="${a.name}" onerror="this.style.display='none'">
            </div>
            <div>
              <div class="p-name">${a.name} <span style="font-size:11px;color:var(--muted);font-weight:400">${a.thai}</span></div>
              <div class="p-role">${a.role}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`).join('');
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
async function loadFromFiles() {
  const loads = [
    { url: '/output/diary.json',        key: 'jed_diary',     ref: () => diary,     set: v => { diary = v; }     },
    { url: '/output/projects.json',     key: 'jed_projects',  ref: () => projects,  set: v => { projects = v; }  },
    { url: '/output/activity.json',     key: 'jed_activity',  ref: () => activity,  set: v => { activity = v; }  },
    { url: '/output/session_log.json',  key: 'jed_sessions',  ref: () => sessions,  set: v => { sessions = v; }  },
  ];
  // Load team logs separately (not merged with localStorage)
  try {
    const r = await fetch('/output/team_logs.json', { cache: 'no-cache' });
    if (r.ok) teamLogs = await r.json();
  } catch (_) {}
  await Promise.all(loads.map(async ({ url, key, ref, set }) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;
      // Merge: file entries take priority, deduplicate by content+date
      const local = ref();
      const merged = [...data];
      local.forEach(item => {
        const exists = merged.some(f =>
          JSON.stringify(f) === JSON.stringify(item) ||
          (f.date && f.date === item.date && f.content === item.content)
        );
        if (!exists) merged.push(item);
      });
      set(merged);
      localStorage.setItem(key, JSON.stringify(merged));
    } catch (_) {}
  }));
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
