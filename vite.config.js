import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
	// Pyodide грузится с CDN через <script>, поэтому в зависимостях его нет.
	// sql.js (CommonJS) намеренно НЕ исключаем из optimizeDeps — Vite пред-бандлит
	// его, и тогда `import('sql.js')` корректно отдаёт default-экспорт initSqlJs.
	// Сам .wasm подгружается с CDN через locateFile (см. runtime/sqldb.js).
});
