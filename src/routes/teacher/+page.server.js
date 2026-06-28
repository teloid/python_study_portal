import { listStudentsWithProgress } from '$lib/server/db';
import { CATALOG } from '$lib/content/catalog';
import { isLessonAvailable } from '$lib/content/lessons';

/** @type {import('./$types').PageServerLoad} */
export async function load({ platform }) {
	const db = platform?.env?.DB;
	/** @type {any[]} */
	let students = [];
	if (db) students = await listStudentsWithProgress(db);

	return {
		students,
		availableCount: CATALOG.filter((c) => isLessonAvailable(c.slug)).length,
		totalLessons: CATALOG.length
	};
}
