-- Питон-Портал — начальная схема базы данных (Cloudflare D1 / SQLite).
-- Применить локально:  npm run db:migrate:local
-- Применить в проде:   npm run db:migrate:remote

-- Пользователи: учитель и ученики.
CREATE TABLE IF NOT EXISTS users (
	id            INTEGER PRIMARY KEY AUTOINCREMENT,
	username      TEXT NOT NULL UNIQUE,
	password      TEXT NOT NULL,                -- формат: "iterations:saltHex:hashHex"
	display_name  TEXT NOT NULL,
	role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('teacher', 'student')),
	created_at    INTEGER NOT NULL              -- unix ms
);

-- Сессии (вход по куки).
CREATE TABLE IF NOT EXISTS sessions (
	token       TEXT PRIMARY KEY,
	user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	expires_at  INTEGER NOT NULL                -- unix ms
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Прогресс по урокам: одна строка на пару (ученик, урок).
CREATE TABLE IF NOT EXISTS progress (
	user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	lesson_slug   TEXT NOT NULL,
	status        TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
	score         INTEGER NOT NULL DEFAULT 0,
	max_score     INTEGER NOT NULL DEFAULT 0,
	completed_at  INTEGER,                       -- unix ms, когда урок пройден
	updated_at    INTEGER NOT NULL,             -- unix ms
	PRIMARY KEY (user_id, lesson_slug)
);

-- Все попытки решения упражнений — для учителя (видно, что и как решал ученик).
CREATE TABLE IF NOT EXISTS submissions (
	id            INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	lesson_slug   TEXT NOT NULL,
	exercise_id   TEXT NOT NULL,
	passed        INTEGER NOT NULL DEFAULT 0,    -- 0/1
	code          TEXT NOT NULL,
	created_at    INTEGER NOT NULL              -- unix ms
);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_lesson ON submissions(user_id, lesson_slug);
