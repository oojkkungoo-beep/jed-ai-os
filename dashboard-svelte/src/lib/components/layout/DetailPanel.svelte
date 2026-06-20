<script lang="ts">
	let {
		open = false,
		title = '',
		onClose,
		children
	}: { open: boolean; title?: string; onClose: () => void; children?: () => unknown } = $props();
</script>

{#if open}
	<div class="k-detail-overlay" onclick={onClose} role="presentation"></div>
	<div class="k-detail-panel">
		<div class="k-detail-head">
			<div class="k-detail-title">{title}</div>
			<button class="k-detail-close" onclick={onClose} aria-label="close">✕</button>
		</div>
		<div class="k-detail-body">
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.k-detail-overlay {
		position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35); z-index: 40;
	}
	.k-detail-panel {
		position: fixed; top: 0; right: 0; height: 100vh; width: min(480px, 100vw);
		background: var(--surface); border-left: 1px solid var(--border); z-index: 41;
		display: flex; flex-direction: column; box-shadow: -4px 0 18px rgba(0,0,0,0.12);
	}
	.k-detail-head {
		display: flex; justify-content: space-between; align-items: center;
		padding: 16px 18px; border-bottom: 1px solid var(--border);
	}
	.k-detail-title { font-weight: 700; font-size: 16px; color: var(--green); }
	.k-detail-close { border: none; background: none; font-size: 16px; cursor: pointer; color: var(--muted); }
	.k-detail-body { padding: 18px; overflow-y: auto; flex: 1; }
</style>
