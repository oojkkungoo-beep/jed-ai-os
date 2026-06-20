<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DetailPanel from '$lib/components/layout/DetailPanel.svelte';
	import {
		todosStore,
		todoQuadrantFilter,
		filteredTodos,
		addTodo,
		updateTodo,
		toggleTodo,
		deleteTodo
	} from '$lib/stores/todos';
	import type { Todo } from '$lib/types/todo';
	import { fmt } from '$lib/utils/format';

	const QUADRANTS: { id: string; label: string }[] = [
		{ id: 'all', label: 'ทั้งหมด' },
		{ id: 'q1', label: '🔥 ทำทันที' },
		{ id: 'q2', label: '📅 วางแผน' },
		{ id: 'q3', label: '🤝 มอบหมาย' },
		{ id: 'q4', label: '🗑️ ตัดทิ้ง' }
	];

	const { error: todosError } = todosStore;

	let showAddForm = $state(false);
	let newText = $state('');
	let newCategory = $state('');
	let newPriority = $state<'high' | 'medium' | 'low'>('medium');
	let newQuadrant = $state<'q1' | 'q2' | 'q3' | 'q4'>('q2');

	let selected = $state<Todo | null>(null);
	let editText = $state('');
	let editCategory = $state('');
	let editPriority = $state<'high' | 'medium' | 'low'>('medium');
	let editQuadrant = $state<'q1' | 'q2' | 'q3' | 'q4'>('q2');

	function openDetail(t: Todo) {
		selected = t;
		editText = t.text;
		editCategory = t.category;
		editPriority = t.priority;
		editQuadrant = t.quadrant;
	}

	async function createTodo() {
		if (!newText.trim()) return;
		await addTodo({ text: newText.trim(), category: newCategory, priority: newPriority, quadrant: newQuadrant });
		newText = '';
		newCategory = '';
		showAddForm = false;
	}

	async function saveEdit() {
		if (!selected) return;
		await updateTodo(selected.id, { text: editText, category: editCategory, priority: editPriority, quadrant: editQuadrant });
		selected = null;
	}

	async function removeTodo() {
		if (!selected) return;
		await deleteTodo(selected.id);
		selected = null;
	}
</script>

<PageHeader title="✅ Todo" subtitle="Eisenhower Matrix" />

{#if $todosError}
	<div class="error-banner">โหลดข้อมูลไม่สำเร็จ: {$todosError}</div>
{/if}

<div class="filter-row">
	{#each QUADRANTS as q (q.id)}
		<button class="filter-btn" class:active={$todoQuadrantFilter === q.id} onclick={() => todoQuadrantFilter.set(q.id)}>
			{q.label}
		</button>
	{/each}
	<button class="btn-green" style="margin-left:auto" onclick={() => (showAddForm = !showAddForm)}>+ เพิ่ม</button>
</div>

{#if showAddForm}
	<div class="add-form">
		<input class="inp" placeholder="งานที่ต้องทำ..." bind:value={newText} />
		<input class="inp" placeholder="หมวด" bind:value={newCategory} style="max-width:120px" />
		<select class="inp" bind:value={newPriority} style="max-width:110px">
			<option value="high">High</option>
			<option value="medium">Medium</option>
			<option value="low">Low</option>
		</select>
		<select class="inp" bind:value={newQuadrant} style="max-width:140px">
			<option value="q1">🔥 ทำทันที</option>
			<option value="q2">📅 วางแผน</option>
			<option value="q3">🤝 มอบหมาย</option>
			<option value="q4">🗑️ ตัดทิ้ง</option>
		</select>
		<button class="btn-green" onclick={createTodo}>บันทึก</button>
	</div>
{/if}

<div class="todo-list">
	{#each $filteredTodos as t (t.id)}
		<div class="todo-item" class:done={t.done}>
			<input class="todo-check" type="checkbox" checked={t.done} onchange={() => toggleTodo(t.id, !t.done)} />
			<div class="todo-body" onclick={() => openDetail(t)}>
				<div class="todo-text">{t.text}</div>
				<div class="todo-meta">
					<span class="quadrant-tag q-{t.quadrant}">{QUADRANTS.find((q) => q.id === t.quadrant)?.label ?? t.quadrant}</span>
					{#if t.category}<span class="todo-cat">{t.category}</span>{/if}
					<span class="todo-date">{fmt(t.created)}</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="empty-state">ไม่มีงานในหมวดนี้</div>
	{/each}
</div>

<DetailPanel open={!!selected} title="แก้ไข Todo" onClose={() => (selected = null)}>
	{#if selected}
		<div class="todo-detail-field">
			<label for="todo-text">ข้อความ</label>
			<textarea id="todo-text" class="inp" rows="3" bind:value={editText}></textarea>
		</div>
		<div class="todo-detail-field">
			<label for="todo-cat">หมวด</label>
			<input id="todo-cat" class="inp" bind:value={editCategory} />
		</div>
		<div class="todo-detail-field">
			<label for="todo-pri">Priority</label>
			<select id="todo-pri" class="inp" bind:value={editPriority}>
				<option value="high">High</option>
				<option value="medium">Medium</option>
				<option value="low">Low</option>
			</select>
		</div>
		<div class="todo-detail-field">
			<label for="todo-quad">Quadrant</label>
			<select id="todo-quad" class="inp" bind:value={editQuadrant}>
				<option value="q1">🔥 ทำทันที</option>
				<option value="q2">📅 วางแผน</option>
				<option value="q3">🤝 มอบหมาย</option>
				<option value="q4">🗑️ ตัดทิ้ง</option>
			</select>
		</div>
		<div class="detail-actions">
			<button class="btn-green" onclick={saveEdit}>บันทึก</button>
			<button class="btn-outline" onclick={removeTodo}>ลบ</button>
		</div>
	{/if}
</DetailPanel>

<style>
	.filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0 16px; align-items: center; }
	.filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: 13px; }
	.filter-btn.active { background: var(--green); color: #fff; border-color: var(--green); }
	.add-form { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
	.todo-list { display: flex; flex-direction: column; gap: 8px; }
	.detail-actions { display: flex; gap: 8px; margin-top: 16px; }
	.empty-state, .error-banner { padding: 16px; }
	.error-banner { background: var(--red-bg); color: var(--red); border-radius: var(--radius); }
	textarea.inp { width: 100%; font-family: inherit; }
</style>
