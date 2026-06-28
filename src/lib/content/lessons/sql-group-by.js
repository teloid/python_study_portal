/** @type {import('../schema').Lesson} */
export default {
	"slug": "sql-group-by",
	"title": "Группировка данных: GROUP BY",
	"level": "intermediate",
	"topic": "sql",
	"order": 11,
	"estimatedMinutes": 55,
	"emoji": "📊",
	"summary": "Учимся разбивать данные на группы и считать итоги по каждой группе. Сочетаем GROUP BY с агрегатными функциями.",
	"goals": [
		"Понять идею группировки строк по столбцу",
		"Использовать GROUP BY с COUNT, SUM, AVG",
		"Сортировать сгруппированный результат",
		"Понимать разницу между WHERE и фильтрацией групп",
		"Аккуратно читать результат запроса"
	],
	"theory": [
		{
			"type": "text",
			"md": "До этого мы выбирали отдельные строки из таблицы. Но часто нужно не сами строки, а **итоги по группам**: сколько заказов в каждом городе, на какую сумму купил каждый клиент, какой средний чек. Для этого в SQL есть оператор `GROUP BY`."
		},
		{
			"type": "text",
			"md": "Идея простая: `GROUP BY` берёт все строки и **складывает их в кучки** по одинаковому значению какого-то столбца. Например, по городу: все заказы из Москвы в одну кучку, из Казани в другую. А потом для каждой кучки мы считаем что-то одно число: количество, сумму или среднее."
		},
		{
			"type": "text",
			"md": "Числа по кучкам считают **агрегатные функции** (от слова \"агрегировать\" - собирать вместе):\n- `COUNT` - сколько строк в группе\n- `SUM` - сумма значений в группе\n- `AVG` - среднее значение в группе"
		},
		{
			"type": "text",
			"md": "Будем работать с таблицей `orders` (заказы интернет-магазина). В ней четыре столбца:\n- **id** - номер заказа\n- **customer** - имя клиента\n- **city** - город\n- **amount** - сумма заказа в рублях"
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT city, COUNT(*) AS cnt\nFROM orders\nGROUP BY city;",
			"caption": "Считаем, сколько заказов в каждом городе. GROUP BY city собирает строки в кучки по городу, а COUNT(*) считает строки в каждой кучке. Результат: Казань - 4, Москва - 3, Сочи - 3."
		},
		{
			"type": "text",
			"md": "Разберём запрос по шагам:\n- `GROUP BY city` - сгруппировать строки по городу\n- `COUNT(*)` - посчитать, сколько строк попало в каждую группу\n- `AS cnt` - дать столбцу с результатом понятное имя (необязательно, но удобно)\n\nЗапись `COUNT(*)` означает \"посчитай все строки группы\"."
		},
		{
			"type": "callout",
			"variant": "info",
			"title": "Важное правило",
			"md": "В `SELECT` вместе с `GROUP BY` можно ставить только два вида столбцов: те, по которым группируем (они после `GROUP BY`), и агрегатные функции (`COUNT`, `SUM`, `AVG`). Нельзя вывести, например, `amount` напрямую - ведь в группе много разных сумм, и непонятно, какую из них показать."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT customer, SUM(amount) AS total\nFROM orders\nGROUP BY customer;",
			"caption": "Сколько всего потратил каждый клиент. Группируем по имени клиента, а SUM(amount) складывает суммы всех его заказов. Например, у Анны три заказа: 1200 + 600 + 900 = 2700."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT city, AVG(amount) AS avg_amount\nFROM orders\nGROUP BY city;",
			"caption": "Средняя сумма заказа в каждом городе. AVG(amount) делит сумму всех заказов группы на их количество. Для Москвы: (1200 + 600 + 900) / 3 = 900."
		},
		{
			"type": "text",
			"md": "Часто итоги хочется **отсортировать**: например, показать клиентов от самого щедрого к самому скромному. Для этого добавляем `ORDER BY` после `GROUP BY`. По умолчанию сортировка по возрастанию, а слово `DESC` переворачивает её по убыванию (от большего к меньшему)."
		},
		{
			"type": "code",
			"lang": "sql",
			"code": "SELECT customer, SUM(amount) AS total\nFROM orders\nGROUP BY customer\nORDER BY total DESC;",
			"caption": "Клиенты по убыванию потраченной суммы. Первой будет Галина (3100), последним - Дмитрий (400). Обратите внимание: в ORDER BY можно ссылаться на имя total, которое мы задали через AS."
		},
		{
			"type": "callout",
			"variant": "tip",
			"title": "Порядок частей запроса",
			"md": "Запоминайте порядок: сначала `SELECT`, потом `FROM`, потом `GROUP BY`, и в самом конце `ORDER BY`. Если перепутать местами, SQL выдаст ошибку. Сортировка всегда идёт последней."
		},
		{
			"type": "callout",
			"variant": "warning",
			"title": "COUNT(*) и пустые группы",
			"md": "`COUNT(*)` считает все строки группы. Группы из ноля строк просто не появятся в результате - `GROUP BY` создаёт кучки только из тех данных, что реально есть в таблице. Поэтому в результате не бывает строк с нулём."
		}
	],
	"exercises": [
		{
			"id": "orders-count-by-city",
			"lang": "sql",
			"prompt": "Посчитай, **сколько заказов** сделано в каждом городе.\n\nВыведи два столбца: город (`city`) и количество заказов. Используй `GROUP BY` и `COUNT`. Сортировка не важна.",
			"starter": "SELECT ",
			"hints": [
				"Группировать нужно по столбцу city, значит в конце будет GROUP BY city.",
				"Количество строк в группе считает COUNT(*).",
				"Соедини всё так: SELECT city, COUNT(*) FROM orders GROUP BY city;"
			],
			"solution": "SELECT city, COUNT(*) AS cnt FROM orders GROUP BY city;",
			"seedSql": "CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer TEXT,\n  city TEXT,\n  amount INTEGER\n);\nINSERT INTO orders (id, customer, city, amount) VALUES\n  (1, 'Анна', 'Москва', 1200),\n  (2, 'Борис', 'Казань', 800),\n  (3, 'Анна', 'Москва', 600),\n  (4, 'Виктор', 'Казань', 1500),\n  (5, 'Галина', 'Сочи', 2000),\n  (6, 'Борис', 'Казань', 700),\n  (7, 'Анна', 'Москва', 900),\n  (8, 'Дмитрий', 'Сочи', 400),\n  (9, 'Виктор', 'Казань', 300),\n  (10, 'Галина', 'Сочи', 1100);",
			"check": {
				"expectedQuery": "SELECT city, COUNT(*) AS cnt FROM orders GROUP BY city;",
				"orderMatters": false
			}
		},
		{
			"id": "orders-total-by-customer",
			"lang": "sql",
			"prompt": "Для каждого клиента посчитай **общую сумму** всех его заказов и отсортируй список **от большей суммы к меньшей**.\n\nВыведи столбцы: клиент (`customer`) и сумму. Используй `GROUP BY`, `SUM` и `ORDER BY ... DESC`.",
			"starter": "SELECT ",
			"hints": [
				"Группируй по клиенту: GROUP BY customer.",
				"Сумму заказов даёт SUM(amount); удобно назвать её через AS total.",
				"Чтобы отсортировать по убыванию, добавь в самом конце ORDER BY total DESC."
			],
			"solution": "SELECT customer, SUM(amount) AS total FROM orders GROUP BY customer ORDER BY total DESC;",
			"seedSql": "CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer TEXT,\n  city TEXT,\n  amount INTEGER\n);\nINSERT INTO orders (id, customer, city, amount) VALUES\n  (1, 'Анна', 'Москва', 1200),\n  (2, 'Борис', 'Казань', 800),\n  (3, 'Анна', 'Москва', 600),\n  (4, 'Виктор', 'Казань', 1500),\n  (5, 'Галина', 'Сочи', 2000),\n  (6, 'Борис', 'Казань', 700),\n  (7, 'Анна', 'Москва', 900),\n  (8, 'Дмитрий', 'Сочи', 400),\n  (9, 'Виктор', 'Казань', 300),\n  (10, 'Галина', 'Сочи', 1100);",
			"check": {
				"expectedQuery": "SELECT customer, SUM(amount) AS total FROM orders GROUP BY customer ORDER BY total DESC;",
				"orderMatters": true
			}
		},
		{
			"id": "orders-avg-by-city",
			"lang": "sql",
			"prompt": "Посчитай **средний чек** (среднюю сумму заказа) в каждом городе и оставь только те города, где средний чек **больше 1000** рублей.\n\nВыведи столбцы: город (`city`) и среднюю сумму. Подсказка: для фильтра по результату агрегата используется `HAVING` (он работает как `WHERE`, но для групп). Отсортируй по городу (`ORDER BY city`).",
			"starter": "SELECT ",
			"hints": [
				"Сначала сгруппируй по городу и посчитай среднее: SELECT city, AVG(amount) FROM orders GROUP BY city.",
				"Чтобы отобрать группы по значению агрегата, добавь HAVING AVG(amount) > 1000 после GROUP BY.",
				"В конце добавь ORDER BY city. Полный запрос: SELECT city, AVG(amount) AS avg_amount FROM orders GROUP BY city HAVING AVG(amount) > 1000 ORDER BY city;"
			],
			"solution": "SELECT city, AVG(amount) AS avg_amount FROM orders GROUP BY city HAVING AVG(amount) > 1000 ORDER BY city;",
			"seedSql": "CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer TEXT,\n  city TEXT,\n  amount INTEGER\n);\nINSERT INTO orders (id, customer, city, amount) VALUES\n  (1, 'Анна', 'Москва', 1200),\n  (2, 'Борис', 'Казань', 800),\n  (3, 'Анна', 'Москва', 600),\n  (4, 'Виктор', 'Казань', 1500),\n  (5, 'Галина', 'Сочи', 2000),\n  (6, 'Борис', 'Казань', 700),\n  (7, 'Анна', 'Москва', 900),\n  (8, 'Дмитрий', 'Сочи', 400),\n  (9, 'Виктор', 'Казань', 300),\n  (10, 'Галина', 'Сочи', 1100);",
			"check": {
				"expectedQuery": "SELECT city, AVG(amount) AS avg_amount FROM orders GROUP BY city HAVING AVG(amount) > 1000 ORDER BY city;",
				"orderMatters": true
			}
		}
	],
	"quiz": [
		{
			"question": "Что делает оператор GROUP BY?",
			"options": [
				"Сортирует строки по возрастанию",
				"Собирает строки в группы по одинаковому значению столбца, чтобы посчитать по ним итоги",
				"Удаляет повторяющиеся строки",
				"Соединяет две таблицы в одну"
			],
			"correct": 1,
			"explain": "GROUP BY складывает строки в кучки по одинаковому значению (например, по городу), а затем для каждой кучки можно посчитать итог агрегатной функцией: COUNT, SUM или AVG."
		},
		{
			"question": "Какая функция посчитает количество строк в каждой группе?",
			"options": [
				"SUM",
				"AVG",
				"COUNT",
				"MAX"
			],
			"correct": 2,
			"explain": "COUNT считает количество строк. SUM складывает значения, а AVG вычисляет среднее. Чтобы узнать число заказов в городе, нужен именно COUNT(*)."
		},
		{
			"question": "В каком порядке должны идти части запроса, если нужно сгруппировать данные и отсортировать результат?",
			"options": [
				"SELECT ... FROM ... ORDER BY ... GROUP BY ...",
				"SELECT ... FROM ... GROUP BY ... ORDER BY ...",
				"GROUP BY ... SELECT ... FROM ... ORDER BY ...",
				"SELECT ... GROUP BY ... FROM ... ORDER BY ..."
			],
			"correct": 1,
			"explain": "Правильный порядок: сначала SELECT, потом FROM, затем GROUP BY и в самом конце ORDER BY. Сортировка всегда идёт последней, иначе SQL выдаст ошибку."
		}
	]
};
