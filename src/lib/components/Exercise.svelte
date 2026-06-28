<script>
	import CodeEditor from './CodeEditor.svelte';
	import OutputPanel from './OutputPanel.svelte';
	import { renderMarkdown } from '$lib/markdown';
	import { GLOSSARY_KEYS } from '$lib/content/glossary';
	import { runWithTests } from '$lib/runtime/python';
	import { runQuery, checkQuery } from '$lib/runtime/sqldb';

	let { exercise, index = 0, done = false, onresult = () => {} } = $props();

	let value = $state(exercise.starter ?? '');
	let running = $state(false);
	let passed = $state(done);

	// Python
	let out = $state('');
	let err = $state('');
	let error = $state('');
	/** @type {{name:string,passed:boolean,detail:string|null}[]} */
	let tests = $state([]);

	// SQL
	let sqlTable = $state(/** @type {{columns:string[],rows:any[][]} | null} */ (null));
	let sqlError = $state('');

	let hintsShown = $state(0);
	let showSolution = $state(false);
	let ran = $state(false);

	let isPython = $derived(exercise.lang === 'python');

	function reset() {
		value = exercise.starter ?? '';
		out = err = error = sqlError = '';
		tests = [];
		sqlTable = null;
		ran = false;
	}

	async function run() {
		running = true;
		ran = true;
		out = err = error = sqlError = '';
		tests = [];
		sqlTable = null;
		let nowPassed = false;

		try {
			if (isPython) {
				const res = await runWithTests(value, exercise.tests ?? [], (text, stream) => {
					if (stream === 'err') err += text;
					else out += text;
				});
				error = res.error ?? '';
				tests = res.tests;
				nowPassed = res.ok && tests.length > 0 && tests.every((t) => t.passed);
			} else {
				// SQL: показываем результат запроса ученика + проверяем правильность
				const r = await runQuery(exercise.seedSql ?? '', value);
				if (!r.ok) {
					sqlError = r.error ?? 'Ошибка запроса';
				} else {
					sqlTable = r.tables[r.tables.length - 1] ?? { columns: [], rows: [] };
					const chk = await checkQuery(
						exercise.seedSql ?? '',
						value,
						exercise.check?.expectedQuery ?? '',
						exercise.check?.orderMatters ?? false
					);
					nowPassed = chk.passed;
				}
			}
		} catch (e) {
			error = /** @type {any} */ (e)?.message ?? String(e);
		} finally {
			running = false;
		}

		if (nowPassed) passed = true;
		onresult({ exerciseId: exercise.id, passed: nowPassed, code: value });
	}
</script>

