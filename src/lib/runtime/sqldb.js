/**
 * Выполнение SQL прямо в браузере через sql.js (SQLite → WebAssembly).
 * Модуль грузится один раз; для каждого упражнения создаётся свежая БД
 * из seedSql, чтобы запросы не влияли друг на друга.
 */
import { browser } from '$app/environment';

/** @type {Promise<any> | null} */
let sqlPromise = null;

export function loadSql() {
	if (!browser) return Promise.reject(new Error('SQL доступен только в браузере'));
	if (!sqlPromise) {
		sqlPromise = (async () => {
			const m = await import('sql.js');
			// sql.js — CommonJS; initSqlJs приходит как default-экспорт или как неймспейс.
			const init = typeof m.default === 'function' ? m.default : /** @type {any} */ (m);
			// .wasm хостим сами в static/ (scripts/copy-sql-wasm.mjs). Скачиваем байты
			// руками и отдаём через wasmBinary: это обходит «угадывание окружения»
			// внутри Emscripten, которое после бандлинга ломает автозагрузку .wasm.
			const wasmBinary = await fetch('/sql-wasm.wasm').then((r) => {
				if (!r.ok) throw new Error('Не удалось загрузить /sql-wasm.wasm');
				return r.arrayBuffer();
			});
			return init({ wasmBinary });
		})();
	}
	return sqlPromise;
}

export function warmupSql() {
	if (browser) loadSql().catch(() => {});
}

/**
 * @typedef {Object} ResultTable
 * @property {string[]} columns
 * @property {any[][]} rows
 */

/**
 * Создаёт БД из seedSql и выполняет запрос. Возвращает таблицы результата
 * (по одной на каждый запрос, вернувший строки).
 * @param {string} seedSql
 * @param {string} query
 * @returns {Promise<{ ok: boolean, tables: ResultTable[], error: string | null }>}
 */
export async function runQuery(seedSql, query) {
	const SQL = await loadSql();
	const db = new SQL.Database();
	try {
		if (seedSql) db.run(seedSql);
		const res = db.exec(query);
		const tables = res.map((/** @type {any} */ t) => ({ columns: t.columns, rows: t.values }));
		return { ok: true, tables, error: null };
	} catch (e) {
		return { ok: false, tables: [], error: /** @type {any} */ (e)?.message ?? String(e) };
	} finally {
		db.close();
	}
}

/**
 * @param {ResultTable} a
 * @param {ResultTable} b
 * @param {boolean} orderMatters
 */
function tablesEqual(a, b, orderMatters) {
	if (a.rows.length !== b.rows.length) return false;
	if (a.columns.length !== b.columns.length) return false;
	const ser = (/** @type {any[][]} */ rows) => rows.map((r) => JSON.stringify(r));
	let ra = ser(a.rows);
	let rb = ser(b.rows);
	if (!orderMatters) {
		ra = [...ra].sort();
		rb = [...rb].sort();
	}
	return ra.every((v, i) => v === rb[i]);
}

/**
 * Проверяет запрос ученика, сравнивая его результат с эталонным запросом
 * на одинаково засеянной БД.
 * @param {string} seedSql
 * @param {string} studentQuery
 * @param {string} expectedQuery
 * @param {boolean} [orderMatters]
 * @returns {Promise<{ passed: boolean, error: string | null, studentTable: ResultTable | null, expectedTable: ResultTable | null }>}
 */
export async function checkQuery(seedSql, studentQuery, expectedQuery, orderMatters = false) {
	const student = await runQuery(seedSql, studentQuery);
	if (!student.ok) {
		return { passed: false, error: student.error, studentTable: null, expectedTable: null };
	}
	const expected = await runQuery(seedSql, expectedQuery);
	const sTable = student.tables[student.tables.length - 1] ?? { columns: [], rows: [] };
	const eTable = expected.tables[expected.tables.length - 1] ?? { columns: [], rows: [] };
	return {
		passed: tablesEqual(sTable, eTable, orderMatters),
		error: null,
		studentTable: sTable,
		expectedTable: eTable
	};
}
