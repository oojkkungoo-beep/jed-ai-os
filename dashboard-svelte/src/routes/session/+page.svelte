<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DetailPanel from '$lib/components/layout/DetailPanel.svelte';
	import SessionChart from '$lib/components/session/SessionChart.svelte';
	import { sessionLogStore, sessionTagFilter, filteredSessions } from '$lib/stores/sessionLog';
	import type { SessionLog } from '$lib/types/sessionLog';

	const { data: sessionLogData, error: sessionLogError } = sessionLogStore;

	let selected = $state<SessionLog | null>(null);
	const allTags = $derived([
		'all',
		...new Set($sessionLogData.flatMap((s) => s.tags))
	]);
</script>

<PageHeader title="🗒️ Session Log" subtitle="บันทึกสรุปแต่ละ session" />

{#if $sessionLogError}
	<div class="error-banner">โหลดข้อมูลไม่สำเร็จ: {$sessionLogError}</div>
{/if}

<div class="filter-row">
	{#each allTags as tag (tag)}
		<button class="filter-btn" class:active={$sessionTagFilter === tag} onclick={() => sessionTagFilter.set(tag)}>
			{tag === 'all' ? 'ทั้งหมด' : tag}
		</button>
	{/each}
</div>

<div class="session-list">
	{#each $filteredSessions as s (s.id)}
		<button class="session-card" onclick={() => (selected = s)}>
			<div class="session-card-head">
				<span class="session-date">{s.date}</span>
				<span class="session-top-cat">{s.topCategory}</span>
			</div>
			<div class="session-summary-text">{s.summary}</div>
			<div class="session-cats">
				{#each s.tags as t (t)}<span class="cat-chip">{t}</span>{/each}
			</div>
		</button>
	{:else}
		<div class="empty-state">ไม่มี session ที่ตรงกับ tag นี้</div>
	{/each}
</div>

<DetailPanel open={!!selected} title={selected?.date ?? ''} onClose={() => (selected = null)}>
	{#if selected}
		<h3>{selected.topCategory}</h3>
		<p style="margin:10px 0; white-space:pre-wrap;">{selected.details || selected.summary}</p>

		<div class="session-tasks">
			<div class="session-tasks-label">Tasks</div>
			{#each selected.tasks as t (t)}<div class="session-task-item">• {t}</div>{/each}
		</div>

		{#if selected.categories?.length}
			<div style="margin-top:18px;">
				<div class="session-tasks-label">Category Breakdown</div>
				<SessionChart categories={selected.categories} />
			</div>
		{/if}

		{#if selected.relatedProjects?.length}
			<div style="margin-top:18px;">
				<div class="session-tasks-label">Related Projects</div>
				{#each selected.relatedProjects as p (p)}<span class="cat-chip">{p}</span>{/each}
			</div>
		{/if}
	{/if}
</DetailPanel>

<style>
	.filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0 16px; }
	.filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: 13px; }
	.filter-btn.active { background: var(--green); color: #fff; border-color: var(--green); }
	.session-card { width: 100%; text-align: left; cursor: pointer; font-family: inherit; }
	.empty-state, .error-banner { padding: 16px; }
	.error-banner { background: var(--red-bg); color: var(--red); border-radius: var(--radius); }
</style>
