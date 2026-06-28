/** @type {import('../schema').Lesson} */
export default {
	"slug": "errors-and-exceptions",
	"title": "Когда что-то идёт не так: обработка ошибок",
	"level": "intermediate",
	"topic": "python",
	"order": 14,
	"estimatedMinutes": 55,
	"emoji": "🛟",
	"summary": "Ошибки во время работы неизбежны, но их можно перехватывать. Учимся читать сообщения об ошибках, использовать try/except и делать программу устойчивой.",
	"goals": [
		"Различать типы ошибок: ValueError, TypeError, ZeroDivisionError",
		"Перехватывать ошибки через try и except",
		"Обрабатывать неверный ввод без падения программы",
		"Использовать блоки else и finally",
		"Понимать, когда ошибку лучше исправить, а не прятать"
	],
	"theory": [
		{
			"type": "text",
			"md": "Представь: твоя программа работает, и вдруг пользователь вводит букву там, где ждали число. Или программа пытается поделить на ноль. В таких случаях Python **не молчит** - он останавливает программу и выдаёт ошибку. Такая ошибка называется **исключением** (по-английски exception).\n\nВ этом уроке мы научимся ловить такие ошибки и обрабатывать их так, чтобы программа **не падала**, а спокойно продолжала работать."
		},
		{
			"type": "text",
			"md": "Сначала посмотрим, как выглядит ошибка. Если написать `int(\"сто\")`, Python не сможет превратить слово в число и выбросит ошибку `ValueError`. Программа на этом месте остановится.\n\nЧтобы этого избежать, есть пара ключевых слов: `try` и `except`.\n\n- В блок `try` мы кладём код, который **может** сломаться.\n- В блок `except` - что делать, **если** он сломался."
		},
		{
			"type": "code",
			"lang": "python",
			"code": "try:\n    chislo = int(\"сто\")\n    print(chislo)\nexcept ValueError:\n    print(\"Это не число!\")",
			"runnable": true,
			"output": "Это не число!"
		},
		{
			"type": "text",
			"md": "Что произошло: Python начал выполнять `try`, дошёл до `int(\"сто\")`, не смог преобразовать и **прыгнул** в блок `except ValueError`. Программа не упала - она вежливо сообщила о проблеме и пошла дальше.\n\nОбрати внимание: после `except` мы указали **тип** ошибки - `ValueError`. Это значит: лови именно эту ошибку."
		},
		{
			"type": "callout",
			"variant": "info",
			"title": "Самые частые ошибки",
			"md": "- `ValueError` - неправильное значение. Например, `int(\"привет\")` - текст не похож на число.\n- `ZeroDivisionError` - попытка поделить на ноль, например `10 / 0`.\n- `TypeError` - неподходящий тип данных. Например, попытка сложить текст и число: `\"возраст\" + 5`."
		},
		{
			"type": "text",
			"md": "Посмотрим на деление на ноль. Это классика: `ZeroDivisionError`. Ловим её точно так же."
		},
		{
			"type": "code",
			"lang": "python",
			"code": "vozrast = \"двадцать\"\ntry:\n    print(vozrast + 5)\nexcept TypeError:\n    print(\"Нельзя сложить текст и число\")",
			"runnable": true,
			"output": "Нельзя сложить текст и число"
		},
		{
			"type": "text",
			"md": "У конструкции `try`/`except` есть ещё два **необязательных** блока:\n\n- `else` - выполняется, **только если** в `try` ошибок НЕ было.\n- `finally` - выполняется **всегда**: и при ошибке, и без неё. Удобно для уборки за собой (например, закрыть файл).\n\nПорядок такой: сначала `try`, потом `except`, потом `else`, в конце `finally`."
		},
		{
			"type": "code",
			"lang": "python",
			"code": "def delenie(a, b):\n    try:\n        rezultat = a / b\n    except ZeroDivisionError:\n        print(\"На ноль делить нельзя\")\n    else:\n        print(\"Результат:\", rezultat)\n    finally:\n        print(\"Готово\")\n\ndelenie(10, 2)\ndelenie(10, 0)",
			"runnable": true,
			"output": "Результат: 5.0\nГотово\nНа ноль делить нельзя\nГотово"
		},
		{
			"type": "text",
			"md": "Разберём вывод по шагам:\n\n- `delenie(10, 2)`: ошибки нет, значит сработал `else` (напечатал результат), а потом `finally`.\n- `delenie(10, 0)`: была ошибка деления на ноль, сработал `except`, а `else` пропущен. Но `finally` сработал в любом случае."
		},
		{
			"type": "callout",
			"variant": "tip",
			"title": "Можно ловить несколько ошибок сразу",
			"md": "Если код может выдать разные ошибки, перечисли их в скобках через запятую:\n\n```\ntry:\n    znachenie = int(x)\nexcept (ValueError, TypeError):\n    znachenie = 0\n```\n\nЗдесь мы поймаем и `ValueError`, и `TypeError` одним блоком."
		},
		{
			"type": "callout",
			"variant": "warning",
			"title": "Не лови всё подряд",
			"md": "Можно написать просто `except:` без типа - тогда поймается **любая** ошибка. Но так делать не стоит: ты спрячешь даже те ошибки, о которых хотел бы знать (например, опечатку в имени переменной). Лови **конкретные** типы ошибок, которые действительно ожидаешь."
		},
		{
			"type": "text",
			"md": "Главная идея урока: с помощью `try`/`except` мы пишем функции, которые **не падают** на плохих данных, а возвращают какое-то разумное значение (например, `0` или `None`). Именно это ты потренируешь в упражнениях ниже."
		}
	],
	"exercises": [
		{
			"id": "safe-div",
			"lang": "python",
			"prompt": "Напиши функцию `safe_div(a, b)`, которая делит `a` на `b` и возвращает результат.\n\nНо если делят на ноль, функция не должна падать - вместо этого пусть вернёт `None`.\n\nПримеры:\n- `safe_div(10, 2)` вернёт `5.0`\n- `safe_div(7, 0)` вернёт `None`",
			"starter": "def safe_div(a, b):\n    # попробуй поделить a на b внутри try\n    # если поймал ZeroDivisionError - верни None\n    pass\n",
			"hints": [
				"Оберни строку с делением `a / b` в блок `try`.",
				"В `except ZeroDivisionError:` напиши `return None`.",
				"Полный каркас: try -> return a / b, except ZeroDivisionError -> return None."
			],
			"solution": "def safe_div(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None",
			"tests": [
				{
					"name": "safe_div(10, 2) == 5.0",
					"code": "assert safe_div(10, 2) == 5.0, \"safe_div(10,2) должно быть 5.0\""
				},
				{
					"name": "safe_div(9, 3) == 3.0",
					"code": "assert safe_div(9, 3) == 3.0, \"safe_div(9,3) должно быть 3.0\""
				},
				{
					"name": "safe_div(7, 0) is None",
					"code": "assert safe_div(7, 0) is None, \"safe_div(7,0) должно быть None\""
				},
				{
					"name": "safe_div(0, 5) == 0.0",
					"code": "assert safe_div(0, 5) == 0.0, \"safe_div(0,5) должно быть 0.0\""
				},
				{
					"name": "safe_div(-8, 0) is None",
					"code": "assert safe_div(-8, 0) is None, \"safe_div(-8,0) должно быть None\""
				}
			]
		},
		{
			"id": "to-int",
			"lang": "python",
			"prompt": "Напиши функцию `to_int(s)`, которая превращает строку в целое число.\n\nЕсли строку **не получается** превратить в число, функция должна вернуть `0`, а не падать.\n\nПримеры:\n- `to_int(\"42\")` вернёт `42`\n- `to_int(\"привет\")` вернёт `0`\n- `to_int(\"3.14\")` вернёт `0` (это не целое число)",
			"starter": "def to_int(s):\n    # попробуй вернуть int(s) внутри try\n    # если поймал ошибку - верни 0\n    # подсказка: лови (ValueError, TypeError)\n    pass\n",
			"hints": [
				"Внутри `try` напиши `return int(s)`.",
				"Преобразование может дать `ValueError` (плохая строка) или `TypeError` (например, `None`). Лови оба: `except (ValueError, TypeError):`.",
				"В блоке except напиши `return 0`."
			],
			"solution": "def to_int(s):\n    try:\n        return int(s)\n    except (ValueError, TypeError):\n        return 0",
			"tests": [
				{
					"name": "to_int('42') == 42",
					"code": "assert to_int(\"42\") == 42, \"to_int('42') должно быть 42\""
				},
				{
					"name": "to_int('-7') == -7",
					"code": "assert to_int(\"-7\") == -7, \"to_int('-7') должно быть -7\""
				},
				{
					"name": "to_int('привет') == 0",
					"code": "assert to_int(\"привет\") == 0, \"to_int('привет') должно быть 0\""
				},
				{
					"name": "to_int('3.14') == 0",
					"code": "assert to_int(\"3.14\") == 0, \"to_int('3.14') должно быть 0\""
				},
				{
					"name": "to_int('') == 0",
					"code": "assert to_int(\"\") == 0, \"to_int('') должно быть 0\""
				},
				{
					"name": "to_int(None) == 0",
					"code": "assert to_int(None) == 0, \"to_int(None) должно быть 0\""
				}
			]
		},
		{
			"id": "average-safe",
			"lang": "python",
			"prompt": "Напиши функцию `average(numbers)`, которая считает среднее арифметическое чисел из списка `numbers` (сумма, делённая на количество).\n\nЕсли список **пустой**, делить пришлось бы на ноль. Чтобы функция не упала, в этом случае верни `0`.\n\nПримеры:\n- `average([2, 4, 6])` вернёт `4.0`\n- `average([])` вернёт `0`",
			"starter": "def average(numbers):\n    # сумму даёт sum(numbers), количество - len(numbers)\n    # дели sum на len внутри try\n    # на пустом списке len == 0 -> поймай ZeroDivisionError и верни 0\n    pass\n",
			"hints": [
				"Среднее это `sum(numbers) / len(numbers)`.",
				"На пустом списке `len(numbers)` равно 0, и деление выбросит `ZeroDivisionError`.",
				"Оберни вычисление в `try`, а в `except ZeroDivisionError:` верни `0`."
			],
			"solution": "def average(numbers):\n    try:\n        return sum(numbers) / len(numbers)\n    except ZeroDivisionError:\n        return 0",
			"tests": [
				{
					"name": "average([2, 4, 6]) == 4.0",
					"code": "assert average([2, 4, 6]) == 4.0, \"average([2,4,6]) должно быть 4.0\""
				},
				{
					"name": "average([10]) == 10.0",
					"code": "assert average([10]) == 10.0, \"average([10]) должно быть 10.0\""
				},
				{
					"name": "average([]) == 0",
					"code": "assert average([]) == 0, \"average([]) должно быть 0\""
				},
				{
					"name": "average([1, 2]) == 1.5",
					"code": "assert average([1, 2]) == 1.5, \"average([1,2]) должно быть 1.5\""
				}
			]
		}
	],
	"quiz": [
		{
			"question": "В какой блок нужно класть код, который может выбросить ошибку?",
			"options": [
				"В блок `except`",
				"В блок `try`",
				"В блок `finally`",
				"В блок `else`"
			],
			"correct": 1,
			"explain": "Код, который может сломаться, кладут в `try`. А в `except` пишут, что делать, если ошибка всё-таки произошла."
		},
		{
			"question": "Какая ошибка возникнет при выполнении `int(\"кот\")`?",
			"options": [
				"`ZeroDivisionError`",
				"`TypeError`",
				"`ValueError`",
				"Никакой, вернётся 0"
			],
			"correct": 2,
			"explain": "`int()` не может превратить слово в число, поэтому Python выбрасывает `ValueError` - неправильное значение."
		},
		{
			"question": "Когда выполнится блок `finally`?",
			"options": [
				"Только если была ошибка",
				"Только если ошибки не было",
				"Всегда: и при ошибке, и без неё",
				"Никогда, это устаревший блок"
			],
			"correct": 2,
			"explain": "`finally` выполняется в любом случае - и когда код в `try` отработал успешно, и когда поймали ошибку. Поэтому его используют для завершающих действий."
		}
	]
};
