<script>
	import EventEditor from '$lib/components/EventEditor.svelte';
	let { form } = $props();
</script>

<svelte:head><title>Create event — Tix Host Dashboard</title></svelte:head>
<EventEditor {form} />
