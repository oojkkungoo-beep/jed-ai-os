<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { knowledgeStore } from '$lib/stores/knowledge';
	import { projectsStore } from '$lib/stores/projects';
	import { todosStore } from '$lib/stores/todos';
	import { sessionLogStore } from '$lib/stores/sessionLog';
	import { activityStore } from '$lib/stores/activity';
	import { teamLogsStore } from '$lib/stores/teamLogs';
	import { startDiaryPolling, stopDiaryPolling } from '$lib/stores/diary';

	let { children } = $props();

	const pollers = [
		knowledgeStore,
		projectsStore,
		todosStore,
		sessionLogStore,
		activityStore,
		teamLogsStore
	];

	onMount(() => {
		for (const p of pollers) p.start();
		startDiaryPolling();
	});
	onDestroy(() => {
		for (const p of pollers) p.stop();
		stopDiaryPolling();
	});
</script>

<svelte:head>
	<link rel="icon" href="/Jed.ico" />
</svelte:head>

<Sidebar />
<div class="main">
	{@render children()}
</div>
