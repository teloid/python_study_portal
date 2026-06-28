/**
 * Запуск Python прямо в браузере через Pyodide (Python → WebAssembly).
 * Интерпретатор грузится ОДИН раз с CDN и переиспользуется. Для изоляции
 * упражнений каждый запуск получает свежий словарь globals — ничего не «течёт»
 * из предыдущего упражнения.
 */
import { browser } from '$app/environment';

const PYODIDE_VERSION = '314.0.1';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** @type {Promise<any> | null} */
let pyodidePromise = null;
/** @type {((text: string, stream: 'out' | 'err') => void) | null} */
let outSink = null;

/** @param {string} src */
function loadScript(src) {
	return new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = src;
		s.onload = () => resolve(undefined);
		s.onerror = () => reject(new Error('Не удалось загрузить Pyodide с CDN'));
		document.head.appendChild(s);
	});
}

/**
 * Загружает (один раз) интерпретатор Python.
 * @param {(status: string) => void} [onStatus]
 */
export function loadPython(onStatus) {
	if (!browser) return Promise.reject(new Error('Python доступен только в браузере'));
	if (!pyodidePromise) {
		pyodidePromise = (async () => {
			onStatus?.('Загружаем Python (это бывает 1–3 секунды в первый раз)…');
			if (!('loadPyodide' in globalThis)) {
				await loadScript(`${INDEX_URL}pyodide.js`);
			}
			// @ts-ignore — loadPyodide появляется глобально после загрузки скрипта
			const py = await globalThis.loadPyodide({ indexURL: INDEX_URL });
			py.setStdout({ batched: (/** @type {string} */ line) => outSink?.(line + '\n', 'out') });
			py.setStderr({ batched: (/** @type {string} */ line) => outSink?.(line + '\n', 'err') });
			onStatus?.('Python готов!');
			return py;
		})();
	}
	return pyodidePromise;
}

/** Заранее «прогреть» интерпретатор (например, при открытии урока). */
export function warmupPython() {
	if (browser) loadPython().catch(() => {});
}

/**
 * Из многострочного traceback достаём короткую понятную строку ошибки.
 * @param {string} message
 */
function shortError(message) {
	const lines = String(message).trim().split('\n').filter(Boolean);
	return lines[lines.length - 1] || String(message);
}

/**
 * Просто запустить программу ученика и собрать вывод (для «песочницы» и
 * примеров в теории).
 * @param {string} code
 * @param {(text: string, stream: 'out' | 'err') => void} [onOutput]
 * @returns {Promise<{ ok: boolean, error: string | null }>}
 */
export async function runProgram(code, onOutput) {
	const py = await loadPython();
	const ns = py.globals.get('dict')();
	outSink = onOutput ?? null;
	try {
		await py.runPythonAsync(code, { globals: ns });
		return { ok: true, error: null };
	} catch (e) {
		return { ok: false, error: /** @type {any} */ (e)?.message ?? String(e) };
	} finally {
		outSink = null;
		ns.destroy();
	}
}

/**
 * @typedef {Object} TestResult
 * @property {string} name
 * @property {boolean} passed
 * @property {string | null} detail
 */

/**
 * Запускает код ученика, затем прогоняет тесты в ТОЙ ЖЕ области видимости.
 * Тест либо `code` (Python с assert, падает при провале), либо `expectStdout`
 * (сравнение вывода программы со строкой).
 * @param {string} code
 * @param {import('$lib/content/schema').PyTest[]} tests
 * @param {(text: string, stream: 'out' | 'err') => void} [onOutput]
 * @returns {Promise<{ ok: boolean, error: string | null, stdout: string, tests: TestResult[] }>}
 */
export async function runWithTests(code, tests, onOutput) {
	const py = await loadPython();
	const ns = py.globals.get('dict')();
	let buffer = '';
	outSink = (text, stream) => {
		buffer += text;
		onOutput?.(text, stream);
	};

	/** @type {{ ok: boolean, error: string | null, stdout: string, tests: TestResult[] }} */
	const result = { ok: false, error: null, stdout: '', tests: [] };

	try {
		// 1) Код ученика
		try {
			await py.runPythonAsync(code, { globals: ns });
		} catch (e) {
			result.error = /** @type {any} */ (e)?.message ?? String(e);
			result.stdout = buffer;
			return result;
		}
		result.ok = true;
		const studentStdout = buffer;

		// 2) Тесты
		for (const t of tests ?? []) {
			if (t.expectStdout != null) {
				const got = studentStdout.replace(/\s+$/, '');
				const want = String(t.expectStdout).replace(/\s+$/, '');
				const passed = got === want;
				result.tests.push({
					name: t.name,
					passed,
					detail: passed
						? null
						: `Ожидался вывод:\n${want}\n\nА получили:\n${got || '(пусто)'}`
				});
			} else if (t.code) {
				try {
					await py.runPythonAsync(t.code, { globals: ns });
					result.tests.push({ name: t.name, passed: true, detail: null });
				} catch (e) {
					result.tests.push({
						name: t.name,
						passed: false,
						detail: shortError(/** @type {any} */ (e)?.message ?? String(e))
					});
				}
			}
		}
		result.stdout = buffer;
		return result;
	} finally {
		outSink = null;
		ns.destroy();
	}
}
