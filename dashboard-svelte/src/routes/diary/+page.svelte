<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { diaryByPerson, selectedPerson, addJedDiaryEntry, PEOPLE } from '$lib/stores/diary';
	import { AGENTS } from '$lib/types/agent';

	const PEOPLE_META: Record<string, { name: string; race: string; image: string }> = {
		jed: { name: 'Jed', race: 'Royal Medic Knight', image: '/api/images/Jed.png' },
		...Object.fromEntries(
			AGENTS.map((a) => [a.id, { name: a.name, race: a.race, image: a.image }])
		)
	};

	let newEntry = $state('');
	let bookIndex = $state<number | null>(null);

	const entries = $derived($diaryByPerson[$selectedPerson] ?? []);
	const sortedEntries = $derived(
		[...entries].sort((a, b) => (a.date < b.date ? 1 : -1))
	);

	function openBook(i: number) {
		bookIndex = i;
	}
	function closeBook() {
		bookIndex = null;
	}
	function navBook(delta: number) {
		if (bookIndex === null) return;
		const next = bookIndex + delta;
		if (next >= 0 && next < sortedEntries.length) bookIndex = next;
	}

	async function submitEntry() {
		if (!newEntry.trim()) return;
		await addJedDiaryEntry(newEntry.trim());
		newEntry = '';
	}
</script>

<PageHeader title="📖 Diary" subtitle="บันทึกประจำวันของ Jed และทีม" />

<div class="diary-people">
	{#each PEOPLE as p (p)}
		<button
			class="diary-person"
			class:active={$selectedPerson === p}
			onclick={() => selectedPerson.set(p)}
		>
			<img src={PEOPLE_META[p]?.image ?? '/api/images/Jed.png'} alt={PEOPLE_META[p]?.name ?? p} />
			<div class="diary-person-name">
				{PEOPLE_META[p]?.name ?? p}
				<span>{$diaryByPerson[p]?.length ?? 0} รายการ</span>
			</div>
		</button>
	{/each}
</div>

<div class="diary-list-title">{PEOPLE_META[$selectedPerson]?.name ?? $selectedPerson} — Diary</div>

{#if $selectedPerson === 'jed'}
	<div class="diary-input-card">
		<div class="diary-input-label">เขียน diary วันนี้</div>
		<textarea class="diary-ta" rows="4" bind:value={newEntry} placeholder="วันนี้เป็นยังไง..."></textarea>
		<button class="btn-green" style="margin-top:8px" onclick={submitEntry}>บันทึก</button>
	</div>
{/if}

<div class="diary-entries">
	{#each sortedEntries as e, i (e.date + i)}
		<button class="diary-card" onclick={() => openBook(i)}>
			<div class="diary-date">{e.date}</div>
			<div class="diary-content">{e.content.slice(0, 200)}{e.content.length > 200 ? '…' : ''}</div>
		</button>
	{:else}
		<div class="empty-state">ยังไม่มี diary ของ{PEOPLE_META[$selectedPerson]?.name ?? $selectedPerson}</div>
	{/each}
</div>

{#if bookIndex !== null}
	<div class="book-overlay open" onclick={closeBook} role="presentation"></div>
	<div class="book-modal open">
		<span class="book-close" onclick={closeBook} role="button" tabindex="0">✕</span>
		<div class="book-page book-page-left">
			<img src={PEOPLE_META[$selectedPerson]?.image ?? '/api/images/Jed.png'} alt={PEOPLE_META[$selectedPerson]?.name} />
			<div class="book-person-name">
				{PEOPLE_META[$selectedPerson]?.name}
				<span>{PEOPLE_META[$selectedPerson]?.race ?? ''}</span>
			</div>
		</div>
		<div class="book-page book-page-right">
			<div class="book-date">{sortedEntries[bookIndex].date}</div>
			<div class="book-content">{sortedEntries[bookIndex].content}</div>
			<div class="book-nav">
				<button class="btn-outline" disabled={bookIndex === 0} onclick={() => navBook(-1)}>← ก่อนหน้า</button>
				<span>{bookIndex + 1} / {sortedEntries.length}</span>
				<button class="btn-outline" disabled={bookIndex === sortedEntries.length - 1} onclick={() => navBook(1)}>ถัดไป →</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.diary-card { width: 100%; text-align: left; cursor: pointer; font-family: inherit; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; }
	.diary-person { cursor: pointer; font-family: inherit; }
	.empty-state { padding: 16px; color: var(--muted); }
</style>
