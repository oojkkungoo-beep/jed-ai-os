import { createPollingStore } from './polling';
import type { Project } from '$lib/types/project';

export const projectsStore = createPollingStore<Project[]>('/api/projects', []);

export async function addProject(input: Partial<Project>) {
	await fetch('/api/projects', { method: 'POST', body: JSON.stringify(input) });
	await projectsStore.refreshNow();
}
export async function updateProject(id: string, patch: Partial<Project>) {
	await fetch(`/api/projects/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
	await projectsStore.refreshNow();
}
export async function deleteProject(id: string) {
	await fetch(`/api/projects/${id}`, { method: 'DELETE' });
	await projectsStore.refreshNow();
}
