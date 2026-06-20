import { derived, writable } from 'svelte/store';
import { createPollingStore } from './polling';
import type { Todo } from '$lib/types/todo';

export const todosStore = createPollingStore<Todo[]>('/api/todos', []);
export const todoQuadrantFilter = writable<string>('all');

export const filteredTodos = derived(
	[todosStore.data, todoQuadrantFilter],
	([$todos, $quadrant]) => {
		const list =
			$quadrant === 'all' ? $todos : $todos.filter((t) => t.quadrant === $quadrant);
		return [...list].sort((a, b) => {
			if (a.done !== b.done) return a.done ? 1 : -1;
			return new Date(b.created).getTime() - new Date(a.created).getTime();
		});
	}
);

export async function addTodo(input: Partial<Todo>) {
	await fetch('/api/todos', { method: 'POST', body: JSON.stringify(input) });
	await todosStore.refreshNow();
}
export async function updateTodo(id: number, patch: Partial<Todo>) {
	await fetch(`/api/todos/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
	await todosStore.refreshNow();
}
export async function toggleTodo(id: number, done: boolean) {
	await updateTodo(id, { done });
}
export async function deleteTodo(id: number) {
	await fetch(`/api/todos/${id}`, { method: 'DELETE' });
	await todosStore.refreshNow();
}
