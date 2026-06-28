# 🚀 Автодеплой через GitHub

Каждый `git push` в ветку `main` → Cloudflare сам соберёт и опубликует на
**https://python-study-portal.pages.dev**. Никаких ручных `pages:deploy` и
путаницы preview/production.

## Почему проект придётся пересоздать

Текущий проект `python-study-portal` создан через CLI (**Direct Upload**). Cloudflare
**не умеет** переключать уже существующий проект на Git — тип выбирается при создании.
Поэтому: удаляем старый проект и создаём новый, подключённый к GitHub, с тем же именем.

> ⚠️ Удаление проекта Pages **не удаляет** базу данных D1 `study-portal` — это
> отдельный ресурс, она и все данные (пользователи, прогресс) останутся. Мы просто
> заново привяжем её к новому проекту.

## Шаги (одноразовая настройка)

### 1. Удалить старый Pages-проект (освободить имя/URL)

Дашборд Cloudflare → **Workers & Pages** → `python-study-portal` → **Settings** →
внизу **Delete project**.

Или через CLI:
```bash
npx wrangler pages project delete python-study-portal
```

### 2. Создать проект из GitHub

Дашборд → **Workers & Pages** → **Create** → вкладка **Pages** → **Connect to Git** →
авторизовать GitHub → выбрать репозиторий **`teloid/python_study_portal`**.

Настройки сборки:

| Поле | Значение |
| --- | --- |
| Production branch | `main` |
| Framework preset | `SvelteKit` (если предложит; иначе `None`) |
| Build command | `npm run build` |
| Build output directory | `.svelte-kit/cloudflare` |

Нажать **Save and Deploy**.

### 3. Привязать базу D1

Привязки берутся из `wrangler.jsonc` в репозитории (там есть биндинг `DB` и
`pages_build_output_dir`), поэтому обычно подхватываются автоматически.

Проверь: проект → **Settings** → **Functions** (или **Bindings**) →
**D1 database bindings** → должна быть переменная **`DB`** → база **`study-portal`**.
Если нет — добавь вручную (Variable name: `DB`, база: `study-portal`) и передеплой.

### 4. Готово

Теперь любой пуш публикуется автоматически:
```bash
git add -A && git commit -m "..." && git push
```
→ через ~1-2 минуты обновится **https://python-study-portal.pages.dev**.
Прогресс сборки виден в дашборде проекта во вкладке **Deployments**.

## Что НЕ делается автоматически

Структуру БД и пользователей по-прежнему меняешь вручную через `wrangler`
(деплой их не трогает):

```bash
npm run db:migrate:remote                          # если менялась схема (migrations/)
npm run hash -- <логин> <пароль> "<Имя>" <роль>     # затем строка с --remote
```

## Версия Node при сборке

В репозитории лежит файл `.node-version` (`22`) — Cloudflare использует его для сборки.
Если когда-нибудь сборка упадёт из-за версии Node, поменяй число там.

## Не хочешь удалять старый проект?

Можно создать Git-проект с **другим именем** — тогда будет другой адрес
(например `python-study-portal-app.pages.dev`). Старый Direct-Upload проект можно
удалить позже, когда убедишься, что новый работает.
