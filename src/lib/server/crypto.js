/**
 * Хеширование паролей и токены сессий для среды Cloudflare Workers.
 * В Workers нет Node `crypto`/`bcrypt`, поэтому используем Web Crypto (SubtleCrypto)
 * с PBKDF2. Cloudflare ограничивает PBKDF2 100 000 итераций — берём этот максимум.
 *
 * Формат хранения пароля: "iterations:saltHex:hashHex".
 */

const ITERATIONS = 100_000; // максимум для subtle PBKDF2 в Cloudflare
const HASH = 'SHA-256';
const KEY_BITS = 256;

const enc = new TextEncoder();

/** @param {ArrayBuffer | Uint8Array} buf */
function toHex(buf) {
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** @param {string} hex */
function fromHex(hex) {
	const out = new Uint8Array(hex.length / 2);
	for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	return out;
}

/**
 * @param {string} password
 * @param {Uint8Array} salt
 * @param {number} iterations
 */
async function deriveHex(password, salt, iterations = ITERATIONS) {
	const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: HASH, salt: /** @type {BufferSource} */ (salt), iterations },
		keyMaterial,
		KEY_BITS
	);
	return toHex(bits);
}

/**
 * Возвращает строку "iterations:saltHex:hashHex" для хранения в users.password.
 * @param {string} password
 */
export async function hashPassword(password) {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const hashHex = await deriveHex(password, salt);
	return `${ITERATIONS}:${toHex(salt)}:${hashHex}`;
}

/**
 * Проверяет пароль против хранимого значения (сравнение в постоянное время).
 * @param {string} password
 * @param {string} stored
 */
export async function verifyPassword(password, stored) {
	const [iterStr, saltHex, hashHex] = String(stored).split(':');
	if (!iterStr || !saltHex || !hashHex) return false;

	const candidateHex = await deriveHex(password, fromHex(saltHex), Number(iterStr));

	const a = fromHex(candidateHex);
	const b = fromHex(hashHex);
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}

/** Непрозрачный токен сессии (32 байта). */
export function genToken() {
	return toHex(crypto.getRandomValues(new Uint8Array(32)));
}
