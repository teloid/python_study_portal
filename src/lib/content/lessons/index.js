/**
 * Реестр готовых уроков (с полным содержимым). Метаданные всех уроков -
 * в catalog.js; здесь подключены те, у кого уже есть теория и упражнения.
 *
 * Чтобы добавить новый урок: создайте файл рядом и подключите его в массив ниже.
 */
import l1 from './hello-python-first-steps.js';
import l2 from './variables-data-types-math.js';
import l3 from './working-with-strings.js';
import l4 from './input-and-f-strings.js';
import l5 from './sql-select-preview.js';
import l6 from './conditionals-if-else.js';
import l7 from './loops-for-while.js';
import l8 from './lists-collections.js';
import l9 from './sql-aggregate-functions.js';
import l10 from './dictionaries-key-value.js';
import l11 from './sql-group-by.js';
import l12 from './functions-basics.js';
import l13 from './sql-simple-join.js';
import l14 from './errors-and-exceptions.js';
import l15 from './capstone-mini-project.js';
import { maxScore } from '../schema.js';

/** @type {import('../schema').Lesson[]} */
const LESSONS = [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15];

/** @type {Map<string, import('../schema').Lesson>} */
export const LESSONS_BY_SLUG = new Map(LESSONS.map((l) => [l.slug, l]));

/** @param {string} slug */
export function getLesson(slug) {
	return LESSONS_BY_SLUG.get(slug) ?? null;
}

/** @param {string} slug */
export function isLessonAvailable(slug) {
	return LESSONS_BY_SLUG.has(slug);
}

export { maxScore };
