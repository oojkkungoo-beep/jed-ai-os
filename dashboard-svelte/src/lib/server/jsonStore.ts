import { promises as fs } from 'node:fs';
import path from 'node:path';

// Per-file in-memory promise queue: serializes writes to the same file from
// concurrent requests handled by this process. Does not protect against
// writes from external agents/scripts outside this process — see
// readMergeWrite() below, which re-reads fresh state before applying changes
// to reduce (not eliminate) lost-update races with those external writers.
const queues = new Map<string, Promise<unknown>>();

function enqueue<T>(file: string, task: () => Promise<T>): Promise<T> {
	const prev = queues.get(file) ?? Promise.resolve();
	const next = prev.then(task, task);
	queues.set(
		file,
		next.catch(() => undefined)
	);
	return next;
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
	try {
		const raw = await fs.readFile(file, 'utf-8');
		return JSON.parse(raw) as T;
	} catch (err: unknown) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') return fallback;
		throw err;
	}
}

export async function getMtime(file: string): Promise<number | null> {
	try {
		const stat = await fs.stat(file);
		return stat.mtimeMs;
	} catch {
		return null;
	}
}

async function atomicWrite(file: string, data: unknown): Promise<void> {
	const tmp = path.join(path.dirname(file), `.${path.basename(file)}.tmp-${process.pid}-${Date.now()}`);
	await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
	await fs.rename(tmp, file);
}

/**
 * Read-merge-write: re-reads the file fresh inside the per-file queue (so it
 * sees writes made by earlier queued requests, and is reasonably fresh vs.
 * external writers too) then applies `mutate` to the latest array/object
 * before writing. Use this instead of writing a client-supplied snapshot.
 */
export function readMergeWrite<T>(
	file: string,
	fallback: T,
	mutate: (current: T) => T
): Promise<T> {
	return enqueue(file, async () => {
		const current = await readJson<T>(file, fallback);
		const next = mutate(current);
		await atomicWrite(file, next);
		return next;
	});
}

export function writeJsonAtomic(file: string, data: unknown): Promise<void> {
	return enqueue(file, () => atomicWrite(file, data));
}
