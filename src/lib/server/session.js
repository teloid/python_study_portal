/** Имя cookie и параметры сессии — в одном месте, чтобы вход/выход/хук совпадали. */
export const SESSION_COOKIE = 'session';
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 дней

/**
 * @param {number} [maxAgeMs]
 * @returns {import('@sveltejs/kit').Cookies extends { set: (n: string, v: string, o: infer O) => any } ? O : any}
 */
export function sessionCookieOptions(maxAgeMs = SESSION_TTL_MS) {
	return {
		path: '/',
		httpOnly: true,
		secure: true, // на localhost SvelteKit сам ослабит до false
		sameSite: 'lax',
		maxAge: Math.floor(maxAgeMs / 1000)
	};
}
