/** @type {import('../schema').Lesson} */
export default {
	"slug": "sql-aggregate-functions",
	"title": "Считаем по базе: COUNT, SUM, AVG, MIN, MAX",
	"level": "intermediate",
	"topic": "sql",
	"order": 9,
	"estimatedMinutes": 50,
	"emoji": "🧮",
	"summary": "Учимся получать из базы не отдельные строки, а итоговые числа: количество (COUNT), сумму (SUM), среднее (AVG), минимум (MIN) и максимум (MAX).",
	"goals": [
		"Понять, что такое агрегатная функция",
		"Посчитать количество строк через COUNT()",
		"Найти сумму и среднее через SUM() и AVG()",
		"Найти минимум и максимум через MIN() и MAX()",
		"Сочетать агрегаты с WHERE"
	],
	"theory": [
		{
			"type": "text",
			"md": "До сих пор `SELECT` доставал нам **строки** из таблицы. А что если нужно не сами строки, а **число про них целиком**? Например: сколько всего товаров? Какая средняя цена? Самый дорогой товар? Для этого в SQL есть **агрегатные функции** - они собирают много строк в одно итоговое значение."
		},
		{
			"type": "text",
			"md": "В этом уроке мы разберём пять самых важных:\n- `COUNT` - сколько строк (посчитать количество)\n- `SUM` - сумма значений в столбце\n- `AVG` - среднее значение (average)\n- `MIN` - самое маленькое значение\n- `MAX` - самое большое значение"
		},
		{
			"type": "text",
			"md": "Будем работать с таблицей `products` - это товары в небольшом магазине. У каждого товара есть `id`, название `name`, цена `price`, категория `category` и признак `in_stock` (1 - есть в наличии, 0 - закончился). Вот так выглядят данные:"
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "id | name              | price | category  | in_stock\n1  | Молоко            | 80    | Молочное  | 1\n2  | Сыр Российский    | 450   | Молочное  | 1\n3  | Хлеб бородинский  | 55    | Выпечка   | 1\n4  | Батон нарезной    | 40    | Выпечка   | 0\n5  | Кофе арабика      | 690   | Напитки   | 1\n...",
			"caption": "Так выглядит содержимое таблицы products. Всего в ней 10 товаров разных категорий."
		},
		{
			"type": "text",
			"md": "**Считаем количество строк: `COUNT`.** Чаще всего пишут `COUNT(*)` - это значит \"посчитай все строки\". Запрос вернёт одно число."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT COUNT(*) FROM products;",
			"caption": "Сколько всего товаров в таблице. Результат: одна строка с числом 10."
		},
		{
			"type": "text",
			"md": "**Сумма и среднее: `SUM` и `AVG`.** В скобках указываем столбец с числами. `SUM(price)` сложит все цены, а `AVG(price)` посчитает среднюю цену."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT SUM(price) FROM products;\nSELECT AVG(price) FROM products;",
			"caption": "Первый запрос вернёт сумму всех цен (1960), второй - среднюю цену (196.0)."
		},
		{
			"type": "text",
			"md": "**Минимум и максимум: `MIN` и `MAX`.** Они находят самое маленькое и самое большое значение в столбце. Работают и с числами, и с текстом (для текста - по алфавиту)."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT MIN(price) FROM products;\nSELECT MAX(price) FROM products;",
			"caption": "MIN вернёт самую низкую цену (40), MAX - самую высокую (690)."
		},
		{
			"type": "callout",
			"variant": "tip",
			"title": "Считаем не всё, а только нужное",
			"md": "Агрегатные функции отлично дружат с `WHERE`. Сначала `WHERE` отбирает подходящие строки, а потом функция считает уже только по ним. Например, средняя цена только напитков:\n```\nSELECT AVG(price) FROM products WHERE category = 'Напитки';\n```\nЗдесь среднее посчитается лишь по строкам, где категория равна `Напитки`."
		},
		{
			"type": "callout",
			"variant": "info",
			"title": "Можно посчитать сразу несколько",
			"md": "В одном `SELECT` разрешено перечислить несколько функций через запятую - получится одна строка с несколькими столбцами:\n```\nSELECT MIN(price), MAX(price), AVG(price) FROM products;\n```\nУдобно, когда нужна сводка: самый дешёвый, самый дорогой и средняя цена сразу."
		},
		{
			"type": "callout",
			"variant": "warning",
			"title": "Текстовые значения - в одинарных кавычках",
			"md": "В `WHERE` названия категорий и любой текст пишем в **одинарных** кавычках: `WHERE category = 'Напитки'`. Двойные кавычки в SQLite означают совсем другое (имя столбца), поэтому легко получить ошибку. Запомни: текст - всегда в одинарных кавычках."
		},
		{
			"type": "text",
			"md": "Итог: агрегатные функции превращают целый столбец в одно итоговое значение. `COUNT` - количество, `SUM` - сумма, `AVG` - среднее, `MIN` и `MAX` - крайние значения. А `WHERE` помогает считать не по всей таблице, а только по нужным строкам. Теперь попробуй сам!"
		}
	],
	"exercises": [
		{
			"id": "count-in-stock",
			"lang": "sql",
			"prompt": "Посчитай, **сколько товаров есть в наличии**. В наличии - это строки, где `in_stock` равен 1. Используй `COUNT` вместе с `WHERE`. Должна вернуться одна строка с числом.",
			"starter": "-- Посчитай строки, где in_stock = 1\n-- Подсказка: SELECT COUNT(*) ... WHERE ...\nSELECT ",
			"hints": [
				"Количество строк считает функция COUNT(*).",
				"Чтобы оставить только товары в наличии, добавь WHERE in_stock = 1.",
				"Полный вид: SELECT COUNT(*) FROM products WHERE in_stock = 1;"
			],
			"solution": "SELECT COUNT(*) FROM products WHERE in_stock = 1;",
			"seedSql": "CREATE TABLE products (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  price INTEGER,\n  category TEXT,\n  in_stock INTEGER\n);\nINSERT INTO products (id, name, price, category, in_stock) VALUES\n  (1, 'Молоко', 80, 'Молочное', 1),\n  (2, 'Сыр Российский', 450, 'Молочное', 1),\n  (3, 'Хлеб бородинский', 55, 'Выпечка', 1),\n  (4, 'Батон нарезной', 40, 'Выпечка', 0),\n  (5, 'Кофе арабика', 690, 'Напитки', 1),\n  (6, 'Чай чёрный', 220, 'Напитки', 1),\n  (7, 'Шоколад горький', 130, 'Сладости', 0),\n  (8, 'Печенье овсяное', 95, 'Сладости', 1),\n  (9, 'Яблоки', 110, 'Фрукты', 1),\n  (10, 'Бананы', 90, 'Фрукты', 1);",
			"check": {
				"expectedQuery": "SELECT COUNT(*) FROM products WHERE in_stock = 1;",
				"orderMatters": false
			}
		},
		{
			"id": "avg-price-napitki",
			"lang": "sql",
			"prompt": "Найди **среднюю цену товаров категории `Напитки`**. Используй `AVG` по столбцу `price` и `WHERE` по категории. Не забудь: название категории пишется в одинарных кавычках.",
			"starter": "-- Средняя цена только напитков\n-- Подсказка: AVG(price) и WHERE category = 'Напитки'\nSELECT ",
			"hints": [
				"Среднее значение считает функция AVG, ей нужен столбец: AVG(price).",
				"Отбери только напитки через WHERE category = 'Напитки'.",
				"Полный вид: SELECT AVG(price) FROM products WHERE category = 'Напитки';"
			],
			"solution": "SELECT AVG(price) FROM products WHERE category = 'Напитки';",
			"seedSql": "CREATE TABLE products (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  price INTEGER,\n  category TEXT,\n  in_stock INTEGER\n);\nINSERT INTO products (id, name, price, category, in_stock) VALUES\n  (1, 'Молоко', 80, 'Молочное', 1),\n  (2, 'Сыр Российский', 450, 'Молочное', 1),\n  (3, 'Хлеб бородинский', 55, 'Выпечка', 1),\n  (4, 'Батон нарезной', 40, 'Выпечка', 0),\n  (5, 'Кофе арабика', 690, 'Напитки', 1),\n  (6, 'Чай чёрный', 220, 'Напитки', 1),\n  (7, 'Шоколад горький', 130, 'Сладости', 0),\n  (8, 'Печенье овсяное', 95, 'Сладости', 1),\n  (9, 'Яблоки', 110, 'Фрукты', 1),\n  (10, 'Бананы', 90, 'Фрукты', 1);",
			"check": {
				"expectedQuery": "SELECT AVG(price) FROM products WHERE category = 'Напитки';",
				"orderMatters": false
			}
		},
		{
			"id": "min-max-sum-instock",
			"lang": "sql",
			"prompt": "Сделай небольшую сводку по **товарам в наличии** (`in_stock` = 1): выведи в одной строке самую низкую цену, самую высокую цену и сумму всех цен. То есть три столбца: `MIN(price)`, `MAX(price)` и `SUM(price)`, и общий `WHERE`.",
			"starter": "-- Три функции в одном запросе через запятую\n-- MIN(price), MAX(price), SUM(price) с условием in_stock = 1\nSELECT ",
			"hints": [
				"Несколько функций можно перечислить через запятую: SELECT MIN(price), MAX(price), SUM(price) ...",
				"Условие in_stock = 1 ставится один раз в WHERE и действует на все функции.",
				"Полный вид: SELECT MIN(price), MAX(price), SUM(price) FROM products WHERE in_stock = 1;"
			],
			"solution": "SELECT MIN(price), MAX(price), SUM(price) FROM products WHERE in_stock = 1;",
			"seedSql": "CREATE TABLE products (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  price INTEGER,\n  category TEXT,\n  in_stock INTEGER\n);\nINSERT INTO products (id, name, price, category, in_stock) VALUES\n  (1, 'Молоко', 80, 'Молочное', 1),\n  (2, 'Сыр Российский', 450, 'Молочное', 1),\n  (3, 'Хлеб бородинский', 55, 'Выпечка', 1),\n  (4, 'Батон нарезной', 40, 'Выпечка', 0),\n  (5, 'Кофе арабика', 690, 'Напитки', 1),\n  (6, 'Чай чёрный', 220, 'Напитки', 1),\n  (7, 'Шоколад горький', 130, 'Сладости', 0),\n  (8, 'Печенье овсяное', 95, 'Сладости', 1),\n  (9, 'Яблоки', 110, 'Фрукты', 1),\n  (10, 'Бананы', 90, 'Фрукты', 1);",
			"check": {
				"expectedQuery": "SELECT MIN(price), MAX(price), SUM(price) FROM products WHERE in_stock = 1;",
				"orderMatters": false
			}
		}
	],
	"quiz": [
		{
			"question": "Какая функция вернёт количество строк в таблице?",
			"options": [
				"SUM",
				"COUNT",
				"MAX",
				"AVG"
			],
			"correct": 1,
			"explain": "COUNT считает количество строк. Чаще всего пишут COUNT(*) - посчитать все строки."
		},
		{
			"question": "Что вернёт запрос SELECT AVG(price) FROM products WHERE category = 'Фрукты'; если цены фруктов 110 и 90?",
			"options": [
				"200 (сумма цен)",
				"100 (среднее значение)",
				"2 (количество фруктов)",
				"110 (максимальная цена)"
			],
			"correct": 1,
			"explain": "AVG - это среднее. (110 + 90) / 2 = 100. WHERE сначала отобрал только фрукты, а потом AVG посчитал среднее по ним."
		},
		{
			"question": "Как правильно записать текстовое значение в условии WHERE в SQLite?",
			"options": [
				"WHERE category = \"Напитки\" (двойные кавычки)",
				"WHERE category = 'Напитки' (одинарные кавычки)",
				"WHERE category = Напитки (без кавычек)",
				"WHERE category = \\`Напитки\\` (обратные кавычки)"
			],
			"correct": 1,
			"explain": "Текстовые значения в SQL пишутся в одинарных кавычках: 'Напитки'. Двойные кавычки в SQLite означают имя столбца, поэтому это частая ошибка."
		}
	]
};
