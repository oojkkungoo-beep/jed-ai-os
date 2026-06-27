import { error } from '@sveltejs/kit';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { paths } from '$lib/server/paths';

const MIME: Record<string, string> = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.ico': 'image/x-icon',
	'.webp': 'image/webp'
};

// Single source of truth: serves images straight from dashboard/images/ on
// disk so both the legacy dashboard and this app always show the same file —
// no more separate copies to keep in sync.
export async function GET({ params }) {
	const filename = params.filename;
	if (!filename || filename.includes('/') || filename.includes('..')) {
		error(400, 'invalid filename');
	}
	const ext = path.extname(filename).toLowerCase();
	const mime = MIME[ext];
	if (!mime) error(400, 'unsupported file type');

	const filePath = path.join(paths.root, 'dashboard', 'images', filename);
	try {
		const data = await fs.readFile(filePath);
		return new Response(data, {
			headers: {
				'Content-Type': mime,
				'Cache-Control': 'no-cache'
			}
		});
	} catch {
		error(404, 'image not found');
	}
}
