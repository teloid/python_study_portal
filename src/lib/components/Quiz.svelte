<script>
	import { renderMarkdown, renderInline } from '$lib/markdown';
	import { GLOSSARY_KEYS } from '$lib/content/glossary';

	let { items = [], initial = null, onresult = () => {} } = $props();

	// Состояние каждого вопроса: sel — выбранный индекс (или -1), solved — угадан.
	let state = $state(
		items.map((/** @type {any} */ _, /** @type {number} */ i) =>
			initial && initial[i]
				? { sel: initial[i].sel ?? -1, solved: !!initial[i].solved }
				: { sel: -1, solved: false }
		)
	);

	function report() {
		const correct = state.filter((s) => s.solved).length;
		onresult({
			correct,
			total: items.length,
			state: state.map((s) => ({ sel: s.sel, solved: s.solved }))
		});
	}

	/** @param {number} qi @param {number} oi */
	function choose(qi, oi) {
		if (state[qi].solved) return; // правильный ответ уже зафиксирован
		state[qi].sel = oi;
		if (oi === items[qi].correct) state[qi].solved = true;
		report();
	}

	/** @param {number} qi */
	function retry(qi) {
		if (state[qi].solved) return;
		state[qi].sel = -1;
	}
</script>

<div class="quiz">
	{#each items as q, qi}
		<div class="q card">
			<div class="q-text">
				<span class="q-icon">❓</span>
				<div class="q-md prose">{@html renderMarkdown(q.question, GLOSSARY_KEYS)}</div>
			</div>
			<div class="options">
				{#each q.options as opt, oi}
					{@const solved = state[qi].solved}
					{@const isChosen = state[qi].sel === oi}
					{@const isCorrect = q.correct === oi}
					<button
						class="opt"
						class:correct={solved && isCorrect}
						class:wrong={!solved && isChosen}
						disabled={solved}
						onclick={() => choose(qi, oi)}
					>
						<span class="opt-mark">
							{#if solved && isCorrect}✓{:else if !solved && isChosen}✗{:else}{String.fromCharCode(65 + oi)}{/if}
						</span>
						<span class="opt-text">{@html renderInline(opt)}</span>
					</button>
				{/each}
			</div>

			{#if state[qi].solved}
				<div class="explain right fade-up">
					✅ Верно! {@html renderInline(q.explain ?? '', GLOSSARY_KEYS)}
				</div>
			{:else if state[qi].sel !== -1}
				<div class="retry fade-up">
					<span>🤔 Не совсем — выбери другой вариант.</span>
					<button class="btn btn-ghost btn-sm" onclick={() => retry(qi)}>↺ Сбросить выбор</button>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.quiz {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.q {
		padding: 18px;
	}
	.q-text {
		display: flex;
		gap: 9px;
		margin-bottom: 14px;
	}
	.q-icon {
		flex: none;
		font-size: 1.1rem;
		line-height: 1.5;
	}
	.q-md {
		flex: 1;
		min-width: 0;
	}
	.q-md :global(p) {
		margin: 0;
		font-weight: 600;
		font-size: 1.03rem;
	}
	.q-md :global(.md-code) {
		margin-top: 10px;
		font-weight: 400;
	}
	.opt-text {
		min-width: 0;
	}
	.options {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.opt {
		display: flex;
		align-items: center;
		gap: 11px;
		text-align: left;
		padding: 11px 14px;
		border: 1.5px solid var(--border-strong);
		border-radius: 12px;
		background: var(--surface);
		cursor: pointer;
		font-size: 0.95rem;
		font-family: var(--font-body);
		color: var(--ink);
		transition: all var(--transition);
	}
	.opt:hover:not(:disabled) {
		border-color: var(--accent);
		background: var(--accent-soft);
	}
	.opt:disabled {
		cursor: default;
	}
	.opt-mark {
		flex: none;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--surface-2);
		font-weight: 700;
		font-size: 0.85rem;
		color: var(--ink-2);
	}
	.opt.correct {
		border-color: var(--success);
		background: var(--success-soft);
		color: #0f7a3f;
	}
	.opt.correct .opt-mark {
		background: var(--success);
		color: #fff;
	}
	.opt.wrong {
		border-color: var(--danger);
		background: var(--danger-soft);
		color: #a52741;
	}
	.opt.wrong .opt-mark {
		background: var(--danger);
		color: #fff;
	}
	.explain {
		margin-top: 11px;
		padding: 10px 14px;
		border-radius: 10px;
		background: var(--info-soft);
		font-size: 0.9rem;
		color: var(--ink);
	}
	.explain.right {
		background: var(--success-soft);
	}
	.retry {
		margin-top: 11px;
		padding: 9px 14px;
		border-radius: 10px;
		background: var(--warning-soft);
		color: #8a5a08;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
</style>
