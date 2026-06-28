<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitting = $state(false);
</script>

<svelte:head><title>Вход — Питон-Портал</title></svelte:head>

<div class="login-wrap">
	<div class="hero">
		<div class="logo-big">🐍</div>
		<h1>Питон-Портал</h1>
		<p class="tagline">Учим Python и немного SQL — в браузере, по-русски и с удовольствием.</p>
		<ul class="perks">
			<li>▶ Запуск кода прямо на странице</li>
			<li>📚 Понятная теория и живые упражнения</li>
			<li>💡 Подсказки к английским названиям функций</li>
		</ul>
	</div>

	<div class="card login-card">
		<h2>Вход</h2>
		<p class="muted">Войдите под своим логином, чтобы продолжить.</p>

		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			<div class="field">
				<label for="username">Логин</label>
				<input
					class="input"
					id="username"
					name="username"
					autocomplete="username"
					value={form?.username ?? ''}
					placeholder="например, student"
					required
				/>
			</div>
			<div class="field">
				<label for="password">Пароль</label>
				<input
					class="input"
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/>
			</div>

			{#if form?.message}
				<div class="error-box">⚠ {form.message}</div>
			{/if}

			<button class="btn btn-primary btn-lg full" type="submit" disabled={submitting}>
				{#if submitting}<span class="spinner"></span>{/if} Войти
			</button>
		</form>
	</div>
</div>

<style>
	.login-wrap {
		max-width: 940px;
		margin: 4vh auto 0;
		padding: 0 20px;
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 40px;
		align-items: center;
	}
	.hero {
		padding: 10px;
	}
	.logo-big {
		font-size: 4rem;
		line-height: 1;
		margin-bottom: 10px;
	}
	.hero h1 {
		font-size: 2.6rem;
		margin-bottom: 8px;
	}
	.tagline {
		font-size: 1.15rem;
		color: var(--ink-2);
		margin-bottom: 22px;
	}
	.perks {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.perks li {
		font-size: 1rem;
		color: var(--ink-2);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--r-pill);
		padding: 9px 16px;
		width: fit-content;
		box-shadow: var(--shadow-sm);
	}
	.login-card {
		padding: 30px;
		box-shadow: var(--shadow-lg);
	}
	.login-card h2 {
		margin-bottom: 4px;
	}
	.full {
		width: 100%;
		margin-top: 6px;
	}
	.error-box {
		background: var(--danger-soft);
		color: #a52741;
		padding: 11px 14px;
		border-radius: var(--r-md);
		margin-bottom: 14px;
		font-size: 0.92rem;
	}
	@media (max-width: 760px) {
		.login-wrap {
			grid-template-columns: 1fr;
			gap: 24px;
			margin-top: 2vh;
		}
		.hero {
			text-align: center;
		}
		.perks li {
			margin: 0 auto;
		}
	}
</style>
