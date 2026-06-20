import { writable, type Writable } from 'svelte/store';

export interface PollingStore<T> {
	data: Writable<T>;
	loading: Writable<boolean>;
	error: Writable<string | null>;
	lastUpdated: Writable<Date | null>;
	start: () => void;
	stop: () => void;
	refreshNow: () => Promise<void>;
}

export function createPollingStore<T>(
	endpoint: string,
	initial: T,
	intervalMs = 5000
): PollingStore<T> {
	const data = writable<T>(initial);
	const loading = writable(false);
	const error = writable<string | null>(null);
	const lastUpdated = writable<Date | null>(null);

	let timer: ReturnType<typeof setInterval> | null = null;

	async function fetchOnce() {
		loading.set(true);
		try {
			const res = await fetch(endpoint, { cache: 'no-store' });
			if (!res.ok) throw new Error(`${endpoint} → HTTP ${res.status}`);
			const json = (await res.json()) as T;
			data.set(json);
			error.set(null);
			lastUpdated.set(new Date());
		} catch (err) {
			error.set(err instanceof Error ? err.message : 'unknown error');
		} finally {
			loading.set(false);
		}
	}

	function onVisibilityChange() {
		if (typeof document === 'undefined') return;
		if (document.visibilityState === 'hidden') {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		} else if (!timer) {
			fetchOnce();
			timer = setInterval(fetchOnce, intervalMs);
		}
	}

	function start() {
		fetchOnce();
		if (timer) clearInterval(timer);
		timer = setInterval(fetchOnce, intervalMs);
		if (typeof document !== 'undefined') {
			document.addEventListener('visibilitychange', onVisibilityChange);
		}
	}

	function stop() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', onVisibilityChange);
		}
	}

	return { data, loading, error, lastUpdated, start, stop, refreshNow: fetchOnce };
}
