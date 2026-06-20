import { derived, writable } from 'svelte/store';
import { createPollingStore } from './polling';
import type { GlossaryTerm } from '$lib/types/glossary';

export const glossaryStore = createPollingStore<GlossaryTerm[]>('/api/glossary', []);
export const glossarySearch = writable<string>('');

export const filteredGlossary = derived(
	[glossaryStore.data, glossarySearch],
	([$items, $search]) => {
		const q = $search.trim().toLowerCase();
		const filtered = !q
			? $items
			: $items.filter(
					(g) =>
						g.term.toLowerCase().includes(q) ||
						g.meaning.toLowerCase().includes(q) ||
						g.category.toLowerCase().includes(q)
				);
		return [...filtered].reverse();
	}
);

export async function addGlossaryTerm(input: Partial<GlossaryTerm>) {
	await fetch('/api/glossary', { method: 'POST', body: JSON.stringify(input) });
	await glossaryStore.refreshNow();
}
