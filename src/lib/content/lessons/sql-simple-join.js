/** @type {import('../schema').Lesson} */
export default {
	"slug": "sql-simple-join",
	"title": "Связываем таблицы: простой JOIN",
	"level": "intermediate",
	"topic": "sql",
	"order": 13,
	"estimatedMinutes": 60,
	"emoji": "🔗",
	"summary": "Данные часто лежат в разных таблицах. Учимся соединять две таблицы по общему столбцу через INNER JOIN, чтобы получить связанную информацию.",
	"goals": [
		"Понять, зачем данные разбивают на таблицы",
		"Соединять таблицы через INNER JOIN ... ON",
		"Использовать псевдонимы таблиц",
		"Выбирать столбцы из обеих таблиц",
		"Сочетать JOIN с WHERE и ORDER BY"
	],
	"theory": [
		{
			"type": "text",
			"md": "До этого мы работали с одной таблицей. Но в реальных базах данных информация почти всегда **разбита на несколько таблиц**. Сегодня научимся их соединять с помощью `JOIN`."
		},
		{
			"type": "text",
			"md": "Представь интернет-магазин. У нас есть две таблицы:\n- `customers` (покупатели): столбцы `id`, `name`, `city`\n- `orders` (заказы): столбцы `id`, `customer_id`, `product`, `amount`\n\nЗаметь: в таблице `orders` нет имени покупателя. Вместо него хранится `customer_id` - номер, который указывает на строку в таблице `customers`. Это и есть **связь** между таблицами."
		},
		{
			"type": "callout",
			"variant": "info",
			"title": "Зачем так делать?",
			"md": "Чтобы не повторять одни и те же данные. Имя и город покупателя хранятся **один раз** в `customers`. А в `orders` мы просто ссылаемся на покупателя по его `id`. Это экономит место и помогает избежать ошибок."
		},
		{
			"type": "text",
			"md": "Чтобы в одном запросе получить и имя покупателя, и его товар, нужно **соединить** таблицы. Для этого есть `INNER JOIN`. Базовая форма такая:\n\n```\nSELECT столбцы\nFROM таблица1\nINNER JOIN таблица2 ON условие_связи;\n```\n\nКлючевое слово `ON` говорит базе, **по какому столбцу** связывать строки."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT customers.name, orders.product\nFROM customers\nINNER JOIN orders ON customers.id = orders.customer_id;",
			"caption": "Соединяем покупателей с их заказами. Для каждой пары, где customers.id совпадает с orders.customer_id, получаем строку: имя покупателя и название товара. Например: Анна | Наушники, Борис | Кружка и так далее."
		},
		{
			"type": "text",
			"md": "Разберём условие `ON customers.id = orders.customer_id` по частям:\n- слева `customers.id` - номер покупателя в таблице покупателей;\n- справа `orders.customer_id` - тот же номер, записанный в заказе;\n- знак `=` означает: бери только те пары строк, где эти номера **совпадают**.\n\nТак заказ Анны соединится именно со строкой Анны, а не с кем-то другим."
		},
		{
			"type": "callout",
			"variant": "tip",
			"title": "Откуда столбец - указывай явно",
			"md": "Когда столбец называется одинаково в обеих таблицах (например `id` есть и там, и там), пиши `имя_таблицы.столбец`, например `orders.id`. Так база точно поймёт, что ты имеешь в виду, и не выдаст ошибку."
		},
		{
			"type": "text",
			"md": "Писать длинные имена таблиц каждый раз утомительно. Здесь помогает `AS` - он задаёт таблице короткий **псевдоним** (второе имя). После этого можно обращаться к таблице по короткому имени."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT c.name, o.product\nFROM customers AS c\nINNER JOIN orders AS o ON c.id = o.customer_id;",
			"caption": "То же самое, что и раньше, но короче. customers теперь c, orders теперь o. Результат точно такой же: пары имя покупателя | товар."
		},
		{
			"type": "callout",
			"variant": "info",
			"title": "Слово INNER можно опустить",
			"md": "Запись `JOIN` без слова `INNER` в SQLite означает ровно то же самое - `INNER JOIN`. Можно писать любой вариант, результат одинаковый. В уроке будем писать полностью `INNER JOIN`, чтобы было понятнее."
		},
		{
			"type": "text",
			"md": "Важная деталь: `INNER JOIN` показывает **только те строки, где есть совпадение в обеих таблицах**. Если у покупателя нет ни одного заказа, его не будет в результате. И наоборот: заказ без покупателя тоже не попадёт. Соединяются только пары, которые нашли друг друга по `ON`."
		},
		{
			"type": "text",
			"md": "С соединёнными таблицами работают все знакомые инструменты. После `JOIN` можно добавить `WHERE` для фильтра и `ORDER BY` для сортировки - совсем как с обычной таблицей."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT c.name, o.product, o.amount\nFROM customers AS c\nINNER JOIN orders AS o ON c.id = o.customer_id\nWHERE c.city = 'Казань'\nORDER BY o.amount DESC;",
			"caption": "Сначала соединяем таблицы, потом оставляем только заказы покупателей из Казани (WHERE), потом сортируем по сумме от большей к меньшей (ORDER BY ... DESC). Получим заказы Бориса и Дарьи, отсортированные по сумме."
		},
		{
			"type": "callout",
			"variant": "warning",
			"title": "Не забывай условие ON",
			"md": "Если написать `JOIN` без `ON` (или с неверным условием), база может соединить **каждую строку с каждой** - получится огромная путаница из бессмысленных пар. Всегда связывай таблицы по общему столбцу: `ON c.id = o.customer_id`."
		},
		{
			"type": "text",
			"md": "Коротко, что мы узнали:\n- `INNER JOIN ... ON` соединяет две таблицы по общему столбцу;\n- `AS` даёт таблице короткий псевдоним;\n- в `SELECT` можно брать столбцы из обеих таблиц (`c.name`, `o.product`);\n- к результату применимы `WHERE` и `ORDER BY`. Теперь попробуй сам!"
		}
	],
	"exercises": [
		{
			"id": "join-name-product",
			"lang": "sql",
			"prompt": "Соедини таблицы `customers` и `orders`, чтобы для каждого заказа вывести **имя покупателя** и **название товара**.\n\nВыведи два столбца: имя (`name` из `customers`) и товар (`product` из `orders`). Используй `INNER JOIN` по общему столбцу. Сортировка не важна.",
			"starter": "-- Соедини customers и orders по общему столбцу.\n-- Подсказка: customers.id связан с orders.customer_id\nSELECT ",
			"hints": [
				"Начни с FROM customers, затем добавь INNER JOIN orders.",
				"Условие связи пиши после ON: customers.id = orders.customer_id.",
				"В SELECT перечисли два столбца из разных таблиц: customers.name и orders.product."
			],
			"solution": "SELECT c.name, o.product\nFROM customers AS c\nINNER JOIN orders AS o ON c.id = o.customer_id;",
			"seedSql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product TEXT, amount INTEGER);\nINSERT INTO customers (id, name, city) VALUES (1,'Анна','Москва'),(2,'Борис','Казань'),(3,'Вера','Москва'),(4,'Глеб','Сочи'),(5,'Дарья','Казань');\nINSERT INTO orders (id, customer_id, product, amount) VALUES (101,1,'Книга',500),(102,1,'Наушники',3000),(103,2,'Кружка',400),(104,3,'Рюкзак',2500),(105,3,'Книга',500),(106,5,'Зонт',900),(107,1,'Тетрадь',150);",
			"check": {
				"expectedQuery": "SELECT customers.name, orders.product FROM customers JOIN orders ON customers.id = orders.customer_id;",
				"orderMatters": false
			}
		},
		{
			"id": "join-kazan-filter",
			"lang": "sql",
			"prompt": "Выведи заказы только тех покупателей, кто живёт в городе **Казань**.\n\nСоедини `customers` и `orders`, затем оставь строки, где `city` равен `'Казань'`. Выведи три столбца: имя (`name`), товар (`product`) и сумму (`amount`). Сортировка не важна.",
			"starter": "-- Соедини таблицы, затем добавь WHERE по городу.\n-- Город пиши в одинарных кавычках: 'Казань'\nSELECT ",
			"hints": [
				"Сначала сделай INNER JOIN customers и orders по customer_id, как в первом упражнении.",
				"Добавь фильтр: WHERE c.city = 'Казань' (текст обязательно в одинарных кавычках).",
				"В SELECT возьми c.name, o.product и o.amount."
			],
			"solution": "SELECT c.name, o.product, o.amount\nFROM customers AS c\nINNER JOIN orders AS o ON c.id = o.customer_id\nWHERE c.city = 'Казань';",
			"seedSql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product TEXT, amount INTEGER);\nINSERT INTO customers (id, name, city) VALUES (1,'Анна','Москва'),(2,'Борис','Казань'),(3,'Вера','Москва'),(4,'Глеб','Сочи'),(5,'Дарья','Казань');\nINSERT INTO orders (id, customer_id, product, amount) VALUES (101,1,'Книга',500),(102,1,'Наушники',3000),(103,2,'Кружка',400),(104,3,'Рюкзак',2500),(105,3,'Книга',500),(106,5,'Зонт',900),(107,1,'Тетрадь',150);",
			"check": {
				"expectedQuery": "SELECT customers.name, orders.product, orders.amount FROM orders JOIN customers ON customers.id = orders.customer_id WHERE customers.city = 'Казань';",
				"orderMatters": false
			}
		},
		{
			"id": "join-order-by-amount",
			"lang": "sql",
			"prompt": "Выведи все заказы вместе с именем и городом покупателя, отсортированные по **сумме заказа от большей к меньшей**.\n\nСоедини `customers` и `orders`, выведи три столбца: имя (`name`), город (`city`) и сумму (`amount`). Используй `ORDER BY` с `DESC`.",
			"starter": "-- Соедини таблицы и отсортируй по сумме по убыванию.\n-- Для сортировки по убыванию добавь DESC в конце.\nSELECT ",
			"hints": [
				"Сделай INNER JOIN customers и orders по customer_id.",
				"Возьми в SELECT c.name, c.city и o.amount.",
				"В конце добавь ORDER BY o.amount DESC - так самые крупные суммы окажутся сверху."
			],
			"solution": "SELECT c.name, c.city, o.amount\nFROM customers AS c\nINNER JOIN orders AS o ON c.id = o.customer_id\nORDER BY o.amount DESC;",
			"seedSql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product TEXT, amount INTEGER);\nINSERT INTO customers (id, name, city) VALUES (1,'Анна','Москва'),(2,'Борис','Казань'),(3,'Вера','Москва'),(4,'Глеб','Сочи'),(5,'Дарья','Казань');\nINSERT INTO orders (id, customer_id, product, amount) VALUES (101,1,'Книга',500),(102,1,'Наушники',3000),(103,2,'Кружка',400),(104,3,'Рюкзак',2500),(105,3,'Книга',500),(106,5,'Зонт',900),(107,1,'Тетрадь',150);",
			"check": {
				"expectedQuery": "SELECT customers.name, customers.city, orders.amount FROM customers JOIN orders ON customers.id = orders.customer_id ORDER BY orders.amount DESC;",
				"orderMatters": true
			}
		}
	],
	"quiz": [
		{
			"question": "Для чего нужно ключевое слово `ON` в запросе с `INNER JOIN`?",
			"options": [
				"Чтобы задать, по какому столбцу связывать строки двух таблиц",
				"Чтобы отсортировать результат",
				"Чтобы дать таблице короткий псевдоним",
				"Чтобы выбрать только первые строки"
			],
			"correct": 0,
			"explain": "`ON` задаёт условие связи, например ON customers.id = orders.customer_id. База соединит только те строки, где значения совпадают. За сортировку отвечает ORDER BY, за псевдоним - AS."
		},
		{
			"question": "Что делает запись `customers AS c`?",
			"options": [
				"Создаёт новую таблицу с именем c",
				"Удаляет таблицу customers",
				"Задаёт таблице customers короткий псевдоним c, чтобы обращаться к ней как c.name",
				"Сортирует таблицу по столбцу c"
			],
			"correct": 2,
			"explain": "`AS` задаёт псевдоним (второе короткое имя). После customers AS c можно писать c.name вместо customers.name. Это просто удобство, новая таблица не создаётся."
		},
		{
			"question": "У покупателя Глеба нет ни одного заказа. Попадёт ли он в результат запроса с `INNER JOIN` таблиц customers и orders?",
			"options": [
				"Да, попадёт с пустым товаром",
				"Нет, INNER JOIN показывает только строки, у которых есть совпадение в обеих таблицах",
				"Да, попадёт и продублируется несколько раз",
				"Запрос завершится ошибкой"
			],
			"correct": 1,
			"explain": "`INNER JOIN` оставляет только пары строк, нашедшие совпадение по условию ON. Раз у Глеба нет заказов, совпадения нет, поэтому в результат он не попадёт."
		}
	]
};
