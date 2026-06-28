/**
 * Глоссарий встроенных функций, методов и ключевых слов — с русским
 * произношением и объяснением, ОТКУДА взялось английское название.
 * Данные лежат в glossary.json; здесь — удобные структуры для поиска и подсветки.
 *
 * @typedef {Object} GlossaryEntry
 * @property {string} name
 * @property {'builtin'|'method'|'keyword'|'operator'|'sql'} category
 * @property {string} en_word
 * @property {string} ru_pronunciation
 * @property {string} ru_meaning
 * @property {string} ru_explanation
 * @property {string} [example_code]
 */

import entries from './glossary.json';

export const GLOSSARY = /** @type {GlossaryEntry[]} */ (entries);

/** Map по имени (ключи и в исходном регистре, и в нижнем — для удобного поиска). */
export const GLOSSARY_BY_NAME = new Map();
for (const e of GLOSSARY) {
	GLOSSARY_BY_NAME.set(e.name, e);
	GLOSSARY_BY_NAME.set(e.name.toLowerCase(), e);
}

/** Множество ключей для подсветки терминов в тексте теории. */
export const GLOSSARY_KEYS = new Set(GLOSSARY.map((e) => e.name));

/** @param {string} name */
export function lookup(name) {
	if (!name) return null;
	return GLOSSARY_BY_NAME.get(name) ?? GLOSSARY_BY_NAME.get(name.toLowerCase()) ?? null;
}

/** @type {Record<string, string>} */
export const CATEGORY_LABELS = {
	builtin: 'Встроенные функции',
	method: 'Методы',
	keyword: 'Ключевые слова',
	operator: 'Операторы',
	sql: 'SQL'
};

export const CATEGORY_ORDER = ['builtin', 'method', 'keyword', 'operator', 'sql'];
