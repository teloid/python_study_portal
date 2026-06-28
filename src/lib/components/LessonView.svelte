<script>
	import { onMount } from 'svelte';
	import TheoryBlock from './TheoryBlock.svelte';
	import Exercise from './Exercise.svelte';
	import Quiz from './Quiz.svelte';
	import { LEVEL_LABELS, TOPIC_LABELS } from '$lib/content/schema';
	import { CATALOG } from '$lib/content/catalog';
	import { isLessonAvailable } from '$lib/content/lessons';
	import { warmupPython } from '$lib/runtime/python';
	import { warmupSql } from '$lib/runtime/sqldb';

	let { lesson, progress, maxScore } = $props();

	const wasCompleted = progress?.status === 'completed';
	let passedSet = $state(new Set(wasCompleted ? lesson.exercises.map((/** @type {any} */ e) => e.id) : []));
	let quizCorrect = $state(wasCompleted ? (lesson.quiz?.length ?? 0) : 0);

	let score = $derived(passedSet.size + quizCorrect);
	let pct = $derived(maxScore > 0 ? Math.round((score / maxScore) * 100) : 0);
	let isDone = $derived(maxScore > 0 && score >= maxScore);

	let nextLesson = $derived.by(() => {
		const ordered = [...CATALOG].sort((a, b) => a.order - b.order);
		return ordered.find((c) => c.order > lesson.order && isLessonAvailable(c.slug)) ?? null;
	});

	onMount(() => {
		if (lesson.topic === 'sql' || lesson.exercises.some((/** @type {any} */ e) => e.lang === 'sql'))
			warmupSql();
		if (
			lesson.topic === 'python' ||
			lesson.exercises.some((/** @type {any} */ e) => e.lang === 'python')
		)
			warmupPython();
	});

	/** @param {number} s @param {any} submission */
	async function postProgress(s, submission) {
		try {
			await fetch('/api/progress', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ lessonSlug: lesson.slug, score: s, maxScore, submission })
			});
		} catch {
			/* офлайн — попробуем сохранить позже */
		}
	}

	/** @param {{ exerciseId: string, passed: boolean, code: string }} r */
	function onExerciseResult({ exerciseId, passed, code }) {
		if (passed && !passedSet.has(exerciseId)) {
			const next = new Set(passedSet);
			next.add(exerciseId);
			passedSet = next;
		}
		postProgress(passedSet.size + quizCorrect, { exerciseId, passed, code });
	}

	/** @param {{ correct: number, total: number }} r */
	function onQuizResult({ correct }) {
		quizCorrect = correct;
		postProgress(passedSet.size + quizCorrect, null);
	}
</script>

<svelte:head><title>{lesson.title} — Питон-Портал</title></svelte:head>

<div class="container lesson">
	<a class="back" href="/app">← Все уроки</a>

	<header class="lesson-head card">
		<div class="head-main">
			<div class="badges">
				<span class="badge badge-{lesson.topic}">{TOPIC_LABELS[lesson.topic]}</span>
				<span class="badge badge-{lesson.level}">{LEVEL_LABELS[lesson.level]}</span>
				<span class="badge badge-soft">~{lesson.estimatedMinutes} мин</span>
			</div>
			<h1>{lesson.emoji} {lesson.title}</h1>
			<p class="summary muted">{lesson.summary}</p>
		</div>
		<div class="head-progress">
			<div class="ring-num">{score}<span>/{maxScore}</span></div>
			<div class="progress"><span style="width:{pct}%"></span></div>
			<div class="pp-label">{isDone ? '✓ Урок пройден' : 'баллов за урок'}</div>
		</div>
	</header>

	{#if lesson.goals?.length}
		<section class="goals card">
			<h3>🎯 Чему научимся</h3>
			<ul>
				{#each lesson.goals as g}<li>{g}</li>{/each}
			</ul>
		</section>
	{/if}

	<section class="theory">
		<h2 class="sec-title">📖 Теория</h2>
		{#each lesson.theory as block}
			<TheoryBlock {block} />
		{/each}
	</section>

	<section class="exercises">
		<h2 class="sec-title">⌨️ Упражнения</h2>
		<p class="muted hint-line">
			Пишите код в редакторе и нажимайте «Запустить». Зелёные галочки — задание решено!
		</p>
		<div class="ex-list">
			{#each lesson.exercises as ex, i (ex.id)}
				<Exercise exercise={ex} index={i} done={passedSet.has(ex.id)} onresult={onExerciseResult} />
			{/each}
		</div>
	</section>

	{#if lesson.quiz?.length}
		<section class="quiz-sec">
			<h2 class="sec-title">🧠 Проверь себя</h2>
			<Quiz items={lesson.quiz} onresult={onQuizResult} />
		</section>
	{/if}

	{#if isDone}
		<section class="done-banner fade-up">
			<div class="done-emoji">🎉</div>
			<h2>Урок пройден полностью!</h2>
			<p>Отличная работа. Все упражнения решены, тест пройден.</p>
			<div class="done-actions">
				{#if nextLesson}
					<a class="btn btn-primary btn-lg" href="/app/lesson/{nextLesson.slug}">
						Следующий урок: {nextLesson.title} →
					</a>
				{/if}
				<a class="btn btn-ghost" href="/app">К списку уроков</a>
			</div>
		</section>
	{/if}
</div>

<style>
	.lesson {
		max-width: 860px;
	}
	.back {
		display: inline-block;
		margin-bottom: 14px;
		font-weight: 600;
		color: var(--ink-2);
	}
	.lesson-head {
		display: flex;
		gap: 24px;
		justify-content: space-between;
		align-items: flex-start;
		padding: 26px 28px;
		background: linear-gradient(120deg, #fff, #eef6ff);
	}
	.lesson-head h1 {
		margin: 10px 0 8px;
		font-size: 1.9rem;
	}
	.badges {
		display: flex;
		gap: 7px;
		flex-wrap: wrap;
	}
	.summary {
		margin: 0;
		max-width: 540px;
	}
	.head-progress {
		flex: none;
		width: 160px;
		text-align: center;
	}
	.ring-num {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 2rem;
		color: var(--accent-700);
		line-height: 1;
		margin-bottom: 8px;
	}
	.ring-num span {
		font-size: 1rem;
		color: var(--ink-3);
	}
	.pp-label {
		margin-top: 8px;
		font-size: 0.82rem;
		color: var(--ink-2);
		font-weight: 600;
	}
	.goals {
		margin-top: 18px;
		padding: 20px 24px;
		background: var(--bg-warm);
	}
	.goals h3 {
		margin-bottom: 8px;
	}
	.goals ul {
		margin: 0;
		columns: 2;
		column-gap: 28px;
	}
	.goals li {
		break-inside: avoid;
		color: var(--ink-2);
	}
	.sec-title {
		margin: 36px 0 14px;
		font-size: 1.5rem;
	}
	.hint-line {
		margin-top: -6px;
		margin-bottom: 16px;
	}
	.ex-list {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.done-banner {
		margin-top: 40px;
		text-align: center;
		padding: 40px 28px;
		border-radius: var(--r-xl);
		background: linear-gradient(135deg, #e3f7ec, #eef6ff);
		border: 1px solid #b9e6cd;
	}
	.done-emoji {
		font-size: 3.4rem;
	}
	.done-banner h2 {
		margin: 8px 0;
	}
	.done-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 18px;
	}
	@media (max-width: 680px) {
		.lesson-head {
			flex-direction: column;
		}
		.head-progress {
			width: 100%;
		}
		.goals ul {
			columns: 1;
		}
	}
</style>
