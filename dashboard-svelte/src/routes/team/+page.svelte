<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { AGENTS, ORG_CHART } from '$lib/types/agent';
	import type { Agent } from '$lib/types/agent';

	function modelClass(model: string) {
		if (model.toLowerCase().includes('opus')) return 'm-opus';
		if (model.toLowerCase().includes('haiku')) return 'm-haiku';
		return 'm-sonnet';
	}

	let tab = $state<'grid' | 'org'>('grid');
	let selected = $state<Agent | null>(null);
	let docTab = $state<'prompt' | 'character'>('prompt');
	let docContent = $state('');
	let docLoading = $state(false);

	async function openAgent(a: Agent) {
		selected = a;
		docTab = 'prompt';
		await loadDoc();
	}

	async function loadDoc() {
		if (!selected) return;
		docLoading = true;
		try {
			const url = docTab === 'prompt' ? `/api/team/${selected.id}` : `/api/characters/${selected.id}`;
			const res = await fetch(url);
			docContent = res.ok ? await res.text() : '(ไม่พบไฟล์)';
		} catch {
			docContent = '(โหลดไม่สำเร็จ)';
		} finally {
			docLoading = false;
		}
	}

	function findAgent(id: string) {
		return AGENTS.find((a) => a.id === id);
	}
</script>

<PageHeader title="🧑‍🤝‍🧑 Team" subtitle="ทีม AI ของ Jed" />

<div class="tab-toggle">
	<button class:active={tab === 'grid'} onclick={() => (tab = 'grid')}>Agents</button>
	<button class:active={tab === 'org'} onclick={() => (tab = 'org')}>Org Chart</button>
</div>

{#if tab === 'grid'}
	<div class="agents-grid" style="margin-top:16px">
		{#each AGENTS as a (a.id)}
			<button class="agent-card" onclick={() => openAgent(a)}>
				<div class="agent-portrait">
					<img src={a.image} alt={a.name} />
					<span class="model-badge {modelClass(a.model)}">{a.model}</span>
				</div>
				<div class="agent-info">
					<div class="agent-name">{a.emoji} {a.name}</div>
					<div class="agent-race">{a.race}</div>
					<div class="agent-role">{a.role}</div>
					<div class="agent-desc">{a.description}</div>
				</div>
			</button>
		{/each}
	</div>
{:else}
	<div class="org-chart" style="margin-top:16px">
		<div class="org-divisions">
			{#each ORG_CHART as div (div.title)}
				<div class="org-division">
					<div class="org-division-head">
						<span class="pipeline-dot dot-{div.color}"></span>
						<div>
							<div class="org-division-name">{div.title}</div>
							<div class="org-division-sub">{div.agentIds.length} agents</div>
						</div>
					</div>
					<div class="pipeline-agents">
						{#each div.agentIds as id (id)}
							{#if findAgent(id)}
								{@const a = findAgent(id)}
								<button class="p-agent" onclick={() => a && openAgent(a)}>
									<div class="p-avatar-img"><img src={a?.image} alt={a?.name} /></div>
									<div>
										<div class="p-name">{a?.emoji} {a?.name}</div>
										<div class="p-role">{a?.role}</div>
									</div>
								</button>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

{#if selected}
	<div class="book-overlay open" onclick={() => (selected = null)} role="presentation"></div>
	<div class="book-modal agent-book-modal open">
		<span class="book-close" onclick={() => (selected = null)} role="button" tabindex="0">✕</span>
		<div class="book-page book-page-left">
			<img src={selected.image} alt={selected.name} />
			<div class="book-person-name">
				{selected.emoji} {selected.name}
				<span>{selected.race}</span>
			</div>
			<div class="modal-role">{selected.role}</div>
		</div>
		<div class="book-page book-page-right">
			<div class="tab-toggle">
				<button class:active={docTab === 'prompt'} onclick={() => { docTab = 'prompt'; loadDoc(); }}>Prompt</button>
				<button class:active={docTab === 'character'} onclick={() => { docTab = 'character'; loadDoc(); }}>Character</button>
			</div>
			<div class="book-content">
				{#if docLoading}กำลังโหลด...{:else}{docContent}{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.agent-card { text-align: left; font-family: inherit; }
	.p-agent { width: 100%; text-align: left; font-family: inherit; cursor: pointer; }
</style>
