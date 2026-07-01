import { getProgressForUser } from '$lib/server/db';
import { CATALOG, isPracticeUnlocked, baseCompletedCount, BASE_SLUGS } from '$lib/content/catalog';
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

	// Учителю практикумы открыты всегда (для просмотра); ученику — после всех базовых.
	const practiceUnlocked = user?.role === 'teacher' || isPracticeUnlocked(bySlug);

	const lessons = CATALOG.map((c) => ({
		...c,
		available: isLessonAvailable(c.slug),
		// Практикум заблокирован, пока не пройдены все базовые уроки.
		locked: Boolean(c.practice) && !practiceUnlocked,
		progress: bySlug[c.slug] ?? null
	}));

	const baseLessons = lessons.filter((l) => !l.practice);
	const practiceLessons = lessons.filter((l) => l.practice);

	return {
		baseLessons,
		practiceLessons,
		practiceUnlocked,
		baseDone: baseCompletedCount(bySlug),
		baseTotal: BASE_SLUGS.length,
		completedCount: baseLessons.filter((l) => l.progress?.status === 'completed').length,
		availableCount: baseLessons.filter((l) => l.available).length,
		displayName: user?.displayName ?? ''
	};
}
