import { error } from '@sveltejs/kit';

// ---------------------------------------------------------------------------
// localStorage helpers — generic, no duplication
// ---------------------------------------------------------------------------

export function readStorage<T>(key: string): T | null {
	if (typeof localStorage === 'undefined') return null;
	const raw = localStorage.getItem(key);
	if (!raw) return null;

	try {
		return JSON.parse(raw) as T;
	} catch {
		localStorage.removeItem(key);
		return null;
	}
}

export function writeStorage(key: string, value: unknown): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		error(500, `Cannot write ${key} to local storage`);
	}
}

export function clearStorage(key: string): void {
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem(key);
	}
}
