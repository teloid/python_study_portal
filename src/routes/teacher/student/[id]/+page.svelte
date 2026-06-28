<script>
	import { enhance } from '$app/forms';
	import { TOPIC_LABELS } from '$lib/content/schema';

	let { data, form } = $props();

	/** @param {any} ms */
	function fmt(ms) {
		if (!ms) return '—';
		return new Date(Number(ms)).toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	/** @type {Record<string, string>} */
	const statusLabel = { completed: '✓ Пройден', in_progress: 'В процессе' };

	let completed = $derived(data.lessons.filter((l) => l.progress?.status === 'completed').length);
</script>

<svelte:head><title>{data.student.display_name} — Питон-Портал</title></svelte:head>

<div class="container">
	<a class="back" href="/teacher">← Все ученики</a>

	<header class="s-head card">
		<div class="avatar">{(data.student.display_name ?? '?').slice(0, 1)}</div>
		<div class="grow">
			<h1>{data.student.display_name}</h1>
			<div class="dim">@{data.student.username} · в системе с {fmt(data.student.created_at)}</div>
		</div>
		<div class="stat">
			<div class="stat-num">{completed}</div>
			<div class="dim">уроков пройдено</div>
		</div>
	</header>

	<div class="reset-row">
		<form
			method="POST"
			action="?/reset"
			use:enhance={({ cancel }) => {
				if (
					!confirm(
						`Сбросить весь прогресс и все попытки ученика «${data.student.display_name}»? Это действие необратимо.`
					)
				) {
					cancel();
					return;
				}
				return async ({ update }) => {
					await update();
				};
			}}
		>
			<button class="btn btn-ghost btn-sm danger" type="submit">↺ Сбросить прогресс ученика</button>
		</form>
		{#if form?.reset}<span class="ok-note fade-up">✓ Прогресс сброшен</span>{/if}
		{#if form?.message}<span class="err-note">⚠ {form.message}</span>{/if}
	</div>

	<section>
		<h2 class="sec">Прогресс по урокам</h2>
		<div class="card table-card">
			<table class="ptable">
				<thead>
					<tr><th>Урок</th><th>Тип</th><th>Статус</th><th>Баллы</th><th>Обновлён</th></tr>
				</thead>
				<tbody>
					{#each data.lessons as l (l.slug)}
						<tr class:dim-row={!l.available}>
							<td class="ltitle">
								<span class="lnum">{l.order}.</span>
								{#if l.available}
									<a href="/app/lesson/{l.slug}">{l.title}</a>
								{:else}
									{l.title} <span class="soon-tag">скоро</span>
								{/if}
							</td>
							<td><span class="badge badge-{l.topic}">{TOPIC_LABELS[l.topic]}</span></td>
							<td>
								{#if l.progress}
									<span class="st {l.progress.status}">{statusLabel[l.progress.status] ?? l.progress.status}</span>
								{:else}
									<span class="dim">—</span>
								{/if}
							</td>
							<td>
								{#if l.progress}{l.progress.score} / {l.progress.max_score}{:else}<span class="dim">—</span>{/if}
							</td>
							<td class="dim">{l.progress ? fmt(l.progress.updated_at) : '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section>
		<h2 class="sec">Последние попытки <span class="dim small">(код ученика)</span></h2>
		{#if data.submissions.length === 0}
			<p class="muted">Пока нет ни одной попытки.</p>
		{:else}
			<div class="subs">
				{#each data.submissions as s, i}
					<details class="sub card" open={i < 3}>
						<summary>
							<span class="sub-mark" class:ok={s.passed}>{s.passed ? '✓' : '✗'}</span>
							<span class="sub-lesson">{data.lessonTitles[String(s.lesson_slug)] ?? s.lesson_slug}</span>
							<span class="sub-ex dim">· {s.exercise_id}</span>
							<span class="sub-time dim">{fmt(s.created_at)}</span>
						</summary>
						<pre class="sub-code">{s.code}</pre>
					</details>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.back {
		display: inline-block;
		margin-bottom: 14px;
		font-weight: 600;
		color: var(--ink-2);
	}
	.s-head {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 22px 26px;
		margin-bottom: 26px;
	}
	.avatar {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--py-blue));
		color: #fff;
		display: grid;
		place-items: center;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.7rem;
		text-transform: uppercase;
	}
	.s-head h1 {
		margin: 0 0 2px;
	}
	.stat {
		text-align: center;
	}
	.stat-num {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 2rem;
		color: var(--accent-700);
	}
	.reset-row {
		display: flex;
		align-items: center;
		gap: 14px;
		margin: -10px 0 6px;
	}
	.reset-row form {
		margin: 0;
	}
	.danger {
		color: var(--danger);
		border-color: var(--danger-soft);
	}
	.danger:hover {
		background: var(--danger-soft);
		border-color: var(--danger);
	}
	.ok-note {
		color: var(--success);
		font-weight: 600;
		font-size: 0.9rem;
	}
	.err-note {
		color: var(--danger);
		font-weight: 600;
		font-size: 0.9rem;
	}
	.sec {
		font-size: 1.4rem;
		margin: 28px 0 14px;
	}
	.small {
		font-size: 0.8rem;
		font-weight: 400;
	}
	.table-card {
		padding: 0;
		overflow: hidden;
	}
	.ptable {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.92rem;
	}
	.ptable th {
		text-align: left;
		padding: 12px 16px;
		background: var(--surface-2);
		color: var(--ink-2);
		font-size: 0.82rem;
		border-bottom: 1px solid var(--border);
	}
	.ptable td {
		padding: 11px 16px;
		border-bottom: 1px solid var(--border);
	}
	.ptable tr:last-child td {
		border-bottom: none;
	}
	.dim-row {
		opacity: 0.5;
	}
	.lnum {
		color: var(--ink-3);
		font-weight: 700;
		margin-right: 4px;
	}
	.soon-tag {
		font-size: 0.72rem;
		color: var(--ink-3);
		background: var(--surface-2);
		padding: 1px 7px;
		border-radius: var(--r-pill);
	}
	.st.completed {
		color: var(--success);
		font-weight: 700;
	}
	.st.in_progress {
		color: var(--warning);
		font-weight: 600;
	}
	.subs {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.sub {
		padding: 0;
		overflow: hidden;
	}
	.sub summary {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 13px 16px;
		cursor: pointer;
		font-size: 0.92rem;
	}
	.sub-mark {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--danger);
		color: #fff;
		display: grid;
		place-items: center;
		font-weight: 800;
		font-size: 0.8rem;
		flex: none;
	}
	.sub-mark.ok {
		background: var(--success);
	}
	.sub-lesson {
		font-weight: 600;
	}
	.sub-time {
		margin-left: auto;
		font-size: 0.82rem;
	}
	.sub-code {
		margin: 0;
		padding: 14px 16px;
		background: var(--code-bg);
		color: #c8d3e0;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		white-space: pre-wrap;
		border-top: 1px solid var(--border);
	}
</style>
