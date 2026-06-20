<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DetailPanel from '$lib/components/layout/DetailPanel.svelte';
	import {
		knowledgeStore,
		knowledgeTopicFilter,
		knowledgeSourceFilter,
		knowledgeSearch,
		filteredKnowledge
	} from '$lib/stores/knowledge';
	import type { Knowledge } from '$lib/types/knowledge';
	import { fmt } from '$lib/utils/format';

	const { data: knowledgeData, error: knowledgeError } = knowledgeStore;

	let viewMode = $state<'table' | 'card'>('card');
	let selected = $state<Knowledge | null>(null);

	const topics = $derived(['all', ...new Set($knowledgeData.map((k) => k.topic))]);
	const sources = $derived(['all', ...new Set($knowledgeData.map((k) => k.source))]);
</script>

<PageHeader title="📚 Knowledge" subtitle="คลังความรู้ที่เก็บสะสมไว้" />

{#if $knowledgeError}
	<div class="error-banner">โหลดข้อมูลไม่สำเร็จ: {$knowledgeError}</div>
{/if}

<div class="filter-row">
	<select bind:value={$knowledgeTopicFilter} class="inp">
		{#each topics as t (t)}<option value={t}>{t === 'all' ? 'ทุก Topic' : t}</option>{/each}
	</select>
	<select bind:value={$knowledgeSourceFilter} class="inp">
		{#each sources as s (s)}<option value={s}>{s === 'all' ? 'ทุก Source' : s}</option>{/each}
	</select>
	<input class="inp" placeholder="ค้นหา..." bind:value={$knowledgeSearch} />
	<div class="view-toggle">
		<button class:active={viewMode === 'card'} onclick={() => (viewMode = 'card')}>Card</button>
		<button class:active={viewMode === 'table'} onclick={() => (viewMode = 'table')}>Table</button>
	</div>
</div>

{#if viewMode === 'card'}
	<div class="knowledge-grid">
		{#each $filteredKnowledge as k (k.id)}
			<button class="knowledge-card" onclick={() => (selected = k)}>
				<div class="knowledge-head"><div class="knowledge-title">{k.title}</div></div>
				<div class="knowledge-meta">
					<span>{k.topic}</span><span>·</span><span>{k.source}</span><span>·</span><span>{k.date}</span>
				</div>
				<div class="knowledge-content">{k.content.slice(0, 120)}{k.content.length > 120 ? '…' : ''}</div>
			</button>
		{:else}
			<div class="empty-state">ไม่พบความรู้ที่ตรงกับเงื่อนไข</div>
		{/each}
	</div>
{:else}
	<table class="k-table">
		<thead><tr><th>Title</th><th>Topic</th><th>Source</th><th>Date</th></tr></thead>
		<tbody>
			{#each $filteredKnowledge as k (k.id)}
				<tr onclick={() => (selected = k)}>
					<td>{k.title}</td><td>{k.topic}</td><td>{k.source}</td><td>{k.date}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<DetailPanel open={!!selected} title={selected?.title ?? ''} onClose={() => (selected = null)}>
	{#if selected}
		<div class="knowledge-meta">
			<span>{selected.topic}</span><span>·</span><span>{selected.source}</span><span>·</span><span>{fmt(selected.date)}</span>
		</div>
		<p style="margin-top:12px; white-space:pre-wrap;">{selected.content}</p>
		{#if selected.url}
			<p style="margin-top:12px;"><a href={selected.url} target="_blank" rel="noopener">🔗 เปิดลิงก์ต้นฉบับ</a></p>
		{/if}
	{/if}
</DetailPanel>

<style>
	.filter-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 12px 0 16px; align-items: center; }
	.view-toggle { display: flex; gap: 4px; margin-left: auto; }
	.view-toggle button { padding: 6px 12px; border: 1px solid var(--border); background: var(--surface); border-radius: 6px; cursor: pointer; }
	.view-toggle button.active { background: var(--green); color: #fff; border-color: var(--green); }
	.knowledge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
	.knowledge-card { text-align: left; cursor: pointer; border: 1px solid var(--border); background: var(--surface); border-radius: var(--radius); padding: 14px; }
	.knowledge-title { font-weight: 600; }
	.knowledge-meta { font-size: 12px; color: var(--muted); display: flex; gap: 6px; margin: 6px 0; }
	.knowledge-content { font-size: 13px; color: var(--text); }
	.k-table { width: 100%; border-collapse: collapse; }
	.k-table th, .k-table td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--border); }
	.k-table tr { cursor: pointer; }
	.k-table tr:hover { background: var(--border); }
	.empty-state, .error-banner { padding: 16px; }
	.error-banner { background: var(--red-bg); color: var(--red); border-radius: var(--radius); }
</style>
