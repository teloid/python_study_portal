/** @type {import('../schema').Lesson} */
export default {
	"slug": "practice-lists-dicts",
	"title": "Практикум: списки и словари",
	"level": "intermediate",
	"topic": "python",
	"order": 18,
	"estimatedMinutes": 45,
	"emoji": "🗃️",
	"summary": "Обрабатываем данные: статистика оценок, частота слов, корзина покупок, топ элементов. Списки и словари вместе с циклами на практике.",
	"goals": [
		"Обходить и обрабатывать списки и словари",
		"Считать статистику по данным",
		"Строить словари из данных",
		"Находить максимум/минимум и итоги"
	],
	"theory": [
		{
			"type": "text",
			"md": "Привет! Это **практикум** - теории почти нет, зато много практики. Мы вспомним три главных инструмента: **список** `[]`, **словарь** `{}` и цикл `for`. Разомнёмся на паре напоминалок - и в бой!"
		},
		{
			"type": "text",
			"md": "**Список** хранит элементы по порядку, доступ по индексу. У списка полезны функции `sum()` (сумма) и `len()` (сколько элементов). **Словарь** хранит пары ключ-значение, доступ по ключу. Перебрать словарь удобно через `.items()` - сразу пары `(ключ, значение)`."
		},
		{
			"type": "code",
			"lang": "python",
			"code": "nums = [10, 20, 30]\nprint(sum(nums), len(nums))\n\nprices = {\"чай\": 50, \"кофе\": 120}\nfor name, price in prices.items():\n    print(name, price)",
			"runnable": true,
			"output": "60 3\nчай 50\nкофе 120"
		},
		{
			"type": "callout",
			"variant": "tip",
			"title": "Два приёма, которые пригодятся сегодня",
			"md": "1. **Счётчик частот:** заводим пустой словарь и для каждого элемента пишем `d[x] = d.get(x, 0) + 1`. Метод `.get(x, 0)` берёт текущий счётчик (или 0, если элемента ещё не было).\n2. **Пустой случай:** прежде чем делить на длину или искать максимум, подумай, что вернуть для пустого списка/словаря. Обычно это `0` или `None`."
		}
	],
	"exercises": [
		{
			"id": "srednee-arifmeticheskoe",
			"lang": "python",
			"prompt": "Синоптики намеряли температуру за несколько дней. Напиши функцию `average(nums)`, которая принимает **список чисел** и возвращает их **среднее арифметическое** (сумма делится на количество).\n\nНапример, для `[2, 4, 6]` вернётся `4.0`. \n\n**Важно:** если список пустой, верни `0` (делить на ноль нельзя!).",
			"starter": "def average(nums):\n    # 1. Если список пустой - верни 0\n    # 2. Иначе посчитай сумму через sum(nums)\n    # 3. Раздели на количество элементов len(nums)\n    # 4. Верни результат\n    pass\n",
			"hints": [
				"Сначала обработай пустой список: `if not nums: return 0`. Так мы не будем делить на ноль.",
				"Сумму даёт `sum(nums)`, а количество - `len(nums)`. Среднее = сумма / количество.",
				"Решение целиком:\n```python\ndef average(nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)\n```"
			],
			"solution": "def average(nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)",
			"tests": [
				{
					"name": "average([2, 4, 6]) == 4",
					"code": "assert average([2, 4, 6]) == 4, \"Среднее из 2, 4, 6 равно 4\""
				},
				{
					"name": "average([]) == 0 (пустой список)",
					"code": "assert average([]) == 0, \"Для пустого списка вернись 0, а не ошибку\""
				},
				{
					"name": "average([10]) == 10",
					"code": "assert average([10]) == 10, \"Одно число - оно же и среднее\""
				},
				{
					"name": "average([1, 2]) == 1.5",
					"code": "assert average([1, 2]) == 1.5, \"Среднее из 1 и 2 равно 1.5\""
				},
				{
					"name": "average([5, 5, 5, 5]) == 5",
					"code": "assert average([5, 5, 5, 5]) == 5, \"Все одинаковые - среднее равно им\""
				}
			]
		},
		{
			"id": "chastota-slov",
			"lang": "python",
			"prompt": "В дневнике погоды записаны слова, описывающие каждый день. Напиши функцию `word_count(words)`, которая принимает **список слов** и возвращает **словарь**: ключ - слово, значение - сколько раз оно встретилось.\n\nНапример, для `[\"дождь\", \"солнце\", \"дождь\"]` вернётся `{\"дождь\": 2, \"солнце\": 1}`. Для пустого списка - пустой словарь `{}`.\n\nПодсказка: используй приём `result[word] = result.get(word, 0) + 1`.",
			"starter": "def word_count(words):\n    # 1. Заведи пустой словарь result\n    # 2. Пройди по словам циклом for\n    # 3. Для каждого слова прибавь 1 через .get(word, 0) + 1\n    # 4. Верни result\n    pass\n",
			"hints": [
				"Создай пустой словарь до цикла: `result = {}`. Потом перебирай слова: `for word in words:`.",
				"Внутри цикла увеличивай счётчик через `.get()` с дефолтом 0: `result[word] = result.get(word, 0) + 1`.",
				"Решение целиком:\n```python\ndef word_count(words):\n    result = {}\n    for word in words:\n        result[word] = result.get(word, 0) + 1\n    return result\n```"
			],
			"solution": "def word_count(words):\n    result = {}\n    for word in words:\n        result[word] = result.get(word, 0) + 1\n    return result",
			"tests": [
				{
					"name": "word_count([\"дождь\", \"солнце\", \"дождь\"]) == {\"дождь\": 2, \"солнце\": 1}",
					"code": "assert word_count([\"дождь\", \"солнце\", \"дождь\"]) == {\"дождь\": 2, \"солнце\": 1}, \"Дождь встретился 2 раза, солнце - 1\""
				},
				{
					"name": "word_count([]) == {}",
					"code": "assert word_count([]) == {}, \"Для пустого списка вернись пустой словарь\""
				},
				{
					"name": "word_count([\"туман\", \"туман\", \"туман\"]) == {\"туман\": 3}",
					"code": "assert word_count([\"туман\", \"туман\", \"туман\"]) == {\"туман\": 3}, \"Три одинаковых слова -> счётчик 3\""
				},
				{
					"name": "word_count([\"a\", \"b\", \"c\"]) == {\"a\": 1, \"b\": 1, \"c\": 1}",
					"code": "assert word_count([\"a\", \"b\", \"c\"]) == {\"a\": 1, \"b\": 1, \"c\": 1}, \"Все разные -> у каждого по 1\""
				}
			]
		},
		{
			"id": "kljuch-maksimuma",
			"lang": "python",
			"prompt": "На соревновании у каждого участника свой счёт очков. Напиши функцию `max_key(counts)`, которая принимает **словарь** (ключ - имя, значение - число) и возвращает **ключ с наибольшим значением** (имя победителя).\n\nНапример, для `{\"Аня\": 5, \"Боря\": 4, \"Вера\": 3}` вернётся `\"Аня\"`. Для пустого словаря верни `None`.\n\nПодсказка: перебирай пары через `.items()` и запоминай лучший ключ.",
			"starter": "def max_key(counts):\n    # 1. Заведи best_key = None и best_value = None\n    # 2. Пройди по парам через .items()\n    # 3. Если значение больше текущего лучшего - обнови best_key и best_value\n    # 4. Верни best_key\n    pass\n",
			"hints": [
				"Заведи две переменные до цикла: `best_key = None` и `best_value = None`. В них будем хранить рекордсмена.",
				"В цикле `for key, value in counts.items():` проверяй: `if best_value is None or value > best_value:` - тогда запоминай новый ключ и значение.",
				"Решение целиком:\n```python\ndef max_key(counts):\n    best_key = None\n    best_value = None\n    for key, value in counts.items():\n        if best_value is None or value > best_value:\n            best_key = key\n            best_value = value\n    return best_key\n```"
			],
			"solution": "def max_key(counts):\n    best_key = None\n    best_value = None\n    for key, value in counts.items():\n        if best_value is None or value > best_value:\n            best_key = key\n            best_value = value\n    return best_key",
			"tests": [
				{
					"name": "max_key({\"Аня\": 5, \"Боря\": 4, \"Вера\": 3}) == \"Аня\"",
					"code": "assert max_key({\"Аня\": 5, \"Боря\": 4, \"Вера\": 3}) == \"Аня\", \"У Ани больше всех очков\""
				},
				{
					"name": "max_key({\"кофе\": 2, \"чай\": 10, \"сок\": 1}) == \"чай\"",
					"code": "assert max_key({\"кофе\": 2, \"чай\": 10, \"сок\": 1}) == \"чай\", \"У чая максимум - 10\""
				},
				{
					"name": "max_key({\"один\": 7}) == \"один\"",
					"code": "assert max_key({\"один\": 7}) == \"один\", \"Единственный ключ и есть максимум\""
				},
				{
					"name": "max_key({}) is None",
					"code": "assert max_key({}) is None, \"Для пустого словаря вернись None\""
				}
			]
		},
		{
			"id": "summa-korziny",
			"lang": "python",
			"prompt": "В корзине интернет-магазина у каждого товара есть цена и количество. Корзина - это **словарь**: ключ - название товара, значение - **вложенный словарь** вида `{\"price\": цена, \"qty\": количество}`.\n\nНапиши функцию `total_cost(cart)`, которая возвращает **итоговую стоимость** корзины (для каждого товара цена умножается на количество, всё складывается).\n\nНапример, для `{\"яблоки\": {\"price\": 80, \"qty\": 3}}` вернётся `240`. Для пустой корзины - `0`.",
			"starter": "def total_cost(cart):\n    # 1. Заведи total = 0\n    # 2. Пройди по значениям корзины через .values() - это словарики с price и qty\n    # 3. Прибавляй к total произведение item[\"price\"] * item[\"qty\"]\n    # 4. Верни total\n    pass\n",
			"hints": [
				"Начни с накопителя: `total = 0`. Перебирать удобно значения: `for item in cart.values():` - каждый `item` это словарь с ключами `\"price\"` и `\"qty\"`.",
				"Стоимость одного товара - это `item[\"price\"] * item[\"qty\"]`. Прибавляй её к `total`.",
				"Решение целиком:\n```python\ndef total_cost(cart):\n    total = 0\n    for item in cart.values():\n        total += item[\"price\"] * item[\"qty\"]\n    return total\n```"
			],
			"solution": "def total_cost(cart):\n    total = 0\n    for item in cart.values():\n        total += item[\"price\"] * item[\"qty\"]\n    return total",
			"tests": [
				{
					"name": "две позиции: 80*3 + 40*2 == 320",
					"code": "cart = {\"яблоки\": {\"price\": 80, \"qty\": 3}, \"хлеб\": {\"price\": 40, \"qty\": 2}}\nassert total_cost(cart) == 320, \"80*3 + 40*2 = 320\""
				},
				{
					"name": "total_cost({}) == 0",
					"code": "assert total_cost({}) == 0, \"Пустая корзина стоит 0\""
				},
				{
					"name": "одна позиция: 70*1 == 70",
					"code": "assert total_cost({\"молоко\": {\"price\": 70, \"qty\": 1}}) == 70, \"70 * 1 = 70\""
				},
				{
					"name": "нулевое количество не добавляет стоимость",
					"code": "cart = {\"a\": {\"price\": 10, \"qty\": 0}, \"b\": {\"price\": 5, \"qty\": 4}}\nassert total_cost(cart) == 20, \"10*0 + 5*4 = 20\""
				}
			]
		},
		{
			"id": "srednij-ball-klassa",
			"lang": "python",
			"prompt": "У каждого ученика есть **список** его оценок. Все ученики собраны в **словарь**: ключ - имя, значение - список оценок.\n\nНапиши функцию `class_average(grades)`, которая возвращает **средний балл по всему классу** (все оценки всех учеников складываются и делятся на общее число оценок).\n\nНапример, для `{\"Аня\": [5, 4], \"Боря\": [3, 3]}` вернётся `3.75`. Если оценок вообще нет (пустой словарь или у всех пустые списки) - верни `0`.",
			"starter": "def class_average(grades):\n    # 1. Заведи total = 0 (сумма всех оценок) и count = 0 (сколько оценок всего)\n    # 2. Пройди по спискам оценок через .values()\n    # 3. Прибавляй sum(scores) к total и len(scores) к count\n    # 4. Если count == 0 - верни 0, иначе total / count\n    pass\n",
			"hints": [
				"Нужны два накопителя: `total = 0` для суммы оценок и `count = 0` для их количества.",
				"Перебирай списки оценок: `for scores in grades.values():`, внутри `total += sum(scores)` и `count += len(scores)`.",
				"В конце защитись от деления на ноль:\n```python\ndef class_average(grades):\n    total = 0\n    count = 0\n    for scores in grades.values():\n        total += sum(scores)\n        count += len(scores)\n    if count == 0:\n        return 0\n    return total / count\n```"
			],
			"solution": "def class_average(grades):\n    total = 0\n    count = 0\n    for scores in grades.values():\n        total += sum(scores)\n        count += len(scores)\n    if count == 0:\n        return 0\n    return total / count",
			"tests": [
				{
					"name": "class_average({\"Аня\": [5, 4], \"Боря\": [3, 3]}) == 3.75",
					"code": "assert class_average({\"Аня\": [5, 4], \"Боря\": [3, 3]}) == 3.75, \"(5+4+3+3)/4 = 3.75\""
				},
				{
					"name": "class_average({}) == 0 (нет учеников)",
					"code": "assert class_average({}) == 0, \"Нет учеников - средний балл 0\""
				},
				{
					"name": "class_average({\"Один\": [5, 5, 5]}) == 5",
					"code": "assert class_average({\"Один\": [5, 5, 5]}) == 5, \"Все пятёрки - среднее 5\""
				},
				{
					"name": "все списки пустые -> 0",
					"code": "assert class_average({\"Пусто\": []}) == 0, \"Оценок нет вообще - вернись 0, а не ошибку\""
				},
				{
					"name": "class_average({\"A\": [2], \"B\": [4]}) == 3",
					"code": "assert class_average({\"A\": [2], \"B\": [4]}) == 3, \"(2+4)/2 = 3\""
				}
			]
		}
	],
	"quiz": [
		{
			"question": "Что вернёт функция `average([])` (среднее пустого списка), если внутри написать просто `sum(nums) / len(nums)` без проверки на пустоту?",
			"options": [
				"0",
				"None",
				"Ошибку ZeroDivisionError (деление на ноль)",
				"Пустой список"
			],
			"correct": 2,
			"explain": "Длина пустого списка равна 0, а делить на ноль нельзя - программа упадёт с ошибкой ZeroDivisionError. Поэтому пустой случай надо обработать отдельно и вернуть, например, 0."
		},
		{
			"question": "Как правильно перебрать словарь `prices`, чтобы в цикле сразу получать и ключ, и значение?",
			"options": [
				"for name in prices.keys():",
				"for name, price in prices.items():",
				"for price in prices.values():",
				"for name, price in prices:"
			],
			"correct": 1,
			"explain": "Метод `.items()` даёт пары (ключ, значение), поэтому их можно распаковать сразу в две переменные: `for name, price in prices.items():`. Метод `.keys()` даёт только ключи, `.values()` - только значения, а перебор просто по словарю даёт лишь ключи."
		},
		{
			"question": "Что делает строка `d[x] = d.get(x, 0) + 1` в цикле подсчёта частот?",
			"options": [
				"Удаляет ключ x из словаря",
				"Заменяет значение x на 0",
				"Увеличивает счётчик для x на 1, а если ключа ещё нет - начинает с 0",
				"Складывает все значения словаря"
			],
			"correct": 2,
			"explain": "Метод `.get(x, 0)` берёт текущее значение по ключу x или 0, если ключа ещё нет. К нему прибавляется 1, и результат снова записывается по ключу x. Так счётчик аккуратно растёт с нуля."
		}
	]
};
