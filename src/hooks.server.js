import { redirect } from '@sveltejs/kit';
import { getSessionUser, deleteSession } from '$lib/server/db';
import { SESSION_COOKIE } from '$lib/server/session';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.user = null;

	const token = event.cookies.get(SESSION_COOKIE);
	const db = event.platform?.env?.DB;

	if (token && db) {
		const row = await getSessionUser(db, token);
		if (row && Number(row.expires_at) > Date.now()) {
			event.locals.user = {
				id: Number(row.id),
				username: String(row.username),
				displayName: String(row.display_name),
				role: /** @type {'teacher' | 'student'} */ (row.role)
			};
		} else if (row) {
			// Сессия истекла — чистим.
			await deleteSession(db, token);
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
	}

	const { pathname } = event.url;
	const user = event.locals.user;

	// API: при отсутствии входа возвращаем 401 (без редиректа).
	if (pathname.startsWith('/api/')) {
		if (!user) return new Response('Unauthorized', { status: 401 });
	}

	// Учительская зона — только для роли teacher.
	if (pathname.startsWith('/teacher')) {
		if (!user) throw redirect(303, '/login');
		if (user.role !== 'teacher') throw redirect(303, '/app');
	}

	// Кабинет ученика и глоссарий — для любого вошедшего.
	if (pathname.startsWith('/app') || pathname.startsWith('/glossary')) {
		if (!user) throw redirect(303, '/login');
	}

	return resolve(event);
}
