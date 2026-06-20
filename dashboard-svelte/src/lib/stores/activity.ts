import { derived, writable } from 'svelte/store';
import { createPollingStore } from './polling';
import type { Activity } from '$lib/types/activity';

export const activityStore = createPollingStore<Activity[]>('/api/activity', []);
export const activityAgentFilter = writable<string>('all');

export const filteredActivity = derived(
	[activityStore.data, activityAgentFilter],
	([$items, $agent]) => ($agent === 'all' ? $items : $items.filter((a) => a.agent === $agent))
);
