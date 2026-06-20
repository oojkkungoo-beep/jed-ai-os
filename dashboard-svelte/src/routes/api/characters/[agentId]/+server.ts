import { error, text } from '@sveltejs/kit';
import { readMarkdown } from '$lib/server/markdown';
import { paths } from '$lib/server/paths';

const KNOWN = [
	'laura', 'muse', 'atlas', 'nova', 'eir', 'scout', 'council', 'forge',
	'mint', 'sage', 'vera', 'devil', 'lena', 'jed'
];

export async function GET({ params }) {
	if (!KNOWN.includes(params.agentId)) error(404, 'unknown agent');
	const content = await readMarkdown(paths.characters(`${params.agentId}.md`));
	if (content === null) error(404, 'file not found');
	return text(content);
}
