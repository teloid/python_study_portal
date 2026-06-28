import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/db';
import { SESSION_COOKIE } from '$lib/server/session';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, platform }) {
	const token = cookies.get(SESSION_COOKIE);
	const db = platform?.env?.DB;
	if (token && db) await deleteSession(db, token);
	cookies.delete(SESSION_COOKIE, { path: '/' });
	throw redirect(303, '/login');
}
