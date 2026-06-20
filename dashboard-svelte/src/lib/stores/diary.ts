import { writable, get } from 'svelte/store';
import type { DiaryEntry } from '$lib/types/diary';

const PEOPLE = [
	'jed', 'laura', 'muse', 'atlas', 'nova', 'eir', 'scout', 'council',
	'forge', 'mint', 'sage', 'vera', 'devil', 'lena'
];

export const diaryByPerson = writable<Record<string, DiaryEntry[]>>({});
export const selectedPerson = writable<string>('jed');
export const diaryLoading = writable(false);

let timer: ReturnType<typeof setInterval> | null = null;

async function fetchAll() {
	diaryLoading.set(true);
	const results = await Promise.all(
		PEOPLE.map(async (person) => {
			try {
				const res = await fetch(`/api/diary/${person}`, { cache: 'no-store' });
				if (!res.ok) return [person, []] as const;
				return [person, (await res.json()) as DiaryEntry[]] as const;
			} catch {
				return [person, []] as const;
			}
		})
	);
	diaryByPerson.set(Object.fromEntries(results));
	diaryLoading.set(false);
}

export function startDiaryPolling(intervalMs = 5000) {
	fetchAll();
	if (timer) clearInterval(timer);
	timer = setInterval(fetchAll, intervalMs);
}
export function stopDiaryPolling() {
	if (timer) clearInterval(timer);
	timer = null;
}

export async function addJedDiaryEntry(content: string) {
	await fetch('/api/diary/jed', { method: 'POST', body: JSON.stringify({ content }) });
	await fetchAll();
}

export { PEOPLE };
