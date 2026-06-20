import { json } from '@sveltejs/kit';
import { readJson, readMergeWrite } from '$lib/server/jsonStore';
import { paths } from '$lib/server/paths';

interface ActivityEntry {
	agent: string;
	action: string;
	time: string;
}

export async function GET() {
	const data = await readJson<ActivityEntry[]>(paths.output('activity.json'), []);
	return json(data);
}

export async function POST({ request }) {
	const entry = (await request.json()) as Partial<ActivityEntry>;
	if (!entry.agent || !entry.action) {
		return json({ error: 'agent and action are required' }, { status: 400 });
	}
	const next: ActivityEntry = {
		agent: entry.agent,
		action: entry.action,
		time: entry.time ?? new Date().toISOString()
	};
	const result = await readMergeWrite<ActivityEntry[]>(
		paths.output('activity.json'),
		[],
		(current) => [next, ...current]
	);
	return json(result);
}
