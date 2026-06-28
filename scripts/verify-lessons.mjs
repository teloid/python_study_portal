#!/usr/bin/env node
/**
 * Проверяет, что во ВСЕХ уроках эталонные решения (solution) реально проходят
 * свои проверки:
 *   - Python: запускает solution + каждый тест через python3 (assert) или
 *     сравнивает вывод (expectStdout).
 *   - SQL: через sql.js сравнивает результат solution с expectedQuery на seedSql.
 *
 * Запуск:  node scripts/verify-lessons.mjs
 * Требуется установленный python3 и зависимость sql.js.
 */
import { execFileSync } from 'node:child_process';
import initSqlJs from 'sql.js';

const { LESSONS_BY_SLUG } = await import('../src/lib/content/lessons/index.js');
const SQL = await initSqlJs();

const rstrip = (s) => String(s).replace(/\s+$/, '');
let failures = 0;
let checks = 0;

/** Python: вернуть {ok, err} */
function runPython(code) {
	try {
		const stdout = execFileSync('python3', ['-c', code], {
			encoding: 'utf8',
			timeout: 15000,
			stdio: ['ignore', 'pipe', 'pipe']
		});
		return { ok: true, stdout };
	} catch (e) {
		const msg = (e.stderr || e.stdout || e.message || '').toString();
		return { ok: false, stdout: e.stdout?.toString() ?? '', err: msg.trim().split('\n').pop() };
	}
}

function tablesEqual(a, b, orderMatters) {
	if (a.length !== b.length) return false;
	const ser = (rows) => rows.map((r) => JSON.stringify(r));
	let ra = ser(a);
	let rb = ser(b);
	if (!orderMatters) {
		ra = [...ra].sort();
		rb = [...rb].sort();
	}
	return ra.every((v, i) => v === rb[i]);
}

function sqlRows(seed, query) {
	const db = new SQL.Database();
	try {
		if (seed) db.run(seed);
		const res = db.exec(query);
		const last = res[res.length - 1];
		return { ok: true, rows: last ? last.values : [] };
	} catch (e) {
		return { ok: false, err: e.message };
	} finally {
		db.close();
	}
}

for (const [slug, lesson] of LESSONS_BY_SLUG) {
	for (const ex of lesson.exercises ?? []) {
		const tag = `${slug} / ${ex.id}`;
		if (ex.lang === 'python') {
			const tests = ex.tests ?? [];
			if (tests.length === 0) {
				console.log(`⚠️  ${tag}: нет тестов`);
				continue;
			}
			for (const t of tests) {
				checks++;
				if (t.expectStdout != null) {
					const r = runPython(ex.solution);
					if (!r.ok) {
						failures++;
						console.log(`❌ ${tag} [${t.name}]: solution упал -> ${r.err}`);
					} else if (rstrip(r.stdout) !== rstrip(t.expectStdout)) {
						failures++;
						console.log(
							`❌ ${tag} [${t.name}]: вывод не совпал\n   ожидали: ${JSON.stringify(rstrip(t.expectStdout))}\n   получили: ${JSON.stringify(rstrip(r.stdout))}`
						);
					}
				} else if (t.code) {
					const r = runPython(ex.solution + '\n' + t.code);
					if (!r.ok) {
						failures++;
						console.log(`❌ ${tag} [${t.name}]: ${r.err}`);
					}
				}
			}
		} else if (ex.lang === 'sql') {
			checks++;
			const seed = ex.seedSql ?? '';
			const student = sqlRows(seed, ex.solution);
			const expected = sqlRows(seed, ex.check?.expectedQuery ?? '');
			if (!student.ok) {
				failures++;
				console.log(`❌ ${tag}: solution-запрос упал -> ${student.err}`);
			} else if (!expected.ok) {
				failures++;
				console.log(`❌ ${tag}: expectedQuery упал -> ${expected.err}`);
			} else if (!tablesEqual(student.rows, expected.rows, ex.check?.orderMatters ?? false)) {
				failures++;
				console.log(
					`❌ ${tag}: результат solution != expectedQuery\n   solution: ${JSON.stringify(student.rows)}\n   expected: ${JSON.stringify(expected.rows)}`
				);
			}
		}
	}
}

console.log(
	`\n${failures === 0 ? '✅' : '❌'} Проверок: ${checks}, провалов: ${failures}, уроков: ${LESSONS_BY_SLUG.size}`
);
process.exit(failures === 0 ? 0 : 1);
