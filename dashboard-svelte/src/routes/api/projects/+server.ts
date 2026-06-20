import { json } from '@sveltejs/kit';
import { readJson, readMergeWrite } from '$lib/server/jsonStore';
import { paths } from '$lib/server/paths';

export interface Project {
	id: string;
	name: string;
	status: string;
	progress: number;
	updated: string;
	notes: string;
}

const FILE = paths.output('projects.json');

function slugify(name: string): string {
	return (
		name
			.toLowerCase()
			.replace(/[^a-z0-9ก-๙\s-]/gi, '')
			.trim()
			.replace(/\s+/g, '-') || 'project'
	);
}

export async function GET() {
	const data = await readJson<Project[]>(FILE, []);
	return json(data);
}

export async function POST({ request }) {
	const input = (await request.json()) as Partial<Project>;
	if (!input.name) return json({ error: 'name is required' }, { status: 400 });

	const result = await readMergeWrite<Project[]>(FILE, [], (current) => {
		const used = new Set(current.map((p) => p.id));
		let base = slugify(input.name!);
		let id = base;
		let i = 2;
		while (used.has(id)) {
			id = `${base}-${i}`;
			i++;
		}
		const next: Project = {
			id,
			name: input.name!,
			status: input.status ?? 'pending',
			progress: input.progress ?? 0,
			updated: new Date().toISOString(),
			notes: input.notes ?? ''
		};
		return [...current, next];
	});
	return json(result);
}
