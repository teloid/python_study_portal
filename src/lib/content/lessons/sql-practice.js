/** @type {import('../schema').Lesson} */
export default {
	"slug": "sql-practice",
	"title": "SQL-практикум: интернет-магазин",
	"level": "intermediate",
	"topic": "sql",
	"order": 20,
	"estimatedMinutes": 50,
	"emoji": "🛒",
	"summary": "Одна база «интернет-магазин» (клиенты, товары, заказы) и задания по нарастанию: от простого SELECT до агрегатов, GROUP BY и JOIN. Всё, что учили по SQL, вместе.",
	"goals": [
		"Выбирать и фильтровать данные",
		"Сортировать и ограничивать результат",
		"Считать итоги (COUNT/SUM/AVG) и группировать",
		"Соединять таблицы через JOIN"
	],
	"theory": [
		{
			"type": "text",
			"md": "Небольшой практикум по SQL. Мы будем работать с базой **интернет-магазина** из трёх таблиц. Твоя задача - вспомнить всё, что мы проходили: `SELECT`, `WHERE`, `ORDER BY`, агрегаты (`COUNT`, `AVG`, `SUM`), `GROUP BY` и `JOIN`. Погнали!"
		},
		{
			"type": "text",
			"md": "Три таблицы и связи между ними:\n- `customers` - покупатели: `id`, `name`, `city`\n- `products` - товары: `id`, `name`, `price`, `category`\n- `orders` - заказы: `id`, `customer_id`, `product_id`, `qty` (количество)\n\nЗаметь: в `orders` нет имён - только номера. `customer_id` ссылается на `customers.id`, а `product_id` - на `products.id`. Это связь, по которой мы будем соединять таблицы через `JOIN`."
		},
		{
			"type": "callout",
			"variant": "tip",
			"title": "Шпаргалка по порядку частей запроса",
			"md": "Запоминай порядок: `SELECT` ... `FROM` ... `JOIN` ... `WHERE` ... `GROUP BY` ... `ORDER BY`. Сортировка всегда в самом конце. Текст в SQL пиши в одинарных кавычках: `'Москва'`."
		},
		{
			"type": "callout",
			"variant": "info",
			"title": "Соединяем сразу три таблицы",
			"md": "`JOIN` можно применять несколько раз подряд. Чтобы к заказу подтянуть и имя покупателя, и название товара, делаем два соединения: `orders` с `customers` (по `customer_id`) и `orders` с `products` (по `product_id`). Короткие псевдонимы через `AS` (например `o`, `c`, `p`) сильно упрощают запись."
		}
	],
	"exercises": [
		{
			"id": "products-above-price",
			"lang": "sql",
			"prompt": "Покажи все товары **дороже 1000 рублей**, отсортированные по цене **от дорогих к дешёвым**.\n\nВыведи два столбца: название (`name`) и цену (`price`). Используй `WHERE` для фильтра и `ORDER BY ... DESC` для сортировки.",
			"starter": "-- Отбери товары дороже 1000 и отсортируй по цене по убыванию.\n-- Для убывания добавь DESC в конце.\nSELECT ",
			"hints": [
				"Фильтр по цене пиши так: WHERE price > 1000.",
				"Сортировка по убыванию - это ORDER BY price DESC.",
				"Полный запрос: SELECT name, price FROM products WHERE price > 1000 ORDER BY price DESC;"
			],
			"solution": "SELECT name, price FROM products WHERE price > 1000 ORDER BY price DESC;",
			"seedSql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);\nCREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, category TEXT);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, qty INTEGER);\nINSERT INTO customers (id, name, city) VALUES\n  (1, 'Анна', 'Москва'),\n  (2, 'Борис', 'Казань'),\n  (3, 'Вера', 'Москва'),\n  (4, 'Глеб', 'Москва'),\n  (5, 'Дарья', 'Казань'),\n  (6, 'Егор', 'Сочи');\nINSERT INTO products (id, name, price, category) VALUES\n  (10, 'Наушники', 3000, 'Электроника'),\n  (11, 'Кружка', 400, 'Дом'),\n  (12, 'Книга', 600, 'Книги'),\n  (13, 'Рюкзак', 2500, 'Аксессуары'),\n  (14, 'Мышка', 1200, 'Электроника'),\n  (15, 'Зонт', 900, 'Аксессуары'),\n  (16, 'Блокнот', 250, 'Книги'),\n  (17, 'Клавиатура', 2000, 'Электроника');\nINSERT INTO orders (id, customer_id, product_id, qty) VALUES\n  (101, 1, 10, 1),\n  (102, 1, 12, 2),\n  (103, 2, 11, 3),\n  (104, 3, 13, 1),\n  (105, 3, 12, 1),\n  (106, 5, 15, 2),\n  (107, 1, 16, 4),\n  (108, 4, 14, 1),\n  (109, 5, 10, 1),\n  (110, 2, 17, 1);",
			"check": {
				"expectedQuery": "SELECT name, price FROM products WHERE price > 1000 ORDER BY price DESC;",
				"orderMatters": true
			}
		},
		{
			"id": "avg-price",
			"lang": "sql",
			"prompt": "Посчитай **среднюю цену** всех товаров в магазине.\n\nВыведи один столбец со средним значением. Используй агрегатную функцию `AVG` по столбцу `price`. Столбец удобно назвать через `AS`, например `avg_price`.",
			"starter": "-- Средняя цена - это агрегатная функция AVG.\nSELECT ",
			"hints": [
				"Среднее значение считает функция AVG.",
				"Внутри скобок укажи столбец: AVG(price).",
				"Полный запрос: SELECT AVG(price) AS avg_price FROM products;"
			],
			"solution": "SELECT AVG(price) AS avg_price FROM products;",
			"seedSql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);\nCREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, category TEXT);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, qty INTEGER);\nINSERT INTO customers (id, name, city) VALUES\n  (1, 'Анна', 'Москва'),\n  (2, 'Борис', 'Казань'),\n  (3, 'Вера', 'Москва'),\n  (4, 'Глеб', 'Москва'),\n  (5, 'Дарья', 'Казань'),\n  (6, 'Егор', 'Сочи');\nINSERT INTO products (id, name, price, category) VALUES\n  (10, 'Наушники', 3000, 'Электроника'),\n  (11, 'Кружка', 400, 'Дом'),\n  (12, 'Книга', 600, 'Книги'),\n  (13, 'Рюкзак', 2500, 'Аксессуары'),\n  (14, 'Мышка', 1200, 'Электроника'),\n  (15, 'Зонт', 900, 'Аксессуары'),\n  (16, 'Блокнот', 250, 'Книги'),\n  (17, 'Клавиатура', 2000, 'Электроника');\nINSERT INTO orders (id, customer_id, product_id, qty) VALUES\n  (101, 1, 10, 1),\n  (102, 1, 12, 2),\n  (103, 2, 11, 3),\n  (104, 3, 13, 1),\n  (105, 3, 12, 1),\n  (106, 5, 15, 2),\n  (107, 1, 16, 4),\n  (108, 4, 14, 1),\n  (109, 5, 10, 1),\n  (110, 2, 17, 1);",
			"check": {
				"expectedQuery": "SELECT AVG(price) AS avg_price FROM products;",
				"orderMatters": false
			}
		},
		{
			"id": "count-clients-by-city",
			"lang": "sql",
			"prompt": "Посчитай, **сколько покупателей** живёт в каждом городе.\n\nВыведи два столбца: город (`city`) и количество покупателей. Используй `GROUP BY city` и `COUNT`. Сортировка не важна.",
			"starter": "-- Сгруппируй покупателей по городу и посчитай их количество.\nSELECT ",
			"hints": [
				"Группировать нужно по городу: GROUP BY city.",
				"Количество строк в группе считает COUNT(*).",
				"Полный запрос: SELECT city, COUNT(*) AS cnt FROM customers GROUP BY city;"
			],
			"solution": "SELECT city, COUNT(*) AS cnt FROM customers GROUP BY city;",
			"seedSql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);\nCREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, category TEXT);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, qty INTEGER);\nINSERT INTO customers (id, name, city) VALUES\n  (1, 'Анна', 'Москва'),\n  (2, 'Борис', 'Казань'),\n  (3, 'Вера', 'Москва'),\n  (4, 'Глеб', 'Москва'),\n  (5, 'Дарья', 'Казань'),\n  (6, 'Егор', 'Сочи');\nINSERT INTO products (id, name, price, category) VALUES\n  (10, 'Наушники', 3000, 'Электроника'),\n  (11, 'Кружка', 400, 'Дом'),\n  (12, 'Книга', 600, 'Книги'),\n  (13, 'Рюкзак', 2500, 'Аксессуары'),\n  (14, 'Мышка', 1200, 'Электроника'),\n  (15, 'Зонт', 900, 'Аксессуары'),\n  (16, 'Блокнот', 250, 'Книги'),\n  (17, 'Клавиатура', 2000, 'Электроника');\nINSERT INTO orders (id, customer_id, product_id, qty) VALUES\n  (101, 1, 10, 1),\n  (102, 1, 12, 2),\n  (103, 2, 11, 3),\n  (104, 3, 13, 1),\n  (105, 3, 12, 1),\n  (106, 5, 15, 2),\n  (107, 1, 16, 4),\n  (108, 4, 14, 1),\n  (109, 5, 10, 1),\n  (110, 2, 17, 1);",
			"check": {
				"expectedQuery": "SELECT city, COUNT(*) AS cnt FROM customers GROUP BY city;",
				"orderMatters": false
			}
		},
		{
			"id": "sum-price-by-category",
			"lang": "sql",
			"prompt": "Для каждой **категории товаров** посчитай **суммарную стоимость** товаров в ней и отсортируй список **от большей суммы к меньшей**.\n\nВыведи два столбца: категорию (`category`) и сумму цен. Используй `GROUP BY category`, `SUM(price)` и `ORDER BY ... DESC`.",
			"starter": "-- Сгруппируй товары по категории, сложи их цены и отсортируй по убыванию.\nSELECT ",
			"hints": [
				"Группируй по категории: GROUP BY category.",
				"Сумму цен даёт SUM(price); удобно назвать её через AS total.",
				"В конце добавь ORDER BY total DESC. Полный запрос: SELECT category, SUM(price) AS total FROM products GROUP BY category ORDER BY total DESC;"
			],
			"solution": "SELECT category, SUM(price) AS total FROM products GROUP BY category ORDER BY total DESC;",
			"seedSql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);\nCREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, category TEXT);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, qty INTEGER);\nINSERT INTO customers (id, name, city) VALUES\n  (1, 'Анна', 'Москва'),\n  (2, 'Борис', 'Казань'),\n  (3, 'Вера', 'Москва'),\n  (4, 'Глеб', 'Москва'),\n  (5, 'Дарья', 'Казань'),\n  (6, 'Егор', 'Сочи');\nINSERT INTO products (id, name, price, category) VALUES\n  (10, 'Наушники', 3000, 'Электроника'),\n  (11, 'Кружка', 400, 'Дом'),\n  (12, 'Книга', 600, 'Книги'),\n  (13, 'Рюкзак', 2500, 'Аксессуары'),\n  (14, 'Мышка', 1200, 'Электроника'),\n  (15, 'Зонт', 900, 'Аксессуары'),\n  (16, 'Блокнот', 250, 'Книги'),\n  (17, 'Клавиатура', 2000, 'Электроника');\nINSERT INTO orders (id, customer_id, product_id, qty) VALUES\n  (101, 1, 10, 1),\n  (102, 1, 12, 2),\n  (103, 2, 11, 3),\n  (104, 3, 13, 1),\n  (105, 3, 12, 1),\n  (106, 5, 15, 2),\n  (107, 1, 16, 4),\n  (108, 4, 14, 1),\n  (109, 5, 10, 1),\n  (110, 2, 17, 1);",
			"check": {
				"expectedQuery": "SELECT category, SUM(price) AS total FROM products GROUP BY category ORDER BY total DESC;",
				"orderMatters": true
			}
		},
		{
			"id": "join-orders-full",
			"lang": "sql",
			"prompt": "Собери полную картину заказов: для каждого заказа выведи **имя покупателя**, **название товара** и **количество**.\n\nСоедини три таблицы: `orders` с `customers` (по `customer_id`) и `orders` с `products` (по `product_id`). Выведи три столбца: имя (`name` из `customers`), название товара (`name` из `products`) и количество (`qty`). Сортировка не важна.",
			"starter": "-- Начни с FROM orders, затем два INNER JOIN.\n-- orders.customer_id связан с customers.id\n-- orders.product_id связан с products.id\nSELECT ",
			"hints": [
				"Начни так: FROM orders AS o, затем INNER JOIN customers AS c ON o.customer_id = c.id.",
				"Добавь второе соединение: INNER JOIN products AS p ON o.product_id = p.id.",
				"В SELECT возьми c.name, p.name и o.qty. Полный запрос: SELECT c.name, p.name, o.qty FROM orders AS o INNER JOIN customers AS c ON o.customer_id = c.id INNER JOIN products AS p ON o.product_id = p.id;"
			],
			"solution": "SELECT c.name, p.name, o.qty FROM orders AS o INNER JOIN customers AS c ON o.customer_id = c.id INNER JOIN products AS p ON o.product_id = p.id;",
			"seedSql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);\nCREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, category TEXT);\nCREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, qty INTEGER);\nINSERT INTO customers (id, name, city) VALUES\n  (1, 'Анна', 'Москва'),\n  (2, 'Борис', 'Казань'),\n  (3, 'Вера', 'Москва'),\n  (4, 'Глеб', 'Москва'),\n  (5, 'Дарья', 'Казань'),\n  (6, 'Егор', 'Сочи');\nINSERT INTO products (id, name, price, category) VALUES\n  (10, 'Наушники', 3000, 'Электроника'),\n  (11, 'Кружка', 400, 'Дом'),\n  (12, 'Книга', 600, 'Книги'),\n  (13, 'Рюкзак', 2500, 'Аксессуары'),\n  (14, 'Мышка', 1200, 'Электроника'),\n  (15, 'Зонт', 900, 'Аксессуары'),\n  (16, 'Блокнот', 250, 'Книги'),\n  (17, 'Клавиатура', 2000, 'Электроника');\nINSERT INTO orders (id, customer_id, product_id, qty) VALUES\n  (101, 1, 10, 1),\n  (102, 1, 12, 2),\n  (103, 2, 11, 3),\n  (104, 3, 13, 1),\n  (105, 3, 12, 1),\n  (106, 5, 15, 2),\n  (107, 1, 16, 4),\n  (108, 4, 14, 1),\n  (109, 5, 10, 1),\n  (110, 2, 17, 1);",
			"check": {
				"expectedQuery": "SELECT customers.name, products.name, orders.qty FROM orders JOIN customers ON orders.customer_id = customers.id JOIN products ON orders.product_id = products.id;",
				"orderMatters": false
			}
		}
	],
	"quiz": [
		{
			"question": "Какая функция посчитает **среднюю** цену товаров?",
			"options": [
				"SUM",
				"AVG",
				"COUNT",
				"MAX"
			],
			"correct": 1,
			"explain": "AVG вычисляет среднее значение. SUM складывает всё в одну сумму, COUNT считает количество строк, а MAX находит максимум. Для средней цены нужен именно AVG(price)."
		},
		{
			"question": "В таблице `orders` нет столбца с именем покупателя - там хранится только `customer_id`. Как получить имя покупателя рядом с его заказом?",
			"options": [
				"Никак, имя нужно вписать в orders вручную",
				"Соединить orders и customers через JOIN по customer_id = customers.id",
				"Использовать GROUP BY customer_id",
				"Отсортировать orders через ORDER BY name"
			],
			"correct": 1,
			"explain": "Имена хранятся в таблице customers. Чтобы подтянуть их к заказам, таблицы соединяют через JOIN по условию orders.customer_id = customers.id. GROUP BY и ORDER BY эту задачу не решают."
		},
		{
			"question": "В каком порядке должны идти части запроса, чтобы сгруппировать данные и отсортировать итог?",
			"options": [
				"SELECT ... FROM ... ORDER BY ... GROUP BY ...",
				"SELECT ... FROM ... GROUP BY ... ORDER BY ...",
				"GROUP BY ... SELECT ... FROM ... ORDER BY ...",
				"SELECT ... ORDER BY ... FROM ... GROUP BY ..."
			],
			"correct": 1,
			"explain": "Правильный порядок: сначала SELECT, потом FROM, затем GROUP BY и в самом конце ORDER BY. Сортировка всегда идёт последней, иначе SQL выдаст ошибку."
		}
	]
};
