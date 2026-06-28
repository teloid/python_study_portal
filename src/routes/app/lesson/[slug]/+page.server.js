import { error } from '@sveltejs/kit';
import { getLesson, maxScore } from '$lib/content/lessons';
import { getLessonProgress } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals, platform }) {
	const lesson = getLesson(params.slug);
	if (!lesson) throw error(404, 'Такой урок ещё не готов или не найден.');

	const db = platform?.env?.DB;
	let progress = null;
	if (db && locals.user) {
		progress = await getLessonProgress(db, locals.user.id, params.slug);
	}

	return { lesson, progress, maxScore: maxScore(lesson) };
}
