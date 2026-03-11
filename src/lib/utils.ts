import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Converts a string from lowerCamelCase to normal text with the first letter capitalized
 * @param text - The text in lowerCamelCase format
 * @returns The converted text (e.g., "firstName" -> "First name")
 */
export function camelCaseToNormalText(text: string): string {
	if (!text) return '';
	const result = text
		.replace(/([A-Z])/g, ' $1')
		.toLowerCase()
		.trim();
	return result.charAt(0).toUpperCase() + result.slice(1);
}
