import { derived, writable } from 'svelte/store';
import { createPollingStore } from './polling';
import type { Knowledge } from '$lib/types/knowledge';

export const knowledgeStore = createPollingStore<Knowledge[]>('/api/knowledge', []);
export const knowledgeTopicFilter = writable<string>('all');
export const knowledgeSourceFilter = writable<string>('all');
export const knowledgeSearch = writable<string>('');

export const filteredKnowledge = derived(
	[knowledgeStore.data, knowledgeTopicFilter, knowledgeSourceFilter, knowledgeSearch],
	([$items, $topic, $source, $search]) =>
		$items.filter((k) => {
			if ($topic !== 'all' && k.topic !== $topic) return false;
			if ($source !== 'all' && k.source !== $source) return false;
			if ($search && !`${k.title} ${k.content}`.toLowerCase().includes($search.toLowerCase()))
				return false;
			return true;
		})
);
