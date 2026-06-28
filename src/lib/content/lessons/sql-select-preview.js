// Общие данные для всех упражнений урока: таблица котов.
// Раннер создаёт свежую базу из этого seed перед каждым запросом.
const SEED = `
CREATE TABLE cats (
  id     INTEGER,
  name   TEXT,
  age    INTEGER,
  color  TEXT,
  weight REAL
);
INSERT INTO cats (id, name, age, color, weight) VALUES
  (1, 'Барсик', 3, 'рыжий',  4.5),
  (2, 'Мурка',  5, 'серый',  3.8),
  (3, 'Симба',  1, 'рыжий',  2.9),
  (4, 'Туман',  7, 'серый',  5.2),
  (5, 'Луна',   2, 'чёрный', 3.1),
  (6, 'Рекс',   4, 'белый',  4.0);
`;

/** @type {import('../schema').Lesson} */
export default {
	slug: 'sql-select-preview',
	title: 'Знакомство с базами данных: первый SELECT',
	level: 'beginner',
	topic: 'sql',
	order: 5,
	estimatedMinutes: 45,
	emoji: '🗄️',
	summary:
		'Раннее превью мира баз данных. Делаем первые запросы прямо в браузере: достаём строки таблицы, фильтруем через WHERE, сортируем ORDER BY и ограничиваем LIMIT. Сложного пока не нужно — главное почувствовать SQL.',
	goals: [
		'Понять, что такое таблица, строка и столбец',
		'Написать запрос SELECT и выбрать нужные столбцы',
		'Отфильтровать строки с помощью WHERE',
		'Отсортировать результат через ORDER BY',
		'Ограничить количество строк через LIMIT'
	],

	theory: [
		{
			type: 'text',
			md: 'База данных — это место, где аккуратно хранят информацию. Главная её единица — **таблица**. Таблица похожа на лист Excel: есть **столбцы** (например «имя», «возраст») и **строки** (по одной на каждый объект). Чтобы доставать данные из таблицы, используют язык **SQL**.'
		},
		{
			type: 'text',
			md: 'Мы будем работать с таблицей `cats` (коты). Вот что в ней лежит:'
		},
		{
			type: 'code',
			lang: 'sql',
			caption: 'Таблица cats',
			code: 'id | name   | age | color  | weight\n---+--------+-----+--------+-------\n 1 | Барсик |  3  | рыжий  |  4.5\n 2 | Мурка  |  5  | серый  |  3.8\n 3 | Симба  |  1  | рыжий  |  2.9\n 4 | Туман  |  7  | серый  |  5.2\n 5 | Луна   |  2  | чёрный |  3.1\n 6 | Рекс   |  4  | белый  |  4.0'
		},
		{
			type: 'text',
			md: 'Главная команда SQL — `SELECT` (выбрать). Она говорит «выбери такие-то столбцы», а `FROM` (из) — «из такой-то таблицы». Звёздочка `*` означает «все столбцы»:'
		},
		{
			type: 'code',
			lang: 'sql',
			code: 'SELECT * FROM cats;',
			caption: 'Выбрать все столбцы и все строки таблицы cats'
		},
		{
			type: 'text',
			md: 'Можно выбрать только нужные столбцы — просто перечислите их через запятую:'
		},
		{
			type: 'code',
			lang: 'sql',
			code: 'SELECT name, age FROM cats;',
			caption: 'Только имя и возраст'
		},
		{
			type: 'text',
			md: 'Чтобы взять не все строки, а только подходящие, добавляют `WHERE` (где) с условием. Например, только серые коты:'
		},
		{
			type: 'code',
			lang: 'sql',
			code: "SELECT name FROM cats WHERE color = 'серый';",
			caption: 'Имена котов серого цвета. Текст в SQL — в одинарных кавычках!'
		},
		{
			type: 'callout',
			variant: 'info',
			title: 'Сравнения в WHERE',
			md: 'В условии можно сравнивать: `age > 3` (старше трёх), `age < 2`, `age = 5` (ровно пять — в SQL равенство это один знак `=`, а не два), `weight >= 4.0`. Текст сравнивают так: `color = \'рыжий\'`.'
		},
		{
			type: 'text',
			md: 'Результат можно отсортировать через `ORDER BY` (упорядочить по). По умолчанию — от меньшего к большему; добавьте `DESC` для обратного порядка. А `LIMIT` ограничивает число строк:'
		},
		{
			type: 'code',
			lang: 'sql',
			code: 'SELECT name, age FROM cats ORDER BY age DESC LIMIT 3;',
			caption: 'Три самых старших кота: сортируем по возрасту по убыванию и берём 3 строки'
		},
		{
			type: 'callout',
			variant: 'tip',
			title: 'А как это из Python?',
			md: 'В настоящем коде на Python к базе SQLite подключаются через модуль `sqlite3`, а сам SQL-запрос остаётся точно таким же:\n\n```\nimport sqlite3\nconn = sqlite3.connect("cats.db")\ncur = conn.cursor()\ncur.execute("SELECT name FROM cats WHERE age > 3")\nprint(cur.fetchall())\n```\n\nЗдесь же, в портале, мы пишем только сам SQL-запрос — чтобы сосредоточиться на главном.'
		}
	],

	exercises: [
		{
			id: 'select-all',
			lang: 'sql',
			prompt:
				'Выведите **всю** таблицу `cats` целиком — все столбцы и все строки. Подсказка: звёздочка `*` означает «все столбцы».',
			starter: 'SELECT ',
			hints: [
				'Нужны все столбцы — используйте звёздочку *',
				'Не забудьте указать, ИЗ какой таблицы брать данные: FROM cats',
				'Полный запрос: SELECT * FROM cats;'
			],
			solution: 'SELECT * FROM cats;',
			seedSql: SEED,
			check: { expectedQuery: 'SELECT * FROM cats;', orderMatters: false }
		},
		{
			id: 'where-older-than-3',
			lang: 'sql',
			prompt:
				'Выберите **имена** (столбец `name`) всех котов, которым **больше 3 лет** (возраст в столбце `age`). Должно получиться 3 кота.',
			starter: 'SELECT name FROM cats\n',
			hints: [
				'Фильтр строк добавляется через WHERE.',
				'«Больше 3» — это условие age > 3',
				'SELECT name FROM cats WHERE age > 3;'
			],
			solution: 'SELECT name FROM cats WHERE age > 3;',
			seedSql: SEED,
			check: { expectedQuery: 'SELECT name FROM cats WHERE age > 3;', orderMatters: false }
		},
		{
			id: 'order-limit-youngest',
			lang: 'sql',
			prompt:
				'Найдите **трёх самых молодых** котов. Выведите столбцы `name` и `age`, отсортируйте по возрасту **от меньшего к большему** и оставьте только первые 3 строки.',
			starter: 'SELECT name, age FROM cats\n',
			hints: [
				'Сортировка — через ORDER BY age (по умолчанию по возрастанию).',
				'Ограничить три строки — через LIMIT 3.',
				'SELECT name, age FROM cats ORDER BY age LIMIT 3;'
			],
			solution: 'SELECT name, age FROM cats ORDER BY age LIMIT 3;',
			seedSql: SEED,
			check: { expectedQuery: 'SELECT name, age FROM cats ORDER BY age LIMIT 3;', orderMatters: true }
		}
	],

	quiz: [
		{
			question: 'Какое ключевое слово выбирает данные из таблицы?',
			options: ['GET', 'SELECT', 'SHOW', 'FIND'],
			correct: 1,
			explain: 'SELECT (от «выбирать») — основная команда чтения данных в SQL.'
		},
		{
			question: 'Что делает WHERE в запросе?',
			options: [
				'Сортирует строки',
				'Оставляет только строки, подходящие под условие',
				'Соединяет таблицы',
				'Ограничивает число строк'
			],
			correct: 1,
			explain: 'WHERE отбирает строки по условию, например age > 3.'
		},
		{
			question: 'Как отсортировать результат по столбцу age по убыванию?',
			options: ['ORDER BY age', 'ORDER BY age DESC', 'SORT age DOWN', 'LIMIT age'],
			correct: 1,
			explain: 'ORDER BY age задаёт сортировку, а DESC меняет её на убывание (от большего к меньшему).'
		}
	]
};
