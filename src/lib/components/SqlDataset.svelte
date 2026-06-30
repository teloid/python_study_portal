<script>
	// Показывает ученику таблицы, с которыми он работает в SQL-уроке: выполняет
	// seedSql в sql.js и рисует содержимое каждой таблицы как наглядную сетку.
	import { onMount } from 'svelte';
	import { loadSql } from '$lib/runtime/sqldb';

	let { seed = '' } = $props();

	let tables = $state(/** @type {{name:string,columns:string[],rows:any[][]}[]} */ ([]));
	let error = $state('');
	let loading = $state(true);

	onMount(async () => {
		try {
			const SQL = await loadSql();
			const db = new SQL.Database();
			db.run(seed);
			const meta = db.exec(
				"SELECT name FROM sqlite_master WHERE type='table' ORDER BY rowid"
			);
			const names = meta.length ? meta[0].values.map((/** @type {any} */ r) => String(r[0])) : [];
			const result = [];
			for (const name of names) {
				const res = db.exec('SELECT * FROM "' + name + '"');
				const t = res[0] ?? { columns: [], values: [] };
				result.push({ name, columns: t.columns, rows: t.values });
			}
			db.close();
			tables = result;
		} catch (e) {
			error = /** @type {any} */ (e)?.message ?? String(e);
		} finally {
			loading = false;
		}
	});
</script>

<section class="dataset card">
	<div class="ds-head">📋 Данные, с которыми работаем</div>
	<p class="ds-sub muted">Это таблицы в базе. Запросы ниже обращаются именно к ним.</p>

	{#if loading}
		<div class="ds-loading"><span class="spinner dark"></span> Загружаем таблицы…</div>
	{:else if error}
		<div class="ds-err">Не удалось показать данные: {error}</div>
	{:else}
		<div class="ds-tables">
			{#each tables as t (t.name)}
				<div class="ds-table">
					<div class="ds-name">
						<span class="ds-icon">🗂️</span>
						<code>{t.name}</code>
						<span class="ds-count">{t.rows.length} строк</span>
					</div>
					<div class="ds-grid-wrap">
						<table class="ds-grid">
							<thead>
								<tr>{#each t.columns as c}<th>{c}</th>{/each}</tr>
							</thead>
							<tbody>
								{#each t.rows as row}
									<tr>{#each row as cell}<td>{cell === null ? 'NULL' : cell}</td>{/each}</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	.dataset {
		margin: 18px 0 6px;
		padding: 20px 22px;
		background: linear-gradient(180deg, #fbfaf5, #fff);
	}
	.ds-head {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.15rem;
	}
	.ds-sub {
		margin: 2px 0 14px;
		font-size: 0.9rem;
	}
	.ds-loading {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--ink-2);
		padding: 8px 0;
	}
	.ds-err {
		background: var(--danger-soft);
		color: #a52741;
		padding: 11px 14px;
		border-radius: 10px;
		font-family: var(--font-mono);
		font-size: 0.86rem;
	}
	.ds-tables {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.ds-name {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 8px;
		font-weight: 600;
	}
	.ds-name code {
		font-family: var(--font-mono);
		color: var(--py-blue-700);
		background: #eaf2fb;
		padding: 2px 9px;
		border-radius: 7px;
		font-size: 0.95rem;
	}
	.ds-count {
		color: var(--ink-3);
		font-size: 0.82rem;
		font-weight: 500;
	}
	.ds-grid-wrap {
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: 12px;
	}
	.ds-grid {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.9rem;
	}
	.ds-grid th {
		background: var(--surface-2);
		text-align: left;
		padding: 9px 13px;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--py-blue-700);
		border-bottom: 1px solid var(--border);
		white-space: nowrap;
	}
	.ds-grid td {
		padding: 8px 13px;
		border-bottom: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: 0.85rem;
		white-space: nowrap;
	}
	.ds-grid tr:last-child td {
		border-bottom: none;
	}
	.ds-grid tbody tr:nth-child(even) td {
		background: #fafbfe;
	}
</style>
