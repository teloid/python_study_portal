<script>
	let {
		out = '',
		err = '',
		error = '',
		running = false,
		empty = 'Нажмите «Запустить» — результат появится здесь.'
	} = $props();

	let hasContent = $derived(Boolean(out || err || error));
</script>

<div class="terminal" class:running>
	<div class="bar">
		<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
		<span class="title">Результат</span>
		{#if running}<span class="run-tag">выполняется…</span>{/if}
	</div>
	<pre class="body">{#if !hasContent && !running}<span class="empty">{empty}</span>{:else}{#if out}<span class="out">{out}</span>{/if}{#if err}<span class="err">{err}</span>{/if}{#if error}<span class="error">{error}</span>{/if}{/if}</pre>
</div>

<style>
	.terminal {
		background: var(--code-bg);
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid #1c2128;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 8px 12px;
		background: #21262d;
		border-bottom: 1px solid #1c2128;
	}
	.dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		display: inline-block;
	}
	.dot.red {
		background: #ff5f56;
	}
	.dot.yellow {
		background: #ffbd2e;
	}
	.dot.green {
		background: #27c93f;
	}
	.title {
		margin-left: 8px;
		color: #8b949e;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.run-tag {
		margin-left: auto;
		color: var(--py-yellow);
		font-size: 0.78rem;
	}
	.body {
		margin: 0;
		padding: 14px 16px;
		font-family: var(--font-mono);
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--code-ink);
		white-space: pre-wrap;
		word-break: break-word;
		min-height: 56px;
		max-height: 320px;
		overflow: auto;
	}
	.empty {
		color: #5c6370;
		font-style: italic;
	}
	.out {
		color: #c8d3e0;
	}
	.err {
		color: var(--py-yellow);
	}
	.error {
		color: #ff7b85;
	}
</style>
