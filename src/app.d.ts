import type { D1Database } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Locals {
			user: {
				id: number;
				username: string;
				displayName: string;
				role: 'teacher' | 'student';
			} | null;
		}

		interface Platform {
			env: {
				DB: D1Database;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
