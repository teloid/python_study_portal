/** @type {import('../schema').Lesson} */
export default {
	"slug": "practice-numbers-strings",
	"title": "Практикум: числа и строки",
	"level": "beginner",
	"topic": "python",
	"order": 16,
	"estimatedMinutes": 40,
	"emoji": "🧮",
	"summary": "Закрепляем переменные, арифметику, строки и f-строки на живых задачах: чаевые, инициалы, перевод минут в часы, цена со скидкой. Меньше теории — больше практики.",
	"goals": [
		"Уверенно считать и форматировать вывод",
		"Собирать строки через f-строки",
		"Комбинировать числа и текст в одной задаче",
		"Писать маленькие функции-помощники"
	],
	"theory": [
		{
			"type": "text",
			"md": "Это **практикум** - теории почти нет, зато много практики! Быстро вспомним главное, а дальше будем писать функции на разных сюжетах: чаевые, погода, оценки, деньги. Поехали!"
		},
		{
			"type": "text",
			"md": "**Арифметика.** Пять операторов, которые пригодятся сегодня: `+` `-` `*` `/` (деление даёт дробь), `//` (целая часть от деления), `%` (остаток), `**` (степень). А `round(x, 2)` округляет число до 2 знаков после точки - удобно для денег."
		},
		{
			"type": "code",
			"lang": "python",
			"runnable": true,
			"code": "print(145 // 60)      # сколько целых часов в 145 минутах\nprint(145 % 60)       # сколько минут осталось\nprint(round(2.5 * 15 / 100, 2))  # округлили до копеек",
			"output": "2\n25\n0.38"
		},
		{
			"type": "text",
			"md": "**f-строки.** Чтобы вставить значение прямо в текст, ставим букву `f` перед кавычками, а переменные пишем в фигурных скобках `{ }`. Это самый удобный способ собрать красивую строку из чисел и слов."
		},
		{
			"type": "code",
			"lang": "python",
			"runnable": true,
			"code": "city = \"Сочи\"\ntemp = 18\nprint(f\"{city}: +{temp}°C\")",
			"output": "Сочи: +18°C"
		},
		{
			"type": "callout",
			"variant": "tip",
			"title": "Функция должна возвращать, а не печатать",
			"md": "В упражнениях просят написать функцию, которая **возвращает** ответ через `return`. Это не то же самое, что `print()`! `print` показывает текст на экране, а `return` отдаёт значение обратно - именно его и проверяют тесты. Если написать `print` вместо `return`, функция вернёт `None` и тест не пройдёт."
		}
	],
	"exercises": [
		{
			"id": "tip-calculator",
			"lang": "python",
			"prompt": "Официант ждёт чаевые! Напиши функцию `tip(bill, percent)`, которая считает сумму чаевых от счёта.\n\nЧаевые - это `percent` процентов от суммы `bill`. Результат округли до 2 знаков после запятой функцией `round`.\n\nНапример, `tip(1000, 10)` - это 10% от 1000, то есть `100.0`. А `tip(999, 12)` даст `119.88`.",
			"starter": "def tip(bill, percent):\n    # процент от суммы: bill * percent / 100\n    # округли результат до 2 знаков: round(..., 2)\n    # верни ответ через return\n    pass\n",
			"hints": [
				"Процент от числа считается так: `bill * percent / 100`.",
				"Округление до двух знаков после запятой - это `round(число, 2)`.",
				"Решение в одну строку: `return round(bill * percent / 100, 2)`"
			],
			"solution": "def tip(bill, percent):\n    return round(bill * percent / 100, 2)\n",
			"tests": [
				{
					"name": "tip(1000, 10) == 100.0",
					"code": "assert tip(1000, 10) == 100.0, f\"tip(1000, 10) должно быть 100.0, а получилось {tip(1000, 10)}\""
				},
				{
					"name": "tip(2500, 15) == 375.0",
					"code": "assert tip(2500, 15) == 375.0, f\"tip(2500, 15) должно быть 375.0, а получилось {tip(2500, 15)}\""
				},
				{
					"name": "tip(999, 12) == 119.88 (проверяем округление)",
					"code": "assert tip(999, 12) == 119.88, f\"tip(999, 12) должно быть 119.88, а получилось {tip(999, 12)}\""
				},
				{
					"name": "tip(0, 20) == 0",
					"code": "assert tip(0, 20) == 0, f\"tip(0, 20) должно быть 0, а получилось {tip(0, 20)}\""
				}
			]
		},
		{
			"id": "short-name",
			"lang": "python",
			"prompt": "В документах фамилию пишут полностью, а имя и отчество сокращают до инициалов. Напиши функцию `short_name(full)`, которая из строки `\"Фамилия Имя Отчество\"` делает `\"Фамилия И.О.\"`.\n\nНапример, `short_name(\"Иванов Иван Иванович\")` вернёт `\"Иванов И.И.\"`.\n\nПодсказка: разбей строку на слова методом `.split()`. Первое слово (`parts[0]`) - это фамилия, она остаётся целиком. У остальных слов бери первую букву `word[0]`, делай её заглавной `.upper()` и добавляй точку.",
			"starter": "def short_name(full):\n    parts = full.split()\n    surname = parts[0]          # фамилия целиком\n    initials = \"\"\n    # пройди по остальным словам parts[1:] циклом for\n    # у каждого возьми word[0].upper() и добавь точку\n    # верни surname + \" \" + initials\n    pass\n",
			"hints": [
				"`full.split()` вернёт список слов, например `['Иванов', 'Иван', 'Иванович']`.",
				"Срез `parts[1:]` - это все слова кроме первого (без фамилии). По ним и идём циклом `for word in parts[1:]:`.",
				"Внутри цикла собирай: `initials = initials + word[0].upper() + '.'`, а в конце верни `surname + ' ' + initials`."
			],
			"solution": "def short_name(full):\n    parts = full.split()\n    surname = parts[0]\n    initials = \"\"\n    for word in parts[1:]:\n        initials = initials + word[0].upper() + \".\"\n    return surname + \" \" + initials\n",
			"tests": [
				{
					"name": "short_name('Иванов Иван Иванович') == 'Иванов И.И.'",
					"code": "assert short_name('Иванов Иван Иванович') == 'Иванов И.И.', f\"получилось {short_name('Иванов Иван Иванович')!r}\""
				},
				{
					"name": "short_name('Петрова Мария Сергеевна') == 'Петрова М.С.'",
					"code": "assert short_name('Петрова Мария Сергеевна') == 'Петрова М.С.', f\"получилось {short_name('Петрова Мария Сергеевна')!r}\""
				},
				{
					"name": "short_name('Кузнецов Олег Петрович') == 'Кузнецов О.П.'",
					"code": "assert short_name('Кузнецов Олег Петрович') == 'Кузнецов О.П.', f\"получилось {short_name('Кузнецов Олег Петрович')!r}\""
				}
			]
		},
		{
			"id": "format-time",
			"lang": "python",
			"prompt": "В путешествии время в пути часто дают в минутах, а хочется читать по-человечески. Напиши функцию `format_time(total_minutes)`, которая переводит минуты в строку вида `\"2 ч 5 мин\"`.\n\nНапример, `format_time(125)` вернёт `\"2 ч 5 мин\"` (125 минут = 2 часа и 5 минут).\n\nПодсказка: целые часы - это `total_minutes // 60`, а оставшиеся минуты - `total_minutes % 60`. Собери строку через f-строку.",
			"starter": "def format_time(total_minutes):\n    # hours = total_minutes // 60\n    # minutes = total_minutes % 60\n    # верни f-строку вида f\"{hours} ч {minutes} мин\"\n    pass\n",
			"hints": [
				"Целое число часов - это целочисленное деление на 60: `total_minutes // 60`.",
				"Оставшиеся минуты - это остаток от деления на 60: `total_minutes % 60`.",
				"Собери ответ f-строкой: `return f'{hours} ч {minutes} мин'`"
			],
			"solution": "def format_time(total_minutes):\n    hours = total_minutes // 60\n    minutes = total_minutes % 60\n    return f\"{hours} ч {minutes} мин\"\n",
			"tests": [
				{
					"name": "format_time(125) == '2 ч 5 мин'",
					"code": "assert format_time(125) == '2 ч 5 мин', f\"получилось {format_time(125)!r}\""
				},
				{
					"name": "format_time(60) == '1 ч 0 мин'",
					"code": "assert format_time(60) == '1 ч 0 мин', f\"получилось {format_time(60)!r}\""
				},
				{
					"name": "format_time(0) == '0 ч 0 мин'",
					"code": "assert format_time(0) == '0 ч 0 мин', f\"получилось {format_time(0)!r}\""
				},
				{
					"name": "format_time(59) == '0 ч 59 мин'",
					"code": "assert format_time(59) == '0 ч 59 мин', f\"получилось {format_time(59)!r}\""
				},
				{
					"name": "format_time(200) == '3 ч 20 мин'",
					"code": "assert format_time(200) == '3 ч 20 мин', f\"получилось {format_time(200)!r}\""
				}
			]
		},
		{
			"id": "price-with-discount",
			"lang": "python",
			"prompt": "В магазине распродажа! Напиши функцию `price_with_discount(price, percent)`, которая считает **итоговую цену** товара после скидки в `percent` процентов.\n\nЦена после скидки - это исходная цена минус скидка. Результат округли до 2 знаков функцией `round`.\n\nНапример, `price_with_discount(1000, 20)` - скидка 20%, значит платим `800.0`. А `price_with_discount(999, 30)` даст `699.3`.",
			"starter": "def price_with_discount(price, percent):\n    # размер скидки: price * percent / 100\n    # итоговая цена: price минус скидка\n    # округли до 2 знаков и верни через return\n    pass\n",
			"hints": [
				"Сначала посчитай саму скидку: `price * percent / 100`.",
				"Итоговая цена - это `price - price * percent / 100`.",
				"Оберни всё в round: `return round(price - price * percent / 100, 2)`"
			],
			"solution": "def price_with_discount(price, percent):\n    return round(price - price * percent / 100, 2)\n",
			"tests": [
				{
					"name": "price_with_discount(1000, 20) == 800.0",
					"code": "assert price_with_discount(1000, 20) == 800.0, f\"получилось {price_with_discount(1000, 20)}\""
				},
				{
					"name": "price_with_discount(1500, 10) == 1350.0",
					"code": "assert price_with_discount(1500, 10) == 1350.0, f\"получилось {price_with_discount(1500, 10)}\""
				},
				{
					"name": "price_with_discount(999, 30) == 699.3 (округление)",
					"code": "assert price_with_discount(999, 30) == 699.3, f\"получилось {price_with_discount(999, 30)}\""
				},
				{
					"name": "price_with_discount(500, 0) == 500 (скидки нет)",
					"code": "assert price_with_discount(500, 0) == 500, f\"получилось {price_with_discount(500, 0)}\""
				}
			]
		},
		{
			"id": "weather-report",
			"lang": "python",
			"prompt": "Сделаем сводку погоды. Напиши функцию `weather_report(city, temp)`, которая возвращает строку вида `\"Москва: +5°C\"`.\n\nПравило: если температура **выше нуля**, перед числом ставим знак `+`. Если ноль или мороз (минус), плюс не нужен - минус у отрицательных чисел Python поставит сам.\n\nПримеры:\n- `weather_report(\"Москва\", 5)` -> `\"Москва: +5°C\"`\n- `weather_report(\"Норильск\", -30)` -> `\"Норильск: -30°C\"`\n- `weather_report(\"Сочи\", 0)` -> `\"Сочи: 0°C\"`",
			"starter": "def weather_report(city, temp):\n    # если temp > 0, знак sign = \"+\", иначе sign = \"\" (пустая строка)\n    # верни f-строку: f\"{city}: {sign}{temp}°C\"\n    pass\n",
			"hints": [
				"Заведи переменную `sign`: через `if temp > 0:` поставь `sign = '+'`, иначе `sign = ''` (пустая строка).",
				"У отрицательного числа минус уже есть, поэтому для него плюс добавлять не надо - оставляем пустую строку.",
				"Собери результат f-строкой: `return f'{city}: {sign}{temp}°C'`"
			],
			"solution": "def weather_report(city, temp):\n    if temp > 0:\n        sign = \"+\"\n    else:\n        sign = \"\"\n    return f\"{city}: {sign}{temp}°C\"\n",
			"tests": [
				{
					"name": "weather_report('Москва', 5) == 'Москва: +5°C'",
					"code": "assert weather_report('Москва', 5) == 'Москва: +5°C', f\"получилось {weather_report('Москва', 5)!r}\""
				},
				{
					"name": "weather_report('Норильск', -30) == 'Норильск: -30°C'",
					"code": "assert weather_report('Норильск', -30) == 'Норильск: -30°C', f\"получилось {weather_report('Норильск', -30)!r}\""
				},
				{
					"name": "weather_report('Сочи', 0) == 'Сочи: 0°C' (ноль без плюса)",
					"code": "assert weather_report('Сочи', 0) == 'Сочи: 0°C', f\"получилось {weather_report('Сочи', 0)!r}\""
				},
				{
					"name": "weather_report('Казань', 18) == 'Казань: +18°C'",
					"code": "assert weather_report('Казань', 18) == 'Казань: +18°C', f\"получилось {weather_report('Казань', 18)!r}\""
				}
			]
		}
	],
	"quiz": [
		{
			"question": "Сколько будет 125 // 60 (целочисленное деление)?",
			"options": [
				"2",
				"2.08",
				"5",
				"60"
			],
			"correct": 0,
			"explain": "Оператор // даёт только целую часть от деления. 60 помещается в 125 два раза (получится 120), поэтому результат - 2. Дробь отбрасывается."
		},
		{
			"question": "Что вернёт round(119.876, 2)?",
			"options": [
				"119.88",
				"119.87",
				"119.9",
				"120"
			],
			"correct": 0,
			"explain": "round(x, 2) округляет до 2 знаков после точки. Третий знак 6 округляет вторую цифру вверх: 119.876 -> 119.88."
		},
		{
			"question": "Что выведет этот код?\n```\nname = \"Аня\"\nage = 25\nprint(f\"{name}, тебе {age}\")\n```",
			"options": [
				"Аня, тебе 25",
				"{name}, тебе {age}",
				"name, тебе age",
				"Аня, тебе age"
			],
			"correct": 0,
			"explain": "Буква f перед кавычками включает f-строку: то, что стоит в фигурных скобках, заменяется значением переменной. Поэтому {name} станет 'Аня', а {age} станет '25'."
		}
	]
};
