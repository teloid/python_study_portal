# Технические заметки по интеграции (проверено ~июнь 2026)

Краткая выжимка решений, на которых построен портал. Подробности — в коде
(`src/lib/runtime/`, `src/lib/server/`, `svelte.config.js`, `wrangler.jsonc`).

## Версии

| Что | Версия | Где |
| --- | --- | --- |
| Pyodide | `314.0.1` (Python 3.14) | CDN jsDelivr, `src/lib/runtime/python.js` |
| sql.js | `1.14.0` | CDN sql.js.org, `src/lib/runtime/sqldb.js` |
| @sveltejs/adapter-cloudflare | `^7` | `svelte.config.js` |
| SvelteKit / Svelte | `2.x` / `5.x` | — |

> ⚠️ Pyodide сменил схему версий: старая линейка `0.x` (последняя `0.29`) заменена
> на привязку к Python — `314.x` = Python 3.14. В путях CDN это `v314.0.1`.

## Pyodide (Python в браузере)

- Грузится **один раз** через `<script>` с CDN, только в браузере (`onMount` + проверка `browser`).
  Интерпретатор переиспользуется (singleton-промис).
- Вывод: `pyodide.setStdout({ batched })` / `setStderr({ batched })` — ставим один раз после загрузки.
- Запуск: `runPythonAsync(code, { globals })`. Для изоляции упражнений каждому запуску даём
  **свежий словарь** `pyodide.globals.get('dict')()` и `ns.destroy()` после — ничего не «течёт».
- Ошибки Python приходят как JS-исключение `PythonError`, в `.message` — готовый traceback.
- **COOP/COEP не нужны** для однопоточного Pyodide на главном потоке. Поэтому никаких особых
  заголовков на Cloudflare Pages не ставим. (Они понадобились бы только для прерывания
  выполнения через SharedArrayBuffer + Web Worker — мы это не используем.)
- Первая загрузка ≈ 8–12 МБ (ядро + stdlib), дальше кешируется браузером.

## sql.js (SQLite в браузере)

- `initSqlJs({ locateFile: f => 'https://sql.js.org/dist/' + f })` — модуль кешируем.
- На каждое упражнение — свежая `new SQL.Database()` из `seedSql`, затем `db.close()`.
- `db.exec(sql)` возвращает `[{ columns, values }]`; `db.run(sql)` — без результата (DDL/INSERT).

## Cloudflare D1 + SvelteKit

- Биндинг `DB` объявлен в `wrangler.jsonc` (`d1_databases`), доступен как `platform.env.DB`
  внутри `load`/actions/`+server.js`/`hooks`. На верхнем уровне модуля `platform` нет — всегда
  через `platform?.env?.DB`.
- Локальная разработка: `vite dev` сам поднимает локальную D1 через `getPlatformProxy()` адаптера.
  Отдельный `wrangler pages dev` нужен только чтобы проверить собранную сборку.
- Миграции: `wrangler d1 migrations apply study-portal --local` / `--remote`.
  ⚠️ `--local` — по умолчанию; для боевой базы всегда указывайте `--remote` явно.
- Тип `platform.env` объявлен в `src/app.d.ts` (`App.Platform`, `D1Database` из `@cloudflare/workers-types`).

## Авторизация (без Node crypto)

- В Workers нет `bcrypt`/Node `crypto`. Пароли — **PBKDF2** через Web Crypto (`crypto.subtle`).
  Cloudflare ограничивает PBKDF2 100 000 итераций — используем как максимум.
  Формат хранения: `iterations:saltHex:hashHex` (`src/lib/server/crypto.js`).
- Сессии: httpOnly-cookie + таблица `sessions` в D1, валидация в `hooks.server.js`,
  пользователь кладётся в `event.locals.user`. Защита маршрутов по ролям — там же.

## Источники

Pyodide docs (downloading/deploying, streams, JS API, bundlers), sql.js README,
SvelteKit adapter-cloudflare docs, Cloudflare D1 + Wrangler docs, Cloudflare Web Crypto docs.
