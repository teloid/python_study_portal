import { error, fail } from '@sveltejs/kit';
import {
	getUserById,
	getProgressForUser,
	getRecentSubmissions,
	resetStudentProgress
} from '$lib/server/db';
import { CATALOG } from '$lib/content/catalog';
import { isLessonAvailable } from '$lib/content/lessons';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, platform }) {
	const db = platform?.env?.DB;
	const id = Number(params.id);
	if (!db || !Number.isFinite(id)) throw error(404, 'Не найдено');

	const student = /** @type {any} */ (await getUserById(db, id));
	if (!student || student.role !== 'student') throw error(404, 'Ученик не найден');

	const rows = await getProgressForUser(db, id);
	/** @type {Record<string, any>} */
	const bySlug = {};
	for (const r of rows) bySlug[String(r.lesson_slug)] = r;

	const lessons = CATALOG.map((c) => ({
		slug: c.slug,
		title: c.title,
		order: c.order,
		topic: c.topic,
		available: isLessonAvailable(c.slug),
		progress: bySlug[c.slug] ?? null
	}));

	/** @type {Record<string, string>} */
	const lessonTitles = {};
	for (const c of CATALOG) lessonTitles[c.slug] = c.title;

	const submissions = await getRecentSubmissions(db, id, 40);

	return { student, lessons, submissions, lessonTitles };
}

/** @type {import('./$types').Actions} */
export const actions = {
	reset: async ({ params, platform, locals }) => {
		const db = platform?.env?.DB;
		const id = Number(params.id);
		// Доступ только учителю (маршрут /teacher уже защищён хуком, но проверим).
		if (!db || locals.user?.role !== 'teacher') return fail(403, { message: 'Нет доступа' });

		const student = /** @type {any} */ (await getUserById(db, id));
		if (!student || student.role !== 'student') return fail(404, { message: 'Ученик не найден' });

		await resetStudentProgress(db, id);
		return { reset: true };
	}
};
