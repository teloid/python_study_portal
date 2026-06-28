<script>
	import { GLOSSARY, CATEGORY_LABELS, CATEGORY_ORDER } from '$lib/content/glossary';

	let query = $state('');
	let activeCat = $state('all');

	let filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return GLOSSARY.filter((e) => {
			if (activeCat !== 'all' && e.category !== activeCat) return false;
			if (!q) return true;
			return (
				e.name.toLowerCase().includes(q) ||
				e.ru_meaning.toLowerCase().includes(q) ||
				e.ru_explanation.toLowerCase().includes(q) ||
				(e.ru_pronunciation ?? '').toLowerCase().includes(q) ||
				(e.en_word ?? '').toLowerCase().includes(q)
			);
		});
	});

	let grouped = $derived.by(() => {
		/** @type {Record<string, any[]>} */
		const g = {};
		for (const e of filtered) (g[e.category] ??= []).push(e);
		return g;
	});

	let chips = ['all', ...CATEGORY_ORDER.filter((c) => GLOSSARY.some((e) => e.category === c))];
	/** @param {string} c */
	const chipLabel = (c) => (c === 'all' ? 'Все' : CATEGORY_LABELS[c]);
</script>

<svelte:head><title>Глоссарий — Питон-Портал</title></svelte:head>

<div class="container">
	<header class="gl-head">
		<h1>📖 Глоссарий</h1>
		<p class="muted">
			Что означают английские названия функций и ключевых слов, как они читаются и зачем нужны.
			Наводите курсор на термины в уроках — то же объяснение появится прямо там.
		</p>
	</header>

	<div class="tools">
		<input
			class="input search"
			type="search"
			placeholder="🔍 Поиск: print, длина, цикл…"
			bind:value={query}
		/>
		<div class="chips">
			{#each chips as c}
				<button class="chip" class:on={activeCat === c} onclick={() => (activeCat = c)}>
					{chipLabel(c)}
				</button>
			{/each}
		</div>
	</div>

	{#if filtered.length === 0}
		<p class="empty muted">Ничего не нашлось. Попробуйте другое слово.</p>
	{/if}

	{#each CATEGORY_ORDER as cat}
		{#if grouped[cat]?.length}
			<section class="cat">
				<h2 class="cat-title">{CATEGORY_LABELS[cat]} <span class="count">{grouped[cat].length}</span></h2>
				<div class="grid">
					{#each grouped[cat] as e (e.name)}
						<div class="term card">
							<div class="term-head">
								<code class="name">{e.name}</code>
								{#if e.ru_pronunciation}<span class="pron">🔊 {e.ru_pronunciation}</span>{/if}
							</div>
							{#if e.en_word}<div class="en">{e.en_word}</div>{/if}
							<div class="explain">{e.ru_explanation}</div>
							{#if e.example_code}<pre class="ex">{e.example_code}</pre>{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</div>

<style>
	.gl-head {
		margin-bottom: 18px;
	}
	.gl-head p {
		max-width: 680px;
	}
	.tools {
		position: sticky;
		top: 64px;
		z-index: 10;
		background: var(--bg);
		padding: 12px 0;
		margin-bottom: 10px;
	}
	.search {
		max-width: 420px;
		margin-bottom: 12px;
	}
	.chips {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.chip {
		padding: 7px 15px;
		border-radius: var(--r-pill);
		border: 1.5px solid var(--border-strong);
		background: var(--surface);
		font-weight: 600;
		font-size: 0.88rem;
		cursor: pointer;
		color: var(--ink-2);
		transition: all var(--transition);
	}
	.chip:hover {
		border-color: var(--accent);
	}
	.chip.on {
		background: var(--accent);
		border-color: var(--accent);
		color: #fff;
	}
	.cat {
		margin-top: 22px;
	}
	.cat-title {
		font-size: 1.3rem;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.count {
		font-size: 0.85rem;
		background: var(--surface-2);
		color: var(--ink-2);
		border-radius: var(--r-pill);
		padding: 2px 10px;
		font-family: var(--font-body);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 14px;
	}
	.term {
		padding: 16px 18px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.term-head {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}
	.name {
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--py-blue-700);
		background: #eaf2fb;
		padding: 2px 9px;
		border-radius: 7px;
		font-size: 0.95rem;
	}
	.pron {
		font-size: 0.82rem;
		color: var(--ink-3);
	}
	.en {
		font-size: 0.83rem;
		color: var(--ink-3);
	}
	.explain {
		font-size: 0.92rem;
		color: var(--ink);
		line-height: 1.5;
	}
	.ex {
		margin: 6px 0 0;
		padding: 10px 12px;
		background: var(--code-bg);
		color: #c8d3e0;
		border-radius: 9px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		white-space: pre-wrap;
		overflow-x: auto;
	}
	.empty {
		padding: 30px 0;
		text-align: center;
	}
</style>
