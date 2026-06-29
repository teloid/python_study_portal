<script>
	import { renderMarkdown, renderInline } from '$lib/markdown';
	import { GLOSSARY_KEYS } from '$lib/content/glossary';

	let { items = [], onresult = () => {} } = $props();

	let selected = $state(items.map(() => -1));

	/** @param {number} qi @param {number} oi */
	function choose(qi, oi) {
		if (selected[qi] !== -1) return; // ответ фиксируется
		selected[qi] = oi;
		const correct = selected.reduce(
			(n, sel, i) => n + (sel === items[i].correct ? 1 : 0),
			0
		);
		onresult({ correct, total: items.length });
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
					{@const answered = selected[qi] !== -1}
					{@const isChosen = selected[qi] === oi}
					{@const isCorrect = q.correct === oi}
					<button
						class="opt"
						class:correct={answered && isCorrect}
						class:wrong={answered && isChosen && !isCorrect}
						disabled={answered}
						onclick={() => choose(qi, oi)}
					>
						<span class="opt-mark">
							{#if answered && isCorrect}✓{:else if answered && isChosen}✗{:else}{String.fromCharCode(65 + oi)}{/if}
						</span>
						<span class="opt-text">{@html renderInline(opt)}</span>
					</button>
				{/each}
			</div>
			{#if selected[qi] !== -1 && q.explain}
				<div class="explain fade-up" class:right={selected[qi] === q.correct}>
					{selected[qi] === q.correct ? '✅ Верно! ' : '💡 '}{@html renderInline(q.explain, GLOSSARY_KEYS)}
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
</style>
