import { json, error } from '@sveltejs/kit';
import { recordSubmission, upsertProgress } from '$lib/server/db';
import { getLesson, maxScore } from '$lib/content/lessons';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals, platform }) {
	const db = platform?.env?.DB;
	const user = locals.user;
	if (!db || !user) throw error(401, 'Не авторизован');

	const body = /** @type {any} */ (await request.json().catch(() => null));
	if (!body || typeof body.lessonSlug !== 'string') throw error(400, 'Некорректный запрос');

	const lesson = getLesson(body.lessonSlug);
	if (!lesson) throw error(400, 'Неизвестный урок');

	const max = maxScore(lesson); // авторитетное значение с сервера
	const safeScore = Math.max(0, Math.min(Number(body.score) || 0, max));
	const now = Date.now();

	// Сохраняем попытку (для учителя), если она пришла.
	const sub = body.submission;
	if (sub && typeof sub.exerciseId === 'string') {
		await recordSubmission(db, {
			userId: user.id,
			slug: body.lessonSlug,
			exerciseId: sub.exerciseId,
			passed: Boolean(sub.passed),
			code: String(sub.code ?? '').slice(0, 10000),
			now
		});
	}

	await upsertProgress(db, {
		userId: user.id,
		slug: body.lessonSlug,
		score: safeScore,
		maxScore: max,
		now
	});

	return json({ ok: true, score: safeScore, maxScore: max });
}
