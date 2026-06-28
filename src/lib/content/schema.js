/**
 * Модель данных урока. Уроки - это обычные JS-модули, описывающие теорию,
 * упражнения и (необязательно) квиз. Этот файл - единый «контракт», на который
 * опираются: реестр уроков, компоненты теории, редактор кода и проверка заданий.
 *
 * Расширение в будущем: добавьте новый файл урока в lib/content/lessons/ и
 * подключите его в lessons/index.js. Больше ничего менять не нужно.
 */

/**
 * @typedef {'beginner'|'intermediate'} Level
 * @typedef {'python'|'sql'} Topic
 */

/**
 * Блок теории. Рендерится последовательно сверху вниз.
 * @typedef {TextBlock | CodeBlock | CalloutBlock} Block
 *
 * @typedef {Object} TextBlock
 * @property {'text'} type
 * @property {string} md   - текст с лёгкой разметкой (см. lib/markdown.js)
 *
 * @typedef {Object} CodeBlock
 * @property {'code'} type
 * @property {Topic} [lang]        - язык подсветки (по умолчанию python)
 * @property {string} code         - исходный код примера
 * @property {string} [caption]    - подпись под примером
 * @property {boolean} [runnable]  - показать кнопку «Запустить» под примером
 * @property {string} [output]     - заранее показанный «ожидаемый вывод»
 *
 * @typedef {Object} CalloutBlock
 * @property {'callout'} type
 * @property {'tip'|'warning'|'info'} variant
 * @property {string} [title]
 * @property {string} md
 */

/**
 * Проверка Python-упражнения. Выполняется ПОСЛЕ кода ученика в той же области
 * видимости (globals), поэтому может вызывать определённые им функции/переменные.
 * Способ 1: `code` - Python-код, который бросает AssertionError при провале.
 * Способ 2: `expectStdout` - сравнить вывод программы со строкой (без учёта
 *           хвостовых пробелов/переводов строк).
 * @typedef {Object} PyTest
 * @property {string} name             - что проверяем (по-русски, для отчёта)
 * @property {string} [code]           - assert-код, например: assert add(2,3)==5, "..."
 * @property {string} [expectStdout]   - ожидаемый вывод программы целиком
 */

/**
 * Проверка SQL-упражнения. Запрос ученика выполняется на БД, собранной из
 * `seedSql`. Затем результат сравнивается с результатом эталонного `expectedQuery`
 * на той же БД (сравниваем строки; порядок учитывается только если orderMatters).
 * @typedef {Object} SqlCheck
 * @property {string} expectedQuery
 * @property {boolean} [orderMatters]
 */

/**
 * Упражнение.
 * @typedef {Object} Exercise
 * @property {string} id               - уникален в пределах урока (a-z0-9-)
 * @property {Topic} lang
 * @property {string} prompt           - формулировка задания (русский, разметка)
 * @property {string} starter          - стартовый код в редакторе
 * @property {string[]} [hints]        - подсказки, открываются по очереди
 * @property {string} [solution]       - эталонное решение (можно подсмотреть)
 * @property {PyTest[]} [tests]        - для lang === 'python'
 * @property {string} [seedSql]        - для lang === 'sql': создание таблиц + данные
 * @property {SqlCheck} [check]        - для lang === 'sql': ожидаемый результат
 */

/**
 * Вопрос квиза (необязательная мини-проверка теории).
 * @typedef {Object} QuizItem
 * @property {string} question
 * @property {string[]} options
 * @property {number} correct - индекс правильного варианта
 * @property {string} [explain] - пояснение, показывается после ответа
 */

/**
 * Урок целиком.
 * @typedef {Object} Lesson
 * @property {string} slug
 * @property {string} title
 * @property {Level} level
 * @property {Topic} topic
 * @property {number} order
 * @property {number} estimatedMinutes
 * @property {string} summary
 * @property {string} emoji            - иконка для карточки урока
 * @property {string[]} goals          - чему научимся (русский)
 * @property {Block[]} theory
 * @property {Exercise[]} exercises
 * @property {QuizItem[]} [quiz]
 */

/**
 * Максимальный балл за урок = число упражнений + число вопросов квиза.
 * @param {Lesson} lesson
 * @returns {number}
 */
export function maxScore(lesson) {
	return (lesson.exercises?.length ?? 0) + (lesson.quiz?.length ?? 0);
}

/**
 * Человекочитаемые подписи уровней/тем для бейджей.
 * @type {Record<string, string>}
 */
export const LEVEL_LABELS = {
	beginner: 'Начальный',
	intermediate: 'Средний'
};

/** @type {Record<string, string>} */
export const TOPIC_LABELS = {
	python: 'Python',
	sql: 'SQL'
};
