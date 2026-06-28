<script>
	import { onMount } from 'svelte';
	import { EditorView, keymap } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { basicSetup } from 'codemirror';
	import { indentWithTab } from '@codemirror/commands';
	import { python } from '@codemirror/lang-python';
	import { sql, SQLite } from '@codemirror/lang-sql';
	import { oneDark } from '@codemirror/theme-one-dark';

	let {
		value = $bindable(''),
		lang = 'python',
		readonly = false,
		onrun = () => {},
		minHeight = '130px'
	} = $props();

	/** @type {HTMLDivElement} */
	let el;
	/** @type {EditorView | undefined} */
	let view;
	let applyingExternal = false;

	onMount(() => {
		const langExt = lang === 'sql' ? sql({ dialect: SQLite }) : python();

		const state = EditorState.create({
			doc: value,
			extensions: [
				basicSetup,
				keymap.of([
					indentWithTab,
					{ key: 'Mod-Enter', preventDefault: true, run: () => (onrun(), true) }
				]),
				langExt,
				oneDark,
				EditorView.editable.of(!readonly),
				EditorState.readOnly.of(readonly),
				EditorView.updateListener.of((u) => {
					if (u.docChanged && !applyingExternal) value = u.state.doc.toString();
				}),
				EditorView.theme({
					'&': { fontSize: '14px', backgroundColor: 'var(--code-bg)' },
					'.cm-content': { minHeight },
					'.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.6' },
					'.cm-gutters': { backgroundColor: 'var(--code-bg)', border: 'none' }
				})
			]
		});
		view = new EditorView({ state, parent: el });
		return () => view?.destroy();
	});

	// Внешний сброс value (например, кнопка «Сбросить») — обновляем содержимое.
	$effect(() => {
		const v = value;
		if (view && v !== view.state.doc.toString()) {
			applyingExternal = true;
			view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } });
			applyingExternal = false;
		}
	});
</script>

<div class="editor" bind:this={el}></div>

<style>
	.editor :global(.cm-editor) {
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid #1c2128;
	}
	.editor :global(.cm-editor.cm-focused) {
		outline: 2px solid var(--accent);
		outline-offset: 0;
	}
</style>
