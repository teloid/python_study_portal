<script>
	import '../app.css';
	import { page } from '$app/state';
	import GlossaryTooltip from '$lib/components/GlossaryTooltip.svelte';

	let { data, children } = $props();
	let user = $derived(data.user);

	let path = $derived(page.url.pathname);
	/** @param {string} prefix */
	function active(prefix) {
		return path === prefix || path.startsWith(prefix + '/');
	}
</script>

<GlossaryTooltip />

<div class="shell">
	<header class="topbar">
		<div class="container bar">
			<a class="brand" href={user ? (user.role === 'teacher' ? '/teacher' : '/app') : '/'}>
				<span class="logo">🐍</span>
				<span class="brand-name">Питон-Портал</span>
			</a>

			{#if user}
				<nav class="nav">
					{#if user.role === 'teacher'}
						<a class="navlink" class:on={active('/teacher')} href="/teacher">Ученики</a>
					{/if}
					<a class="navlink" class:on={active('/app')} href="/app">Уроки</a>
					<a class="navlink" class:on={active('/glossary')} href="/glossary">Глоссарий</a>
				</nav>

				<div class="user">
					<span class="who">
						<span class="role-dot" class:teacher={user.role === 'teacher'}></span>
						{user.displayName}
					</span>
					<form method="POST" action="/logout">
						<button class="btn btn-ghost btn-sm" type="submit">Выйти</button>
					</form>
				</div>
			{/if}
		</div>
	</header>

	<main class="content">
		{@render children()}
	</main>

	<footer class="foot">
		<div class="container">
			<span>🐍 Питон-Портал — учим Python и SQL с удовольствием</span>
		</div>
	</footer>
</div>

<style>
	.shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.topbar {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.82);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--border);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 18px;
		height: 64px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 9px;
		text-decoration: none;
		color: var(--ink);
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.2rem;
	}
	.brand:hover {
		text-decoration: none;
	}
	.logo {
		font-size: 1.5rem;
	}
	.nav {
		display: flex;
		gap: 6px;
		margin-left: 14px;
	}
	.navlink {
		padding: 8px 14px;
		border-radius: var(--r-pill);
		color: var(--ink-2);
		font-weight: 600;
		font-size: 0.94rem;
		text-decoration: none;
	}
	.navlink:hover {
		background: var(--surface-2);
		text-decoration: none;
	}
	.navlink.on {
		background: var(--accent-soft);
		color: var(--accent-700);
	}
	.user {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 7px;
		font-weight: 600;
		font-size: 0.92rem;
		color: var(--ink-2);
	}
	.role-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--py-blue);
	}
	.role-dot.teacher {
		background: var(--py-yellow-600);
	}
	form {
		margin: 0;
	}
	.content {
		flex: 1;
		padding: 30px 0 60px;
	}
	.foot {
		border-top: 1px solid var(--border);
		padding: 22px 0;
		color: var(--ink-3);
		font-size: 0.88rem;
		text-align: center;
	}
	@media (max-width: 560px) {
		.brand-name {
			display: none;
		}
		.who {
			display: none;
		}
	}
</style>
