import { createPollingStore } from './polling';
import type { TeamLogDay } from '$lib/types/teamLog';

export const teamLogsStore = createPollingStore<TeamLogDay[]>('/api/team-logs', []);
