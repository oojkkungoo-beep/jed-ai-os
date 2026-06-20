import { derived, writable } from 'svelte/store';
import { createPollingStore } from './polling';
import type { SessionLog } from '$lib/types/sessionLog';

export const sessionLogStore = createPollingStore<SessionLog[]>('/api/session-log', []);
export const sessionTagFilter = writable<string>('all');

export const filteredSessions = derived(
	[sessionLogStore.data, sessionTagFilter],
	([$items, $tag]) => ($tag === 'all' ? $items : $items.filter((s) => s.tags.includes($tag)))
);
