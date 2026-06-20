<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { todosStore } from '$lib/stores/todos';
	import { projectsStore } from '$lib/stores/projects';
	import { diaryByPerson } from '$lib/stores/diary';
	import { sessionLogStore } from '$lib/stores/sessionLog';
	import { teamLogsStore } from '$lib/stores/teamLogs';
	import { AGENTS } from '$lib/types/agent';

	function greeting() {
		const h = new Date().getHours();
		if (h < 12) return '☀️ สวัสดีตอนเช้า Jed';
		if (h < 17) return '🌤 สวัสดีตอนบ่าย Jed';
		return '🌙 สวัสดีตอนเย็น Jed';
	}
	const dateStr = new Date().toLocaleDateString('th-TH', {
		weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
	});

	const { data: todosData } = todosStore;
	const { data: projectsData } = projectsStore;
	const { data: sessionLogData } = sessionLogStore;
	const { data: teamLogsData } = teamLogsStore;

	const pending = $derived($todosData.filter((t) => !t.done));
	const urgent = $derived(pending.filter((t) => t.priority === 'high'));
	const activeProjects = $derived($projectsData.filter((p) => p.status === 'active'));
	const jedDiary = $derived($diaryByPerson['jed'] ?? []);
	const lastDiary = $derived(jedDiary.length ? jedDiary[jedDiary.length - 1] : null);
	const lastSession = $derived(
		$sessionLogData.length ? $sessionLogData[$sessionLogData.length - 1] : null
	);
	const lastTeamLog = $derived(
		$teamLogsData.length ? $teamLogsData[$teamLogsData.length - 1] : null
	);

	let openLogs = $state<Set<string>>(new Set());
	function toggleLog(id: string) {
		const next = new Set(openLogs);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		openLogs = next;
	}
</script>

<PageHeader title={greeting()} subtitle={dateStr} />

<div class="briefing-grid">
	<div class="briefing-card briefing-focus">
		<div class="briefing-card-title">🎯 Focus วันนี้</div>
		{#if urgent.length}
			{#each urgent.slice(0, 3) as t (t.id)}
				<div class="briefing-item urgent">🔴 {t.text}</div>
			{/each}
		{:else}
			<div class="briefing-item muted">ไม่มีงานด่วน — วันนี้ Jed โล่งใจได้ ✨</div>
		{/if}
	</div>

	<div class="briefing-card">
		<div class="briefing-card-title">📋 Todo ทั้งหมด</div>
		<div class="briefing-stat">{pending.length} <span>งานที่รออยู่</span></div>
		<div class="briefing-item muted">เสร็จแล้ว {$todosData.filter((t) => t.done).length} งาน</div>
	</div>

	<div class="briefing-card">
		<div class="briefing-card-title">📂 Projects Active</div>
		{#if activeProjects.length}
			{#each activeProjects.slice(0, 3) as p (p.id)}
				<div class="briefing-item">• {p.name}</div>
			{/each}
		{:else}
			<div class="briefing-item muted">ยังไม่มี project</div>
		{/if}
	</div>

	<div class="briefing-card">
		<div class="briefing-card-title">📖 Diary ล่าสุด</div>
		{#if lastDiary}
			<div class="briefing-item muted">{lastDiary.date}</div>
			<div class="briefing-item">{lastDiary.content.slice(0, 120)}{lastDiary.content.length > 120 ? '…' : ''}</div>
		{:else}
			<div class="briefing-item muted">ยังไม่มี diary</div>
		{/if}
	</div>

	<div class="briefing-card">
		<div class="briefing-card-title">📊 Session ล่าสุด</div>
		{#if lastSession}
			<div class="briefing-item muted">{lastSession.date}</div>
			<div class="briefing-item">หมวดหลัก: <strong>{lastSession.topCategory || '—'}</strong></div>
			<div class="briefing-cats">
				{#each (lastSession.categories ?? []).slice(0, 3) as c (c.name)}
					<span class="cat-chip">{c.name} {c.pct}%</span>
				{/each}
			</div>
		{:else}
			<div class="briefing-item muted">ยังไม่มี session log</div>
		{/if}
	</div>

	<div class="briefing-card briefing-team">
		<div class="briefing-card-title">🤖 ทีม AI OS</div>
		<div class="briefing-agents">
			{#each AGENTS as a (a.id)}
				<a class="briefing-agent" href="/team">
					<img src={a.image} alt={a.name} />
					<span>{a.name}</span>
				</a>
			{/each}
		</div>
	</div>

	{#if lastTeamLog}
		<div class="briefing-card" style="grid-column:1/-1">
			<div class="briefing-card-title">📋 Daily Briefing ล่าสุด — {lastTeamLog.dateDisplay}</div>
			<div class="agent-logs-grid">
				{#each lastTeamLog.agents as a (a.id)}
					<div class="agent-log-card" onclick={() => toggleLog(a.id)}>
						<div class="agent-log-head">
							<span class="agent-log-emoji">{a.emoji}</span>
							<div>
								<div class="agent-log-name">{a.name} <span class="agent-log-title">— {a.title}</span></div>
								<div class="agent-log-summary">{a.summary}</div>
							</div>
							<span class="agent-log-toggle">{openLogs.has(a.id) ? '▾' : '▸'}</span>
						</div>
						{#if openLogs.has(a.id)}
							<div class="agent-log-body">
								<ul class="agent-log-highlights">
									{#each a.highlights as h (h)}<li>{h}</li>{/each}
								</ul>
								{#if a.url}
									<a class="agent-log-link" href={a.url} target="_blank" rel="noopener">เปิดใน Notion →</a>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.briefing-agent { display: flex; flex-direction: column; align-items: center; gap: 4px; text-decoration: none; color: var(--text); width: 64px; }
	.briefing-agent img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; object-position: top; }
	.briefing-agents { display: flex; gap: 10px; flex-wrap: wrap; }
	.agent-log-card { cursor: pointer; }
</style>
