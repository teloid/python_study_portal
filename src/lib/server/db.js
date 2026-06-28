/**
 * Тонкие помощники над Cloudflare D1. Все функции принимают `db`
 * (это platform.env.DB) первым аргументом.
 *
 * @typedef {import('@cloudflare/workers-types').D1Database} D1Database
 */

/* ----------------------------- Пользователи ----------------------------- */

/**
 * @param {D1Database} db
 * @param {string} username
 */
export function getUserByUsername(db, username) {
	return db
		.prepare('SELECT id, username, password, display_name, role FROM users WHERE username = ?')
		.bind(username)
		.first();
}

/**
 * @param {D1Database} db
 * @param {number} id
 */
export function getUserById(db, id) {
	return db
		.prepare('SELECT id, username, display_name, role, created_at FROM users WHERE id = ?')
		.bind(id)
		.first();
}

/* -------------------------------- Сессии -------------------------------- */

/**
 * @param {D1Database} db
 * @param {number} userId
 * @param {string} token
 * @param {number} expiresAt
 */
export function createSession(db, userId, token, expiresAt) {
	return db
		.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
		.bind(token, userId, expiresAt)
		.run();
}

/**
 * Возвращает пользователя по токену сессии (или null, если токен невалиден).
 * @param {D1Database} db
 * @param {string} token
 */
export function getSessionUser(db, token) {
	return db
		.prepare(
			`SELECT u.id, u.username, u.display_name, u.role, s.expires_at
			   FROM sessions s
			   JOIN users u ON u.id = s.user_id
			  WHERE s.token = ?`
		)
		.bind(token)
		.first();
}

/**
 * @param {D1Database} db
 * @param {string} token
 */
export function deleteSession(db, token) {
	return db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}

/* -------------------------------- Прогресс ------------------------------- */

/**
 * Весь прогресс ученика (по всем урокам).
 * @param {D1Database} db
 * @param {number} userId
 */
export async function getProgressForUser(db, userId) {
	const { results } = await db
		.prepare(
			`SELECT lesson_slug, status, score, max_score, completed_at, updated_at
			   FROM progress WHERE user_id = ?`
		)
		.bind(userId)
		.all();
	return results ?? [];
}

/**
 * Прогресс по одному уроку.
 * @param {D1Database} db
 * @param {number} userId
 * @param {string} slug
 */
export function getLessonProgress(db, userId, slug) {
	return db
		.prepare(
			`SELECT lesson_slug, status, score, max_score, completed_at
			   FROM progress WHERE user_id = ? AND lesson_slug = ?`
		)
		.bind(userId, slug)
		.first();
}

/**
 * Создаёт/обновляет строку прогресса. status вычисляется из score/maxScore.
 * @param {D1Database} db
 * @param {{ userId: number, slug: string, score: number, maxScore: number, now: number }} p
 */
export function upsertProgress(db, { userId, slug, score, maxScore, now }) {
	const completed = maxScore > 0 && score >= maxScore;
	const status = completed ? 'completed' : 'in_progress';
	const completedAt = completed ? now : null;
	return db
		.prepare(
			`INSERT INTO progress (user_id, lesson_slug, status, score, max_score, completed_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?)
			 ON CONFLICT(user_id, lesson_slug) DO UPDATE SET
			   status = excluded.status,
			   score = MAX(progress.score, excluded.score),
			   max_score = excluded.max_score,
			   completed_at = COALESCE(progress.completed_at, excluded.completed_at),
			   updated_at = excluded.updated_at`
		)
		.bind(userId, slug, status, score, maxScore, completedAt, now)
		.run();
}

/* ------------------------------- Попытки -------------------------------- */

/**
 * @param {D1Database} db
 * @param {{ userId: number, slug: string, exerciseId: string, passed: boolean, code: string, now: number }} s
 */
export function recordSubmission(db, { userId, slug, exerciseId, passed, code, now }) {
	return db
		.prepare(
			`INSERT INTO submissions (user_id, lesson_slug, exercise_id, passed, code, created_at)
			 VALUES (?, ?, ?, ?, ?, ?)`
		)
		.bind(userId, slug, exerciseId, passed ? 1 : 0, code, now)
		.run();
}

/**
 * Последние попытки ученика (для дашборда учителя).
 * @param {D1Database} db
 * @param {number} userId
 * @param {number} [limit]
 */
export async function getRecentSubmissions(db, userId, limit = 50) {
	const { results } = await db
		.prepare(
			`SELECT lesson_slug, exercise_id, passed, code, created_at
			   FROM submissions WHERE user_id = ?
			  ORDER BY created_at DESC LIMIT ?`
		)
		.bind(userId, limit)
		.all();
	return results ?? [];
}

/**
 * Полностью сбрасывает прогресс ученика: удаляет его прогресс по урокам и все
 * попытки. Сам пользователь и его вход остаются.
 * @param {D1Database} db
 * @param {number} userId
 */
export function resetStudentProgress(db, userId) {
	return db.batch([
		db.prepare('DELETE FROM progress WHERE user_id = ?').bind(userId),
		db.prepare('DELETE FROM submissions WHERE user_id = ?').bind(userId)
	]);
}

/* --------------------------- Учительские выборки ------------------------- */

/**
 * Список учеников с агрегированным прогрессом.
 * @param {D1Database} db
 */
export async function listStudentsWithProgress(db) {
	const { results } = await db
		.prepare(
			`SELECT u.id, u.username, u.display_name, u.created_at,
			        COUNT(p.lesson_slug) AS started,
			        SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) AS completed,
			        MAX(p.updated_at) AS last_active
			   FROM users u
			   LEFT JOIN progress p ON p.user_id = u.id
			  WHERE u.role = 'student'
			  GROUP BY u.id
			  ORDER BY last_active DESC NULLS LAST, u.display_name`
		)
		.all();
	return results ?? [];
}
