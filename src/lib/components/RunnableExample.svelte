<script>
	import CodeEditor from './CodeEditor.svelte';
	import OutputPanel from './OutputPanel.svelte';
	import { runProgram } from '$lib/runtime/python';

	let { code = '', lang = 'python' } = $props();

	let value = $state(code);
	let out = $state('');
	let err = $state('');
	let error = $state('');
	let running = $state(false);
	let touched = $state(false);

	async function run() {
		running = true;
		touched = true;
		out = '';
		err = '';
		error = '';
		try {
			const res = await runProgram(value, (text, stream) => {
				if (stream === 'err') err += text;
				else out += text;
			});
			if (!res.ok && res.error) error = res.error;
		} catch (e) {
			error = /** @type {any} */ (e)?.message ?? String(e);
		} finally {
			running = false;
		}
	}
</script>

<div class="runnable">
	<CodeEditor bind:value {lang} onrun={run} minHeight="60px" />
	<div class="controls">
		<button class="btn btn-run btn-sm" onclick={run} disabled={running}>
			{#if running}<span class="spinner"></span>{:else}▶{/if} Запустить
		</button>
		<span class="dim hint">или Ctrl+Enter • можно менять код и пробовать</span>
	</div>
	{#if touched}
		<OutputPanel {out} {err} {error} {running} />
	{/if}
</div>

<style>
	.runnable {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 18px 0;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.hint {
		font-size: 0.82rem;
	}
</style>
