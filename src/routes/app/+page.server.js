import { getProgressForUser } from '$lib/server/db';
import { CATALOG } from '$lib/content/catalog';
import { isLessonAvailable } from '$lib/content/lessons';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, platform }) {
	const db = platform?.env?.DB;
	const user = locals.user;

	/** @type {any[]} */
	let rows = [];
	if (db && user) rows = await getProgressForUser(db, user.id);

	/** @type {Record<string, any>} */
	const bySlug = {};
	for (const r of rows) bySlug[r.lesson_slug] = r;

	const lessons = CATALOG.map((c) => ({
		...c,
		available: isLessonAvailable(c.slug),
		progress: bySlug[c.slug] ?? null
	}));

	const availableCount = lessons.filter((l) => l.available).length;
	const completedCount = lessons.filter((l) => l.progress?.status === 'completed').length;

	return {
		lessons,
		availableCount,
		completedCount,
		totalCount: CATALOG.length,
		displayName: user?.displayName ?? ''
	};
}
