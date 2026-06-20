<script lang="ts">
	import { knowledgeStore } from '$lib/stores/knowledge';
	import { projectsStore } from '$lib/stores/projects';
	import { todosStore } from '$lib/stores/todos';
	import { sessionLogStore } from '$lib/stores/sessionLog';
	import { activityStore } from '$lib/stores/activity';
	import { diaryByPerson } from '$lib/stores/diary';
	import { fmt } from '$lib/utils/format';

	const { data: todosData } = todosStore;
	const { data: projectsData } = projectsStore;
	const { data: knowledgeData } = knowledgeStore;
	const { data: sessionLogData } = sessionLogStore;
	const { data: activityData } = activityStore;

	const pendingTodos = $derived($todosData.filter((t) => !t.done));
	const jedDiary = $derived($diaryByPerson['jed'] ?? []);
	const lastDiary = $derived(jedDiary.length ? jedDiary[jedDiary.length - 1] : null);
	const lastSessions = $derived([...$sessionLogData].slice(-5).reverse());
	const recentActivity = $derived([...$activityData].slice(0, 5));
	const recentKnowledge = $derived([...$knowledgeData].slice(-5).reverse());
</script>

<div class="hero">
	<div class="hero-eyebrow">Personal Command Center</div>
	<h1 class="hero-title">Even a guild master needs a <em>party</em>.</h1>
</div>

<div class="stats-row">
	<div class="stat-card">
		<div class="stat-value">{pendingTodos.length}</div>
		<div class="stat-label">Todo ค้างอยู่</div>
	</div>
	<div class="stat-card">
		<div class="stat-value">{$projectsData.length}</div>
		<div class="stat-label">Projects</div>
	</div>
	<div class="stat-card">
		<div class="stat-value">{$knowledgeData.length}</div>
		<div class="stat-label">Knowledge</div>
	</div>
	<div class="stat-card">
		<div class="stat-value">{$sessionLogData.length}</div>
		<div class="stat-label">Sessions</div>
	</div>
</div>

<div class="page-body" style="padding-top:0">
	<div class="home-grid">
		<div class="widget">
			<div class="widget-head"><div class="widget-title">📋 Todo</div></div>
			<div class="widget-list">
				{#each pendingTodos.slice(0, 5) as t (t.id)}
					<a class="widget-row" href="/todo">
						<span class="widget-text">{t.text}</span>
					</a>
				{:else}
					<div class="widget-empty">ไม่มีงานค้าง 🎉</div>
				{/each}
			</div>
		</div>

		<div class="widget">
			<div class="widget-head"><div class="widget-title">📁 Projects Active</div></div>
			<div class="widget-list">
				{#each $projectsData.filter((p) => p.status === 'active').slice(0, 5) as p (p.id)}
					<a class="widget-row" href="/projects">
						<span class="widget-text">{p.name}</span>
						<span class="widget-meta">{p.progress}%</span>
					</a>
				{:else}
					<div class="widget-empty">ยังไม่มี project active</div>
				{/each}
			</div>
		</div>

		<div class="widget">
			<div class="widget-head"><div class="widget-title">📚 Knowledge ล่าสุด</div></div>
			<div class="widget-list">
				{#each recentKnowledge as k (k.id)}
					<a class="widget-row" href="/knowledge">
						<span class="widget-text">{k.title}</span>
						<span class="widget-source">{k.topic}</span>
					</a>
				{:else}
					<div class="widget-empty">ยังไม่มีความรู้สะสม</div>
				{/each}
			</div>
		</div>

		<div class="widget">
			<div class="widget-head"><div class="widget-title">🗒️ Session ล่าสุด</div></div>
			<div class="widget-list">
				{#each lastSessions as s (s.id)}
					<a class="widget-row" href="/session">
						<span class="widget-text">{s.topCategory}</span>
						<span class="widget-meta">{s.date}</span>
					</a>
				{:else}
					<div class="widget-empty">ยังไม่มี session log</div>
				{/each}
			</div>
		</div>

		<div class="widget">
			<div class="widget-head"><div class="widget-title">📖 Diary ล่าสุด</div></div>
			<div class="widget-list">
				{#if lastDiary}
					<a class="widget-row" href="/diary">
						<span class="widget-text">{lastDiary.content.slice(0, 80)}{lastDiary.content.length > 80 ? '…' : ''}</span>
						<span class="widget-meta">{lastDiary.date}</span>
					</a>
				{:else}
					<div class="widget-empty">ยังไม่มี diary</div>
				{/if}
			</div>
		</div>

		<div class="widget">
			<div class="widget-head"><div class="widget-title">⚡ Activity ล่าสุด</div></div>
			<div class="widget-list">
				{#each recentActivity as a, i (a.time + i)}
					<a class="widget-row" href="/activity">
						<span class="widget-text">{a.agent}: {a.action}</span>
						<span class="widget-meta">{fmt(a.time)}</span>
					</a>
				{:else}
					<div class="widget-empty">ยังไม่มี activity</div>
				{/each}
			</div>
		</div>

		<div class="widget">
			<div class="widget-head"><div class="widget-title">☀️ Daily Briefing</div></div>
			<div class="widget-list">
				<a class="widget-row" href="/briefing">
					<span class="widget-text">ดู briefing วันนี้ของทีม →</span>
				</a>
			</div>
		</div>
	</div>
</div>
