<script>
	import { LEVEL_LABELS, TOPIC_LABELS } from '$lib/content/schema';

	let {
		entry,
		available = false,
		locked = false,
		lockLabel = '🔒 Скоро',
		status = null,
		score = 0,
		maxScore = 0
	} = $props();

	// Кликабельна только если урок готов И не заблокирован.
	let open = $derived(available && !locked);
	let pct = $derived(maxScore > 0 ? Math.round((score / maxScore) * 100) : 0);
	// Что показать в подвале заблокированной/недоступной карточки.
	let footLabel = $derived(!available ? '🔒 Скоро' : lockLabel);
</script>

{#snippet body()}
	<div class="top">
		<span class="emoji" class:dimmed={!open}>{entry.emoji}</span>
		<div class="badges">
			<span class="badge badge-{entry.topic}">{TOPIC_LABELS[entry.topic]}</span>
			<span class="badge badge-{entry.level}">{LEVEL_LABELS[entry.level]}</span>
		</div>
	</div>
	<h3 class="title">
		{#if !entry.deepdive}<span class="num">Урок {entry.order}.</span>{/if}
		{entry.title}
	</h3>
	<p class="summary">{entry.summary}</p>
{/snippet}

{#if open}
	<a class="lesson-card card hoverable" href="/app/lesson/{entry.slug}">
		{@render body()}
		<div class="foot">
			{#if status === 'completed'}
				<span class="status done">✓ Пройден</span>
			{:else if status === 'in_progress'}
				<div class="prog">
					<div class="progress"><span style="width:{pct}%"></span></div>
					<span class="prog-label">{score} / {maxScore}</span>
				</div>
			{:else}
				<span class="status start">Начать →</span>
			{/if}
			<span class="mins">~{entry.estimatedMinutes} мин</span>
		</div>
	</a>
{:else}
	<div class="lesson-card card locked-card" class:gated={available && locked}>
		{@render body()}
		<div class="foot">
			<span class="status soon">{footLabel}</span>
			<span class="mins">~{entry.estimatedMinutes} мин</span>
		</div>
	</div>
{/if}

<style>
	.lesson-card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		text-decoration: none;
		color: inherit;
	}
	.lesson-card:hover {
		text-decoration: none;
	}
	.locked-card {
		opacity: 0.62;
	}
	.locked-card.gated {
		opacity: 0.78;
		border-style: dashed;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	.emoji {
		font-size: 2rem;
		line-height: 1;
	}
	.emoji.dimmed {
		filter: grayscale(0.6);
	}
	.badges {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.title {
		font-size: 1.12rem;
		margin: 0;
	}
	.num {
		color: var(--ink-3);
		font-weight: 700;
	}
	.summary {
		color: var(--ink-2);
		font-size: 0.9rem;
		margin: 0;
		flex-grow: 1;
	}
	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-top: 4px;
	}
	.status {
		font-weight: 700;
		font-size: 0.9rem;
	}
	.status.done {
		color: var(--success);
	}
	.status.start {
		color: var(--accent-600);
	}
	.status.soon {
		color: var(--ink-3);
	}
	.mins {
		color: var(--ink-3);
		font-size: 0.82rem;
	}
	.prog {
		display: flex;
		align-items: center;
		gap: 9px;
		flex: 1;
	}
	.prog .progress {
		flex: 1;
		max-width: 130px;
	}
	.prog-label {
		font-size: 0.8rem;
		color: var(--ink-2);
		font-weight: 600;
	}
</style>
