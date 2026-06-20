import { promises as fs } from 'node:fs';

export async function readMarkdown(file: string): Promise<string | null> {
	try {
		return await fs.readFile(file, 'utf-8');
	} catch (err: unknown) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
		throw err;
	}
}
