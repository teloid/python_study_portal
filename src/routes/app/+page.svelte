<script>
	import LessonCard from '$lib/components/LessonCard.svelte';

	let { data } = $props();

	let pct = $derived(
		data.totalCount > 0 ? Math.round((data.completedCount / data.totalCount) * 100) : 0
	);
</script>

<svelte:head><title>Мои уроки — Питон-Портал</title></svelte:head>

<div class="container">
	<section class="welcome card">
		<div class="welcome-text">
			<h1>Привет, {data.displayName}! 👋</h1>
			<p class="muted">
				Продолжаем учить Python. Выбирай урок, читай теорию и сразу пробуй код — всё прямо в браузере.
			</p>
		</div>
		<div class="welcome-stat">
			<div class="big">{data.completedCount}<span class="of">/ {data.totalCount}</span></div>
			<div class="stat-label">уроков пройдено</div>
			<div class="progress"><span style="width:{pct}%"></span></div>
		</div>
	</section>

	<div class="section-head">
		<h2>Программа курса</h2>
		<span class="muted small">Доступно сейчас: {data.availableCount} • Остальные скоро добавим</span>
	</div>

	<div class="grid">
		{#each data.lessons as lesson (lesson.slug)}
			<LessonCard
				entry={lesson}
				available={lesson.available}
				status={lesson.progress?.status ?? null}
				score={lesson.progress?.score ?? 0}
				maxScore={lesson.progress?.max_score ?? 0}
			/>
		{/each}
	</div>
</div>

<style>
	.welcome {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 26px;
		padding: 26px 30px;
		margin-bottom: 28px;
		background: linear-gradient(120deg, #fff, #f3f1ff);
	}
	.welcome h1 {
		margin-bottom: 6px;
	}
	.welcome-text {
		max-width: 560px;
	}
	.welcome-stat {
		flex: none;
		text-align: center;
		min-width: 170px;
	}
	.big {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 2.6rem;
		color: var(--accent-700);
		line-height: 1;
	}
	.of {
		font-size: 1.2rem;
		color: var(--ink-3);
		margin-left: 4px;
	}
	.stat-label {
		color: var(--ink-2);
		font-size: 0.9rem;
		margin: 4px 0 10px;
	}
	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 16px;
		flex-wrap: wrap;
	}
	.small {
		font-size: 0.85rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
		gap: 18px;
	}
	@media (max-width: 620px) {
		.welcome {
			flex-direction: column;
			text-align: center;
		}
	}
</style>
