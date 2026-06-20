import { json } from '@sveltejs/kit';
import { readJson, readMergeWrite } from '$lib/server/jsonStore';
import { paths } from '$lib/server/paths';
import type { GlossaryTerm } from '$lib/types/glossary';

const FILE = paths.output('glossary.json');

export async function GET() {
	const data = await readJson<GlossaryTerm[]>(FILE, []);
	return json(data);
}

export async function POST({ request }) {
	const input = (await request.json()) as Partial<GlossaryTerm>;
	if (!input.term || !input.meaning) {
		return json({ error: 'term and meaning are required' }, { status: 400 });
	}
	const result = await readMergeWrite<GlossaryTerm[]>(FILE, [], (current) => {
		const id = current.length ? Math.max(...current.map((g) => g.id)) + 1 : 1;
		const next: GlossaryTerm = {
			id,
			term: input.term!,
			category: input.category ?? 'General',
			meaning: input.meaning!,
			example: input.example ?? '',
			date_added: new Date().toISOString().slice(0, 10),
			source: input.source ?? 'ถาม Jed ในแชท'
		};
		return [...current, next];
	});
	return json(result);
}
