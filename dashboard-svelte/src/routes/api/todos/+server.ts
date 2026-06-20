import { json } from '@sveltejs/kit';
import { readJson, readMergeWrite } from '$lib/server/jsonStore';
import { paths } from '$lib/server/paths';

export interface Todo {
	id: number;
	text: string;
	category: string;
	priority: 'high' | 'medium' | 'low';
	quadrant: 'q1' | 'q2' | 'q3' | 'q4';
	done: boolean;
	created: string;
}

const FILE = paths.output('todos.json');

export async function GET() {
	const data = await readJson<Todo[]>(FILE, []);
	return json(data);
}

export async function POST({ request }) {
	const input = (await request.json()) as Partial<Todo>;
	if (!input.text) return json({ error: 'text is required' }, { status: 400 });

	const result = await readMergeWrite<Todo[]>(FILE, [], (current) => {
		const id = Date.now();
		const next: Todo = {
			id,
			text: input.text!,
			category: input.category ?? '',
			priority: input.priority ?? 'medium',
			quadrant: input.quadrant ?? 'q2',
			done: false,
			created: new Date().toISOString()
		};
		return [...current, next];
	});
	return json(result);
}
