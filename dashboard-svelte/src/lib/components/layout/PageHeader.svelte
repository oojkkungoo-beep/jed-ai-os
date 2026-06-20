<script lang="ts">
	let { title, subtitle = '' }: { title: string; subtitle?: string } = $props();
</script>

<div class="page-header">
	<h1>{title}</h1>
	{#if subtitle}<p class="page-subtitle">{subtitle}</p>{/if}
</div>
