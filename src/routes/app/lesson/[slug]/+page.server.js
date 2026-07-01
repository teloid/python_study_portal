import { error, redirect } from '@sveltejs/kit';
import { getLesson, maxScore } from '$lib/content/lessons';
import { getLessonProgress, getProgressForUser } from '$lib/server/db';
import { CATALOG_BY_SLUG, isPracticeUnlocked } from '$lib/content/catalog';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals, platform }) {
	const lesson = getLesson(params.slug);
	if (!lesson) throw error(404, 'Такой урок ещё не готов или не найден.');

	const db = platform?.env?.DB;
	const isPractice = Boolean(CATALOG_BY_SLUG.get(params.slug)?.practice);
	let progress = null;

	if (db && locals.user) {
		// Практикум для ученика доступен только после всех базовых уроков.
		// Учитель может открывать практикумы всегда (для просмотра).
		if (isPractice && locals.user.role !== 'teacher') {
			const rows = await getProgressForUser(db, locals.user.id);
			/** @type {Record<string, any>} */
			const bySlug = {};
			for (const r of rows) bySlug[String(r.lesson_slug)] = r;
			if (!isPracticeUnlocked(bySlug)) throw redirect(303, '/app');
			progress = bySlug[params.slug] ?? null;
		} else {
			progress = await getLessonProgress(db, locals.user.id, params.slug);
		}
	}

	return { lesson, progress, maxScore: maxScore(lesson) };
}
