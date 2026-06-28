import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load({ locals }) {
	if (locals.user) {
		throw redirect(303, locals.user.role === 'teacher' ? '/teacher' : '/app');
	}
	// Не вошедших — на страницу входа.
	throw redirect(303, '/login');
}
