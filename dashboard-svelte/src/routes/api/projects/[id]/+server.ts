import { json, error } from '@sveltejs/kit';
import { readMergeWrite } from '$lib/server/jsonStore';
import { paths } from '$lib/server/paths';
import type { Project } from '../+server';

const FILE = paths.output('projects.json');

export async function PATCH({ params, request }) {
	const patch = (await request.json()) as Partial<Project>;
	let found = false;
	const result = await readMergeWrite<Project[]>(FILE, [], (current) =>
		current.map((p) => {
			if (p.id !== params.id) return p;
			found = true;
			return { ...p, ...patch, id: p.id, updated: new Date().toISOString() };
		})
	);
	if (!found) error(404, 'project not found');
	return json(result);
}

export async function DELETE({ params }) {
	let found = false;
	const result = await readMergeWrite<Project[]>(FILE, [], (current) => {
		const next = current.filter((p) => p.id !== params.id);
		found = next.length !== current.length;
		return next;
	});
	if (!found) error(404, 'project not found');
	return json(result);
}
