<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { activityStore, activityAgentFilter, filteredActivity } from '$lib/stores/activity';
	import { fmt } from '$lib/utils/format';

	const { data: activityData, error: activityError } = activityStore;

	const agents = $derived(['all', ...new Set($activityData.map((a) => a.agent))]);
</script>

<PageHeader title="Activity" subtitle="ไทม์ไลน์การทำงานของทีม" />

<div class="filter-row">
	{#each agents as agent (agent)}
		<button
			class="filter-btn"
			class:active={$activityAgentFilter === agent}
			onclick={() => activityAgentFilter.set(agent)}
		>
			{agent === 'all' ? 'ทั้งหมด' : agent}
		</button>
	{/each}
</div>

{#if $activityError}
	<div class="error-banner">โหลดข้อมูลไม่สำเร็จ: {$activityError}</div>
{/if}

<ul class="activity-list">
	{#each $filteredActivity as item, i (item.time + i)}
		<li class="activity-row">
			<span class="activity-agent">{item.agent}</span>
			<span class="activity-action">{item.action}</span>
			<span class="activity-time">{fmt(item.time)}</span>
		</li>
	{:else}
		<li class="empty-state">ยังไม่มี activity</li>
	{/each}
</ul>

<style>
	.filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0 16px; }
	.filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: 13px; }
	.filter-btn.active { background: var(--green); color: #fff; border-color: var(--green); }
	.activity-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
	.activity-row { display: flex; gap: 12px; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); align-items: baseline; }
	.activity-agent { font-weight: 600; color: var(--green); min-width: 70px; }
	.activity-action { flex: 1; }
	.activity-time { color: var(--muted); font-size: 12px; white-space: nowrap; }
	.empty-state { color: var(--muted); padding: 20px; text-align: center; }
	.error-banner { background: var(--red-bg); color: var(--red); padding: 10px 14px; border-radius: var(--radius); margin-bottom: 12px; }
</style>
