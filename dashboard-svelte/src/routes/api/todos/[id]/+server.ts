import { json, error } from '@sveltejs/kit';
import { readMergeWrite } from '$lib/server/jsonStore';
import { paths } from '$lib/server/paths';
import type { Todo } from '../+server';

const FILE = paths.output('todos.json');

export async function PATCH({ params, request }) {
	const patch = (await request.json()) as Partial<Todo>;
	const id = Number(params.id);
	let found = false;
	const result = await readMergeWrite<Todo[]>(FILE, [], (current) =>
		current.map((t) => {
			if (t.id !== id) return t;
			found = true;
			return { ...t, ...patch, id: t.id };
		})
	);
	if (!found) error(404, 'todo not found');
	return json(result);
}

export async function DELETE({ params }) {
	const id = Number(params.id);
	let found = false;
	const result = await readMergeWrite<Todo[]>(FILE, [], (current) => {
		const next = current.filter((t) => t.id !== id);
		found = next.length !== current.length;
		return next;
	});
	if (!found) error(404, 'todo not found');
	return json(result);
}
