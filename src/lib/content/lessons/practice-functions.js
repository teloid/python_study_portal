/** @type {import('../schema').Lesson} */
export default {
	"slug": "practice-functions",
	"title": "Практикум: свои функции",
	"level": "intermediate",
	"topic": "python",
	"order": 19,
	"estimatedMinutes": 45,
	"emoji": "🧩",
	"summary": "Собираем маленькие функции-утилиты и учимся их комбинировать (композиция). Разбиваем задачу на части и переиспользуем код.",
	"goals": [
		"Писать функции с параметрами и return",
		"Комбинировать функции (одна использует другую)",
		"Разбивать задачу на маленькие функции",
		"Переиспользовать код вместо повторов"
	],
	"theory": [
		{
			"type": "text",
			"md": "Ты уже знаешь, как объявлять свои функции. Сегодня - чистая практика: соберём маленькие полезные функции-утилиты и научимся **соединять** их друг с другом.\n\nБыстрое напоминание: функция объявляется через `def`, принимает данные через параметры и **отдаёт** результат через `return`. Без `return` функция вернёт `None`."
		},
		{
			"type": "code",
			"lang": "python",
			"code": "def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(10))\nprint(is_even(7))",
			"runnable": true,
			"output": "True\nFalse"
		},
		{
			"type": "callout",
			"variant": "tip",
			"title": "Функция может вызывать другую функцию",
			"md": "Это и есть **композиция**: одна функция пользуется результатом другой. Сначала пишем маленькие кирпичики (`average`, `maximum`), а потом собираем из них большую функцию. Так код проще читать и не нужно повторять одно и то же."
		},
		{
			"type": "code",
			"lang": "python",
			"code": "def average(nums):\n    return sum(nums) / len(nums)\n\ndef describe(nums):\n    return \"Средняя: \" + str(average(nums))\n\nprint(describe([4, 5, 6]))",
			"runnable": true,
			"output": "Средняя: 5.0"
		},
		{
			"type": "callout",
			"variant": "info",
			"title": "Полезные приёмы для строк",
			"md": "`.strip()` убирает пробелы по краям строки, а `.capitalize()` делает первую букву заглавной, а остальные - строчными. Их можно вызвать подряд: `s.strip().capitalize()`. Пригодится в упражнении с именами."
		}
	],
	"exercises": [
		{
			"id": "is-even-shop",
			"lang": "python",
			"prompt": "В магазине акция: скидку дают на товары с **чётным** номером. Напиши функцию `is_even(n)`, которая принимает целое число `n` и **возвращает** `True`, если оно чётное, и `False`, если нечётное.\n\nПодсказка: число чётное, если остаток от деления на 2 равен нулю.",
			"starter": "def is_even(n):\n    # верни True, если n чётное, иначе False\n    # пригодится остаток от деления: n % 2\n    pass\n",
			"hints": [
				"Остаток от деления на 2 берётся так: `n % 2`.",
				"Число чётное, когда `n % 2` равно `0`.",
				"Само сравнение уже даёт True или False: `return n % 2 == 0`."
			],
			"solution": "def is_even(n):\n    return n % 2 == 0\n",
			"tests": [
				{
					"name": "is_even(4) == True",
					"code": "assert is_even(4) == True, 'Число 4 чётное'"
				},
				{
					"name": "is_even(7) == False",
					"code": "assert is_even(7) == False, 'Число 7 нечётное'"
				},
				{
					"name": "is_even(0) == True",
					"code": "assert is_even(0) == True, 'Ноль считается чётным'"
				},
				{
					"name": "is_even(-2) == True",
					"code": "assert is_even(-2) == True, 'Число -2 чётное'"
				},
				{
					"name": "is_even(-3) == False",
					"code": "assert is_even(-3) == False, 'Число -3 нечётное'"
				},
				{
					"name": "is_even(100) == True",
					"code": "assert is_even(100) == True, 'Число 100 чётное'"
				}
			]
		},
		{
			"id": "clamp-weather",
			"lang": "python",
			"prompt": "Датчик погоды иногда сбоит и показывает нереальные значения. Напиши функцию `clamp(x, lo, hi)`, которая **зажимает** число `x` в диапазон от `lo` до `hi`:\n- если `x` меньше `lo` - верни `lo`;\n- если `x` больше `hi` - верни `hi`;\n- иначе верни само `x`.\n\nНапример, комфортная температура в комнате от 18 до 24. `clamp(25, 18, 24)` вернёт 24, а `clamp(10, 18, 24)` вернёт 18.",
			"starter": "def clamp(x, lo, hi):\n    # если x меньше lo - верни lo\n    # если x больше hi - верни hi\n    # иначе верни x\n    pass\n",
			"hints": [
				"Сначала проверь нижнюю границу: `if x < lo: return lo`.",
				"Потом верхнюю: `if x > hi: return hi`.",
				"Если ни одно условие не сработало, значит x уже внутри - просто `return x`."
			],
			"solution": "def clamp(x, lo, hi):\n    if x < lo:\n        return lo\n    if x > hi:\n        return hi\n    return x\n",
			"tests": [
				{
					"name": "clamp(25, 18, 24) == 24",
					"code": "assert clamp(25, 18, 24) == 24, 'Больше верхней границы - вернуть 24'"
				},
				{
					"name": "clamp(10, 18, 24) == 18",
					"code": "assert clamp(10, 18, 24) == 18, 'Меньше нижней границы - вернуть 18'"
				},
				{
					"name": "clamp(20, 18, 24) == 20",
					"code": "assert clamp(20, 18, 24) == 20, 'Внутри диапазона - вернуть само число'"
				},
				{
					"name": "clamp(18, 18, 24) == 18",
					"code": "assert clamp(18, 18, 24) == 18, 'Ровно на нижней границе - вернуть 18'"
				},
				{
					"name": "clamp(24, 18, 24) == 24",
					"code": "assert clamp(24, 18, 24) == 24, 'Ровно на верхней границе - вернуть 24'"
				},
				{
					"name": "clamp(-5, 0, 100) == 0",
					"code": "assert clamp(-5, 0, 100) == 0, 'Отрицательное ниже нуля - вернуть 0'"
				},
				{
					"name": "clamp(150, 0, 100) == 100",
					"code": "assert clamp(150, 0, 100) == 100, 'Выше сотни - вернуть 100'"
				}
			]
		},
		{
			"id": "normalize-name",
			"lang": "python",
			"prompt": "В списке учеников имена введены как попало: лишние пробелы, разный регистр букв. Напиши функцию `normalize_name(s)`, которая приводит имя к аккуратному виду:\n- убирает пробелы по краям;\n- делает первую букву заглавной, а остальные строчными.\n\nНапример, `normalize_name('  аННА  ')` должно вернуть `'Анна'`.",
			"starter": "def normalize_name(s):\n    # убери пробелы по краям: .strip()\n    # приведи регистр: .capitalize()\n    pass\n",
			"hints": [
				"Пробелы по краям убирает метод `.strip()`.",
				"Первую букву заглавной (остальные строчными) делает `.capitalize()`.",
				"Методы можно вызвать подряд, друг за другом: `s.strip().capitalize()`."
			],
			"solution": "def normalize_name(s):\n    return s.strip().capitalize()\n",
			"tests": [
				{
					"name": "normalize_name('  анна  ') == 'Анна'",
					"code": "assert normalize_name('  анна  ') == 'Анна', 'Уберём пробелы и сделаем заглавную'"
				},
				{
					"name": "normalize_name('ИВАН') == 'Иван'",
					"code": "assert normalize_name('ИВАН') == 'Иван', 'Заглавные буквы должны стать строчными, кроме первой'"
				},
				{
					"name": "normalize_name('пётр') == 'Пётр'",
					"code": "assert normalize_name('пётр') == 'Пётр', 'Первая буква станет заглавной'"
				},
				{
					"name": "normalize_name('  мария') == 'Мария'",
					"code": "assert normalize_name('  мария') == 'Мария', 'Пробелы слева убираются'"
				},
				{
					"name": "normalize_name('оЛЕГ ') == 'Олег'",
					"code": "assert normalize_name('оЛЕГ ') == 'Олег', 'Регистр приводится к аккуратному виду'"
				}
			]
		},
		{
			"id": "describe-grades",
			"lang": "python",
			"prompt": "Соберём отчёт по оценкам через **композицию функций**. Напиши три функции:\n- `average(nums)` - возвращает среднее арифметическое списка чисел (сумма делить на количество).\n- `maximum(nums)` - возвращает наибольшее число в списке (напиши сам, циклом, без готового `max`).\n- `describe(nums)` - собирает строку-отчёт вида `'Средний балл: 4.0, лучший: 6'`. Внутри обязательно **вызови** уже написанные `average` и `maximum`, а не считай заново.\n\nПодсказка: число превращается в строку через `str(...)`.",
			"starter": "def average(nums):\n    # сумма делить на количество: sum(nums) / len(nums)\n    pass\n\ndef maximum(nums):\n    # пройди список циклом и найди наибольшее\n    pass\n\ndef describe(nums):\n    # собери строку, используя average(nums) и maximum(nums)\n    pass\n",
			"hints": [
				"`average` это `return sum(nums) / len(nums)`.",
				"В `maximum` заведи переменную `best = nums[0]`, пройди `for n in nums` и обновляй `best`, если `n > best`.",
				"В `describe` соедини текст и числа через `str(...)`: `'Средний балл: ' + str(average(nums)) + ', лучший: ' + str(maximum(nums))`."
			],
			"solution": "def average(nums):\n    return sum(nums) / len(nums)\n\ndef maximum(nums):\n    best = nums[0]\n    for n in nums:\n        if n > best:\n            best = n\n    return best\n\ndef describe(nums):\n    return 'Средний балл: ' + str(average(nums)) + ', лучший: ' + str(maximum(nums))\n",
			"tests": [
				{
					"name": "average([2, 4, 6]) == 4.0",
					"code": "assert average([2, 4, 6]) == 4.0, 'Среднее из 2,4,6 равно 4.0'"
				},
				{
					"name": "average([5]) == 5.0",
					"code": "assert average([5]) == 5.0, 'Среднее из одного числа равно ему самому'"
				},
				{
					"name": "maximum([3, 9, 1]) == 9",
					"code": "assert maximum([3, 9, 1]) == 9, 'Наибольшее из 3,9,1 это 9'"
				},
				{
					"name": "maximum([4, 4, 2]) == 4",
					"code": "assert maximum([4, 4, 2]) == 4, 'Наибольшее с повтором это 4'"
				},
				{
					"name": "maximum([-3, -1, -7]) == -1",
					"code": "assert maximum([-3, -1, -7]) == -1, 'Наибольшее среди отрицательных это -1'"
				},
				{
					"name": "describe([2, 4, 6]) собирает отчёт",
					"code": "assert describe([2, 4, 6]) == 'Средний балл: 4.0, лучший: 6', 'Отчёт должен использовать average и maximum'"
				},
				{
					"name": "describe([5, 5, 5, 5]) собирает отчёт",
					"code": "assert describe([5, 5, 5, 5]) == 'Средний балл: 5.0, лучший: 5', 'Отчёт для одинаковых оценок'"
				}
			]
		},
		{
			"id": "trip-budget",
			"lang": "python",
			"prompt": "Планируем путешествие и считаем, хватит ли денег - снова через **композицию**. Напиши три функции:\n- `day_cost(hotel, food)` - стоимость одного дня: цена отеля плюс еда.\n- `trip_cost(hotel, food, days)` - стоимость всей поездки. Внутри **вызови** `day_cost` и умножь на число дней `days`.\n- `enough(budget, hotel, food, days)` - возвращает `True`, если бюджета `budget` хватает на поездку (то есть бюджет **не меньше** её стоимости), иначе `False`. Внутри **вызови** `trip_cost`.\n\nНапример: отель 3000, еда 1500, 3 дня - поездка стоит 13500.",
			"starter": "def day_cost(hotel, food):\n    # стоимость одного дня\n    pass\n\ndef trip_cost(hotel, food, days):\n    # используй day_cost и умножь на days\n    pass\n\ndef enough(budget, hotel, food, days):\n    # хватает ли бюджета: используй trip_cost\n    pass\n",
			"hints": [
				"`day_cost` это `return hotel + food`.",
				"В `trip_cost` позови уже готовую функцию: `return day_cost(hotel, food) * days`.",
				"В `enough` сравни бюджет со стоимостью: `return budget >= trip_cost(hotel, food, days)`."
			],
			"solution": "def day_cost(hotel, food):\n    return hotel + food\n\ndef trip_cost(hotel, food, days):\n    return day_cost(hotel, food) * days\n\ndef enough(budget, hotel, food, days):\n    return budget >= trip_cost(hotel, food, days)\n",
			"tests": [
				{
					"name": "day_cost(3000, 1500) == 4500",
					"code": "assert day_cost(3000, 1500) == 4500, 'День стоит отель плюс еда'"
				},
				{
					"name": "trip_cost(3000, 1500, 3) == 13500",
					"code": "assert trip_cost(3000, 1500, 3) == 13500, 'Три дня по 4500 это 13500'"
				},
				{
					"name": "trip_cost(2000, 1000, 5) == 15000",
					"code": "assert trip_cost(2000, 1000, 5) == 15000, 'Пять дней по 3000 это 15000'"
				},
				{
					"name": "enough(20000, 3000, 1500, 3) == True",
					"code": "assert enough(20000, 3000, 1500, 3) == True, '20000 хватает на поездку за 13500'"
				},
				{
					"name": "enough(10000, 3000, 1500, 3) == False",
					"code": "assert enough(10000, 3000, 1500, 3) == False, '10000 не хватает на поездку за 13500'"
				},
				{
					"name": "enough(13500, 3000, 1500, 3) == True",
					"code": "assert enough(13500, 3000, 1500, 3) == True, 'Ровно 13500 - хватает впритык'"
				}
			]
		}
	],
	"quiz": [
		{
			"question": "Функция `describe(nums)` внутри себя вызывает `average(nums)` и `maximum(nums)`. Как называется такой приём, когда одна функция пользуется результатом других?",
			"options": [
				"Рекурсия",
				"Композиция функций",
				"Копирование кода",
				"Импорт"
			],
			"correct": 1,
			"explain": "Когда одна функция вызывает другие и собирает из их результатов свой ответ - это композиция. Она позволяет строить сложное из простых кирпичиков и не повторять код."
		},
		{
			"question": "Что вернёт вызов `clamp(20, 18, 24)`, если `clamp` зажимает число в диапазон от lo до hi?",
			"options": [
				"18",
				"24",
				"20",
				"True"
			],
			"correct": 2,
			"explain": "Число 20 уже внутри диапазона 18..24, поэтому ни одно из условий (меньше lo, больше hi) не срабатывает, и функция возвращает само число - 20."
		},
		{
			"question": "Почему `is_even(n)` лучше заканчивать строкой `return n % 2 == 0`, а не `print(n % 2 == 0)`?",
			"options": [
				"Разницы нет, оба варианта одинаковы",
				"`print` показывает результат человеку, а `return` отдаёт значение обратно в код, чтобы его можно было сохранить или сравнить",
				"`print` работает быстрее",
				"`return` умеет печатать на экран, а `print` - нет"
			],
			"correct": 1,
			"explain": "`print` только показывает текст на экране. Чтобы результат функции можно было сохранить в переменную, сравнить или передать дальше (например в assert-тестах), функция должна его вернуть через `return`."
		}
	]
};
