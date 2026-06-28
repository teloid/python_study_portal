#!/usr/bin/env node
/**
 * Генерирует пользователя для входа в портал: хеширует пароль (тем же PBKDF2,
 * что и сервер) и печатает готовый SQL INSERT + команды wrangler.
 *
 * Использование:
 *   npm run hash -- <логин> <пароль> "<Имя для показа>" [teacher|student]
 *
 * Примеры:
 *   npm run hash -- teacher "МойПароль123" "Роман (учитель)" teacher
 *   npm run hash -- student "Учусь2026"    "Ученик"          student
 */
import { hashPassword } from '../src/lib/server/crypto.js';

const [, , username, password, displayName, roleArg] = process.argv;

if (!username || !password) {
	console.error('\n  Использование: npm run hash -- <логин> <пароль> "<Имя>" [teacher|student]\n');
	process.exit(1);
}

const role = roleArg === 'teacher' ? 'teacher' : 'student';
const name = displayName || username;
const now = Date.now();
const hash = await hashPassword(password);

// Экранируем одинарные кавычки для SQL.
const esc = (s) => String(s).replace(/'/g, "''");

// UPSERT: если пользователь с таким логином уже есть — обновляем пароль/имя/роль.
// Так можно повторно запускать скрипт, чтобы СМЕНИТЬ пароль или исправить имя.
const insert =
	`INSERT INTO users (username, password, display_name, role, created_at)\n` +
	`VALUES ('${esc(username)}', '${hash}', '${esc(name)}', '${role}', ${now})\n` +
	`ON CONFLICT(username) DO UPDATE SET password=excluded.password, display_name=excluded.display_name, role=excluded.role;`;

console.log('\n— SQL для добавления/обновления пользователя —\n');
console.log(insert);
console.log('\n— Применить локально (для npm run dev) —\n');
console.log(`npx wrangler d1 execute study-portal --local --command "${insert.replace(/\n/g, ' ').replace(/"/g, '\\"')}"`);
console.log('\n— Применить в продакшене (Cloudflare) —\n');
console.log(`npx wrangler d1 execute study-portal --remote --command "${insert.replace(/\n/g, ' ').replace(/"/g, '\\"')}"`);
console.log('');
