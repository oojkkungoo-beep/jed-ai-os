<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { SessionCategory } from '$lib/types/sessionLog';

	let { categories }: { categories: SessionCategory[] } = $props();
	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	function render() {
		if (!canvas) return;
		chart?.destroy();
		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: categories.map((c) => c.name),
				datasets: [
					{
						data: categories.map((c) => c.count),
						backgroundColor: '#4a7a4a'
					}
				]
			},
			options: {
				indexAxis: 'y',
				plugins: { legend: { display: false } },
				scales: { x: { beginAtZero: true } }
			}
		});
	}

	onMount(render);
	onDestroy(() => chart?.destroy());

	$effect(() => {
		render();
	});
</script>

<canvas bind:this={canvas} height="160"></canvas>
