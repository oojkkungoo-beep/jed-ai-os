<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DetailPanel from '$lib/components/layout/DetailPanel.svelte';
	import { projectsStore, addProject, updateProject, deleteProject } from '$lib/stores/projects';
	import type { Project } from '$lib/types/project';
	import { fmt } from '$lib/utils/format';

	const STATUS_LABEL: Record<string, string> = { active: 'Active', pending: 'Pending', done: 'Done' };
	const { data: projectsData, error: projectsError } = projectsStore;

	let selected = $state<Project | null>(null);
	let editName = $state('');
	let editStatus = $state('active');
	let editProgress = $state(0);
	let editNotes = $state('');

	let showAddForm = $state(false);
	let newName = $state('');

	function openDetail(p: Project) {
		selected = p;
		editName = p.name;
		editStatus = p.status;
		editProgress = p.progress;
		editNotes = p.notes;
	}

	async function saveEdit() {
		if (!selected) return;
		await updateProject(selected.id, {
			name: editName,
			status: editStatus,
			progress: editProgress,
			notes: editNotes
		});
		selected = null;
	}

	async function removeProject() {
		if (!selected) return;
		if (!confirm(`ลบโปรเจกต์ "${selected.name}" ใช่ไหม?`)) return;
		await deleteProject(selected.id);
		selected = null;
	}

	async function createProject() {
		if (!newName.trim()) return;
		await addProject({ name: newName.trim(), status: 'pending', progress: 0, notes: '' });
		newName = '';
		showAddForm = false;
	}
</script>

<PageHeader title="📁 Projects" subtitle="โปรเจกต์ทั้งหมดของ Jed" />

{#if $projectsError}
	<div class="error-banner">โหลดข้อมูลไม่สำเร็จ: {$projectsError}</div>
{/if}

<div class="page-top">
	<button class="btn-green" onclick={() => (showAddForm = !showAddForm)}>+ เพิ่มโปรเจกต์</button>
</div>

{#if showAddForm}
	<div class="add-form">
		<input class="inp" placeholder="ชื่อโปรเจกต์" bind:value={newName} />
		<button class="btn-green" onclick={createProject}>บันทึก</button>
	</div>
{/if}

<div class="project-list">
	{#each $projectsData as p (p.id)}
		<button class="project-row" onclick={() => openDetail(p)}>
			<span class="project-name">{p.name}</span>
			<span class="project-progress-wrap">
				<span class="project-progress-bar">
					<span class="project-progress-fill" style="width:{p.progress}%"></span>
				</span>
				<span class="project-progress-pct">{p.progress}%</span>
			</span>
			<span class="st-badge st-{p.status}">{STATUS_LABEL[p.status] ?? p.status}</span>
			<span class="project-date">{fmt(p.updated)}</span>
		</button>
	{:else}
		<div class="empty-state">ยังไม่มีโปรเจกต์</div>
	{/each}
</div>

<DetailPanel open={!!selected} title={selected?.name ?? ''} onClose={() => (selected = null)}>
	{#if selected}
		<label class="field-label" for="proj-name">ชื่อ</label>
		<input id="proj-name" class="inp" bind:value={editName} />

		<label class="field-label" for="proj-status">สถานะ</label>
		<select id="proj-status" class="inp" bind:value={editStatus}>
			<option value="active">Active</option>
			<option value="pending">Pending</option>
			<option value="done">Done</option>
		</select>

		<label class="field-label" for="proj-progress">Progress ({editProgress}%)</label>
		<input id="proj-progress" type="range" min="0" max="100" bind:value={editProgress} />

		<label class="field-label" for="proj-notes">Notes</label>
		<textarea id="proj-notes" class="inp" rows="10" bind:value={editNotes}></textarea>

		<div class="detail-actions">
			<button class="btn-green" onclick={saveEdit}>บันทึก</button>
			<button class="btn-outline" onclick={removeProject}>ลบ</button>
		</div>
	{/if}
</DetailPanel>

<style>
	.page-top { margin-bottom: 12px; }
	.project-row { width: 100%; text-align: left; cursor: pointer; font-family: inherit; }
	.add-form { display: flex; gap: 8px; margin-bottom: 14px; }
	.field-label { display: block; font-size: 12px; color: var(--muted); margin: 12px 0 4px; }
	.detail-actions { display: flex; gap: 8px; margin-top: 16px; }
	.empty-state, .error-banner { padding: 16px; }
	.error-banner { background: var(--red-bg); color: var(--red); border-radius: var(--radius); }
	textarea.inp { width: 100%; font-family: inherit; }
</style>
