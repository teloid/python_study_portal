#!/usr/bin/env node
/**
 * Копирует sql-wasm.wasm из установленного пакета sql.js в static/,
 * чтобы версия .wasm всегда совпадала с версией JS-загрузчика и не зависела
 * от внешнего CDN. Запускается автоматически перед dev и build.
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const destDir = join(root, 'static');
const dest = join(destDir, 'sql-wasm.wasm');

if (!existsSync(src)) {
	console.warn('[copy-sql-wasm] не найден', src, '— пропускаю (установите зависимости: npm install)');
	process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('[copy-sql-wasm] скопировано →', dest);
