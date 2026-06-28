<script>
	let { data } = $props();

	/** @param {any} ms */
	function fmtDate(ms) {
		if (!ms) return '—';
		return new Date(Number(ms)).toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head><title>Ученики — Питон-Портал</title></svelte:head>

<div class="container">
	<header class="t-head">
		<div>
			<h1>👩‍🏫 Кабинет преподавателя</h1>
			<p class="muted">Прогресс учеников по курсу. Нажмите на ученика, чтобы увидеть детали и его код.</p>
		</div>
		<div class="overview">
			<div class="ov-num">{data.students.length}</div>
			<div class="ov-label">учеников</div>
		</div>
	</header>

	{#if data.students.length === 0}
		<div class="card empty">
			<h3>Пока нет учеников</h3>
			<p class="muted">
				Добавьте ученика в базу: сгенерируйте пароль командой <code>npm run hash</code> и вставьте
				пользователя в таблицу <code>users</code> (см. README).
			</p>
		</div>
	{:else}
		<div class="student-grid">
			{#each data.students as s (s.id)}
				{@const completed = Number(s.completed ?? 0)}
				{@const pct = data.totalLessons ? Math.round((completed / data.totalLessons) * 100) : 0}
				<a class="card hoverable student" href="/teacher/student/{s.id}">
					<div class="s-top">
						<div class="avatar">{(s.display_name ?? '?').slice(0, 1)}</div>
						<div>
							<div class="s-name">{s.display_name}</div>
							<div class="s-login dim">@{s.username}</div>
						</div>
					</div>
					<div class="s-stats">
						<div class="progress"><span style="width:{pct}%"></span></div>
						<div class="s-line">
							<span><b>{completed}</b> пройдено</span>
							<span class="dim">{Number(s.started ?? 0)} начато</span>
						</div>
					</div>
					<div class="s-foot dim">Последняя активность: {fmtDate(s.last_active)}</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.t-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		margin-bottom: 24px;
	}
	.overview {
		text-align: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		padding: 14px 26px;
		box-shadow: var(--shadow-sm);
	}
	.ov-num {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 2rem;
		color: var(--py-yellow-600);
	}
	.ov-label {
		color: var(--ink-2);
		font-size: 0.85rem;
	}
	.empty {
		padding: 30px;
	}
	.student-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 16px;
	}
	.student {
		display: flex;
		flex-direction: column;
		gap: 14px;
		text-decoration: none;
		color: inherit;
	}
	.student:hover {
		text-decoration: none;
	}
	.s-top {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.avatar {
		width: 46px;
		height: 46px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--accent), var(--py-blue));
		color: #fff;
		display: grid;
		place-items: center;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.3rem;
		text-transform: uppercase;
	}
	.s-name {
		font-weight: 700;
		font-size: 1.1rem;
	}
	.s-login {
		font-size: 0.85rem;
	}
	.s-line {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		font-size: 0.9rem;
	}
	.s-foot {
		font-size: 0.82rem;
	}
</style>
