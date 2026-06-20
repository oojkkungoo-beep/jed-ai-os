import { json } from '@sveltejs/kit';
import { readJson } from '$lib/server/jsonStore';
import { paths } from '$lib/server/paths';

export async function GET() {
	const data = await readJson(paths.output('diary.json'), []);
	return json(data);
}
