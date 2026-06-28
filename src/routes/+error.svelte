<script>
	import { page } from '$app/state';
</script>

<svelte:head><title>Упс — Питон-Портал</title></svelte:head>

<div class="err-wrap">
	<div class="big">🐍</div>
	<h1>{page.status}</h1>
	<p class="muted">{page.error?.message ?? 'Что-то пошло не так.'}</p>
	<a class="btn btn-primary" href="/">На главную</a>
</div>

<style>
	.err-wrap {
		max-width: 460px;
		margin: 10vh auto;
		text-align: center;
		padding: 0 20px;
	}
	.big {
		font-size: 4rem;
	}
	.err-wrap h1 {
		font-size: 3rem;
		margin: 6px 0;
	}
	.err-wrap p {
		margin-bottom: 22px;
	}
</style>
