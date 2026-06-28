<script>
	// Глобальная всплывашка для терминов глоссария. Любой элемент с классом
	// .gl-term и атрибутом data-term="имя" (их создаёт markdown.js) при наведении
	// или клике показывает объяснение: произношение, перевод названия и пример.
	import { onMount } from 'svelte';
	import { lookup } from '$lib/content/glossary';

	let entry = $state(/** @type {any} */ (null));
	let pos = $state({ x: 0, y: 0, above: false });
	let pinned = $state(false);
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let hideTimer;
	/** @type {HTMLDivElement | undefined} */
	let tipEl = $state();

	/** @param {Element} target */
	function showFor(target) {
		const term = target.getAttribute('data-term');
		const e = lookup(term ?? '');
		if (!e) return;
		clearTimeout(hideTimer);
		entry = e;
		const r = target.getBoundingClientRect();
		const above = r.bottom > window.innerHeight - 230;
		pos = { x: r.left + r.width / 2, y: above ? r.top : r.bottom, above };
	}

	function scheduleHide() {
		if (pinned) return;
		hideTimer = setTimeout(() => (entry = null), 140);
	}
	function close() {
		pinned = false;
		entry = null;
	}

	onMount(() => {
		/** @param {any} ev */
		const over = (ev) => {
			const t = ev.target?.closest?.('.gl-term');
			if (t) showFor(t);
		};
		/** @param {any} ev */
		const out = (ev) => {
			if (ev.target?.closest?.('.gl-term')) scheduleHide();
		};
		/** @param {any} ev */
		const click = (ev) => {
			const t = ev.target?.closest?.('.gl-term');
			if (t) {
				ev.preventDefault();
				showFor(t);
				pinned = true;
			} else if (tipEl && !tipEl.contains(ev.target)) {
				close();
			}
		};
		/** @param {any} ev */
		const focusin = (ev) => {
			const t = ev.target?.closest?.('.gl-term');
			if (t) showFor(t);
		};
		/** @param {KeyboardEvent} ev */
		const key = (ev) => {
			if (ev.key === 'Escape') close();
		};

		document.addEventListener('pointerover', over);
		document.addEventListener('pointerout', out);
		document.addEventListener('click', click);
		document.addEventListener('focusin', focusin);
		document.addEventListener('keydown', key);
		return () => {
			document.removeEventListener('pointerover', over);
			document.removeEventListener('pointerout', out);
			document.removeEventListener('click', click);
			document.removeEventListener('focusin', focusin);
			document.removeEventListener('keydown', key);
		};
	});
</script>

{#if entry}
	<div
		class="gl-pop"
		class:above={pos.above}
		bind:this={tipEl}
		role="tooltip"
		style="left:{pos.x}px; top:{pos.y}px;"
		onpointerenter={() => clearTimeout(hideTimer)}
		onpointerleave={scheduleHide}
	>
		<div class="head">
			<code class="name">{entry.name}</code>
			{#if entry.ru_pronunciation}<span class="pron">🔊 {entry.ru_pronunciation}</span>{/if}
			{#if pinned}<button class="x" onclick={close} aria-label="Закрыть">✕</button>{/if}
		</div>
		{#if entry.en_word}<div class="en">{entry.en_word}</div>{/if}
		<div class="explain">{entry.ru_explanation}</div>
		{#if entry.example_code}<pre class="ex">{entry.example_code}</pre>{/if}
	</div>
{/if}

<style>
	.gl-pop {
		position: fixed;
		z-index: 1000;
		transform: translate(-50%, 10px);
		width: min(340px, calc(100vw - 28px));
		background: #1f2430;
		color: #e7ecf4;
		border: 1px solid #323a4d;
		border-radius: 14px;
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
		padding: 13px 15px;
		font-family: var(--font-body);
		animation: pop 140ms ease both;
	}
	.gl-pop.above {
		transform: translate(-50%, calc(-100% - 10px));
	}
	.head {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 7px;
	}
	.name {
		font-family: var(--font-mono);
		font-weight: 700;
		color: #ffd43b;
		background: rgba(255, 212, 59, 0.12);
		padding: 2px 8px;
		border-radius: 7px;
	}
	.pron {
		font-size: 0.82rem;
		color: #9aa6bd;
	}
	.x {
		margin-left: auto;
		background: none;
		border: none;
		color: #8b94a8;
		cursor: pointer;
		font-size: 0.9rem;
		padding: 2px 4px;
	}
	.en {
		font-size: 0.82rem;
		color: #9aa6bd;
		margin-bottom: 6px;
	}
	.explain {
		font-size: 0.9rem;
		line-height: 1.5;
		color: #dfe5f0;
	}
	.ex {
		margin: 9px 0 0;
		padding: 9px 11px;
		background: #161b24;
		border-radius: 9px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: #c8d3e0;
		white-space: pre-wrap;
		overflow-x: auto;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translate(-50%, 4px) scale(0.97);
		}
		to {
			opacity: 1;
		}
	}
</style>
