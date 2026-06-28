<script>
	import { renderMarkdown } from '$lib/markdown';
	import { GLOSSARY_KEYS } from '$lib/content/glossary';
	import RunnableExample from './RunnableExample.svelte';

	let { block } = $props();

	/** @type {Record<string, string>} */
	const ICONS = { tip: '💡', warning: '⚠️', info: 'ℹ️' };
</script>

{#if block.type === 'text'}
	<div class="prose">{@html renderMarkdown(block.md, GLOSSARY_KEYS)}</div>
{:else if block.type === 'callout'}
	<div class="callout callout-{block.variant}">
		{#if block.title}
			<div class="callout-title">{ICONS[block.variant] ?? '•'} {block.title}</div>
		{/if}
		<div class="prose">{@html renderMarkdown(block.md, GLOSSARY_KEYS)}</div>
	</div>
{:else if block.type === 'code'}
	{#if block.runnable && (block.lang ?? 'python') === 'python'}
		<RunnableExample code={block.code} lang="python" />
	{:else}
		<figure class="code-static">
			<pre class="code">{block.code}</pre>
			{#if block.output}
				<div class="out-row">
					<span class="out-label">→ Вывод</span>
					<pre class="out">{block.output}</pre>
				</div>
			{/if}
			{#if block.caption}<figcaption>{block.caption}</figcaption>{/if}
		</figure>
	{/if}
{/if}

<style>
	.code-static {
		margin: 18px 0;
	}
	.code {
		margin: 0;
		background: var(--code-bg);
		color: #c8d3e0;
		padding: 14px 16px;
		border-radius: 12px;
		font-family: var(--font-mono);
		font-size: 0.88rem;
		line-height: 1.55;
		overflow-x: auto;
		border: 1px solid #1c2128;
	}
	.code-static:has(.out-row) .code {
		border-radius: 12px 12px 0 0;
	}
	.out-row {
		background: #161b22;
		border: 1px solid #1c2128;
		border-top: none;
		border-radius: 0 0 12px 12px;
		padding: 10px 16px;
	}
	.out-label {
		display: block;
		color: #6e7888;
		font-size: 0.74rem;
		font-weight: 600;
		margin-bottom: 3px;
	}
	.out {
		margin: 0;
		color: #56d364;
		font-family: var(--font-mono);
		font-size: 0.86rem;
		white-space: pre-wrap;
	}
	figcaption {
		margin-top: 8px;
		color: var(--ink-3);
		font-size: 0.85rem;
		font-style: italic;
	}
</style>
