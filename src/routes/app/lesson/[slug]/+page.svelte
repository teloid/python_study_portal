<script>
	import LessonView from '$lib/components/LessonView.svelte';

	let { data } = $props();
</script>

<!-- Ключ по slug: при переходе на другой урок компонент перемонтируется,
     и весь прогресс/состояние корректно сбрасываются под новый урок. -->
{#key data.lesson.slug}
	<LessonView lesson={data.lesson} progress={data.progress} maxScore={data.maxScore} />
{/key}
