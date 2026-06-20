import { json, error } from '@sveltejs/kit';
import { readJson, readMergeWrite } from '$lib/server/jsonStore';
import { paths } from '$lib/server/paths';

interface DiaryEntry {
	date: string;
	content: string;
}

const PEOPLE = [
	'atlas', 'council', 'devil', 'eir', 'forge', 'jed', 'laura',
	'mint', 'muse', 'nova', 'sage', 'scout', 'vera'
];

function fileFor(person: string) {
	if (!PEOPLE.includes(person)) error(404, 'unknown person');
	return paths.output('diary_people', `${person}.json`);
}

export async function GET({ params }) {
	const data = await readJson<DiaryEntry[]>(fileFor(params.person), []);
	return json(data);
}

// Only Jed may write his own diary through the UI; everyone else's diary is
// agent-authored and read-only from the dashboard.
export async function POST({ params, request }) {
	if (params.person !== 'jed') {
		error(403, 'diary write only allowed for jed');
	}
	const entry = (await request.json()) as Partial<DiaryEntry>;
	if (!entry.content) {
		return json({ error: 'content is required' }, { status: 400 });
	}
	const next: DiaryEntry = {
		date: entry.date ?? new Date().toISOString(),
		content: entry.content
	};
	const result = await readMergeWrite<DiaryEntry[]>(
		fileFor('jed'),
		[],
		(current) => [next, ...current]
	);
	return json(result);
}