<div class="exercise card" class:passed>
	<div class="ex-head">
		<span class="ex-num">{index + 1}</span>
		<div class="prose grow">{@html renderMarkdown(exercise.prompt, GLOSSARY_KEYS)}</div>
		{#if passed}<span class="badge badge-beginner">✓ Решено</span>{/if}
	</div>

	<CodeEditor bind:value lang={exercise.lang} onrun={run} minHeight="120px" />

	<div class="controls">
		<button class="btn btn-run btn-sm" onclick={run} disabled={running}>
			{#if running}<span class="spinner"></span>{:else}▶{/if}
			{isPython ? 'Запустить и проверить' : 'Выполнить запрос'}
		</button>
		<button class="btn btn-ghost btn-sm" onclick={reset} disabled={running}>Сбросить</button>
		{#if exercise.hints?.length && hintsShown < exercise.hints.length}
			<button class="btn btn-ghost btn-sm" onclick={() => (hintsShown += 1)} disabled={running}>
				💡 Подсказка ({hintsShown}/{exercise.hints.length})
			</button>
		{/if}
		{#if exercise.solution}
			<button class="btn btn-ghost btn-sm sol" onclick={() => (showSolution = !showSolution)}>
				{showSolution ? 'Скрыть решение' : 'Показать решение'}
			</button>
		{/if}
		<span class="dim kbd">Ctrl+Enter</span>
	</div>

	{#if hintsShown > 0}
		<div class="hints">
			{#each exercise.hints.slice(0, hintsShown) as hint, i}
				<div class="hint-item">💡 {hint}</div>
			{/each}
		</div>
	{/if}

	{#if showSolution}
		<div class="solution">
			<div class="sol-label">Эталонное решение</div>
			<pre>{exercise.solution}</pre>
		</div>
	{/if}

	<!-- Результат -->
	{#if isPython}
		{#if ran || running}
			<OutputPanel {out} {err} {error} {running} empty="Запустите код, чтобы увидеть вывод." />
		{/if}
		{#if tests.length}
			<div class="tests">
				{#each tests as t}
					<div class="test" class:ok={t.passed} class:bad={!t.passed}>
						<span class="mark">{t.passed ? '✓' : '✗'}</span>
						<div class="grow">
							<div class="t-name">{t.name}</div>
							{#if !t.passed && t.detail}<pre class="t-detail">{t.detail}</pre>{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:else if ran || running}
		<div class="sql-result">
			{#if running}
				<div class="muted small">Выполняем запрос…</div>
			{:else if sqlError}
				<div class="sql-err">⚠ {sqlError}</div>
			{:else if sqlTable}
				{#if sqlTable.rows.length === 0}
					<div class="muted small">Запрос выполнен, но строк не вернулось.</div>
				{:else}
					<div class="grid-wrap">
						<table class="grid">
							<thead>
								<tr>{#each sqlTable.columns as c}<th>{c}</th>{/each}</tr>
							</thead>
							<tbody>
								{#each sqlTable.rows as row}
									<tr>{#each row as cell}<td>{cell === null ? 'NULL' : cell}</td>{/each}</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="small muted">Строк: {sqlTable.rows.length}</div>
				{/if}
			{/if}
		</div>
	{/if}

	{#if ran && !running && passed}
		<div class="verdict ok-banner fade-up">🎉 Отлично! Задание решено верно.</div>
	{:else if ran && !running && (tests.length || sqlTable || sqlError || error)}
		<div class="verdict bad-banner">
			{isPython
				? 'Пока не сходится — посмотрите на проверки выше и попробуйте снова.'
				: 'Результат не совпадает с ожидаемым. Сверьте условие задания.'}
		</div>
	{/if}
</div>

<style>
	.exercise {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		scroll-margin-top: 80px;
	}
	.exercise.passed {
		border-color: #b9e6cd;
		background: linear-gradient(180deg, #f5fcf8, #fff);
	}
	.ex-head {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}
	.ex-num {
		flex: none;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--accent);
		color: #fff;
		font-weight: 700;
		display: grid;
		place-items: center;
		font-size: 0.9rem;
		margin-top: 2px;
	}
	.exercise.passed .ex-num {
		background: var(--success);
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.kbd {
		margin-left: auto;
		font-size: 0.78rem;
		font-family: var(--font-mono);
	}
	.sol {
		color: var(--ink-2);
	}
	.hints {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.hint-item {
		background: var(--warning-soft);
		border-radius: 10px;
		padding: 9px 13px;
		font-size: 0.9rem;
		color: #8a5a08;
	}
	.solution {
		background: var(--code-bg);
		border-radius: 12px;
		overflow: hidden;
	}
	.sol-label {
		padding: 7px 14px;
		background: #21262d;
		color: #8b949e;
		font-size: 0.76rem;
		font-weight: 600;
	}
	.solution pre {
		margin: 0;
		padding: 13px 16px;
		color: #c8d3e0;
		font-family: var(--font-mono);
		font-size: 0.86rem;
		white-space: pre-wrap;
	}
	.tests {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.test {
		display: flex;
		gap: 10px;
		padding: 10px 13px;
		border-radius: 10px;
		font-size: 0.9rem;
	}
	.test.ok {
		background: var(--success-soft);
		color: #0f7a3f;
	}
	.test.bad {
		background: var(--danger-soft);
		color: #a52741;
	}
	.mark {
		font-weight: 800;
	}
	.t-name {
		font-weight: 600;
	}
	.t-detail {
		margin: 6px 0 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		white-space: pre-wrap;
		color: #7a2438;
		background: rgba(224, 69, 94, 0.08);
		padding: 8px 10px;
		border-radius: 8px;
	}
	.sql-result {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.grid-wrap {
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: 12px;
	}
	.grid {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.9rem;
	}
	.grid th {
		background: var(--surface-2);
		text-align: left;
		padding: 9px 13px;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--py-blue-700);
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
	}
	.grid td {
		padding: 8px 13px;
		border-bottom: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: 0.85rem;
	}
	.grid tr:last-child td {
		border-bottom: none;
	}
	.sql-err {
		background: var(--danger-soft);
		color: #a52741;
		padding: 11px 14px;
		border-radius: 10px;
		font-family: var(--font-mono);
		font-size: 0.86rem;
	}
	.small {
		font-size: 0.82rem;
	}
	.verdict {
		padding: 12px 16px;
		border-radius: 12px;
		font-weight: 600;
	}
	.ok-banner {
		background: var(--success-soft);
		color: #0f7a3f;
	}
	.bad-banner {
		background: var(--warning-soft);
		color: #8a5a08;
	}
</style>
