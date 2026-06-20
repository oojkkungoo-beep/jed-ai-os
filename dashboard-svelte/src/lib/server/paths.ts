import { env } from '$env/dynamic/private';
import path from 'node:path';

const ROOT = env.JED_ROOT ?? 'D:/Claude_Cowork/Jed_org';

export const paths = {
	root: ROOT,
	output: (...segments: string[]) => path.join(ROOT, 'output', ...segments),
	claudeOutput: (...segments: string[]) => path.join(ROOT, '.claude', 'output', ...segments),
	team: (file: string) => path.join(ROOT, 'team', file),
	characters: (file: string) => path.join(ROOT, 'characters', file)
};
