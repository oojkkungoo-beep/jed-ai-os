<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { glossaryStore, glossarySearch, filteredGlossary } from '$lib/stores/glossary';
	const { error: glossaryError } = glossaryStore;
</script>

<PageHeader title="📔 Glossary" subtitle="คลังคำศัพท์ — คำที่ Jed ถามความหมาย เก็บไว้ทบทวนทีหลัง" />

<div class="page-top">
	<input
		class="inp"
		style="max-width:240px"
		placeholder="ค้นหาคำศัพท์..."
		value={$glossarySearch}
		oninput={(e) => glossarySearch.set((e.target as HTMLInputElement).value)}
	/>
</div>

{#if $glossaryError}
	<div class="error-banner">โหลดข้อมูลไม่สำเร็จ: {$glossaryError}</div>
{/if}

<div class="glossary-list">
	{#each $filteredGlossary as g (g.id)}
		<div class="knowledge-card">
			<div class="knowledge-head">
				<div class="knowledge-title">{g.term}</div>
			</div>
			<div class="knowledge-meta">
				<span>{g.category || 'General'}</span>
				<span>·</span>
				<span>{g.date_added || ''}</span>
			</div>
			<div class="knowledge-content">{g.meaning || ''}</div>
			{#if g.example}
				<div class="knowledge-content" style="opacity:0.7;font-size:0.82rem;margin-top:4px">
					ตัวอย่าง: {g.example}
				</div>
			{/if}
		</div>
	{:else}
		<div class="widget-empty">
			ยังไม่มีคำศัพท์ในคลัง — ลองถาม Laura ให้ช่วยอธิบายคำที่สงสัย แล้วขอให้บันทึกเก็บไว้
		</div>
	{/each}
</div>

<style>
	.page-top { margin-bottom: 14px; }
	.glossary-list { display: flex; flex-direction: column; gap: 10px; }
	.error-banner { background: var(--red-bg); color: var(--red); padding: 10px 14px; border-radius: var(--radius); margin-bottom: 12px; }
</style>
