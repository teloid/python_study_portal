import { fail, redirect } from '@sveltejs/kit';
import { getUserByUsername, createSession } from '$lib/server/db';
import { verifyPassword, genToken } from '$lib/server/crypto';
import { SESSION_COOKIE, SESSION_TTL_MS, sessionCookieOptions } from '$lib/server/session';

/** @type {import('./$types').PageServerLoad} */
export function load({ locals }) {
	if (locals.user) {
		throw redirect(303, locals.user.role === 'teacher' ? '/teacher' : '/app');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies, platform }) => {
		const db = platform?.env?.DB;
		const form = await request.formData();
		const username = String(form.get('username') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!db) return fail(500, { message: 'База данных недоступна. Проверьте настройку D1.', username });
		if (!username || !password) {
			return fail(400, { message: 'Введите логин и пароль.', username });
		}

		const user = /** @type {any} */ (await getUserByUsername(db, username));
		if (!user || !(await verifyPassword(password, user.password))) {
			return fail(401, { message: 'Неверный логин или пароль.', username });
		}

		const token = genToken();
		await createSession(db, user.id, token, Date.now() + SESSION_TTL_MS);
		cookies.set(SESSION_COOKIE, token, sessionCookieOptions());

		throw redirect(303, user.role === 'teacher' ? '/teacher' : '/app');
	}
};
