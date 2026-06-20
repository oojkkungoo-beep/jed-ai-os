import { error, text } from '@sveltejs/kit';
import { readMarkdown } from '$lib/server/markdown';
import { paths } from '$lib/server/paths';

// agentId must map to an existing team/*.md filename (no path traversal).
const FILE_MAP: Record<string, string> = {
	laura: 'laura.md', muse: 'idea.md', atlas: 'ceo_coach.md', nova: 'life.md',
	eir: 'wellness.md', scout: 'research.md', council: 'council.md', forge: 'forge.md',
	mint: 'finance.md', sage: 'memory_agent.md', vera: 'qa.md', devil: 'devil.md',
	lena: 'librarian.md'
};

export async function GET({ params }) {
	const file = FILE_MAP[params.agentId];
	if (!file) error(404, 'unknown agent');
	const content = await readMarkdown(paths.team(file));
	if (content === null) error(404, 'file not found');
	return text(content);
}
