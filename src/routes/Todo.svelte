<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Todo } from "$lib/db/json-db";

	const { todo = $bindable() }: {todo: Todo} = $props();

	let isDone = $derived(todo.doneAt !== null);
	$effect(() => console.log(todo))

	let stupidForm: HTMLFormElement;
	let timer: number | NodeJS.Timeout | null;
	const delay = (fn: () => void, interval = 500) => () => {
		if (timer !== null) {
			return;
		}
		timer = globalThis.setTimeout(() => {
			fn();
			timer = null;
		}, interval);
	}
	const queueChange = delay(() => {
		console.log('submiting');
		stupidForm?.requestSubmit();
	})

	let updating = $state(false);
	$effect(() => {
		if (updating) {
			setTimeout(() => {
				updating = false
			}, 1_000)
		}
	})

	const doneLabel = $derived(todo.doneAt ? 'undo' : 'mark as done');

</script>

<li>
	{#if (updating)}<span>🔄️</span>{/if}
	<form
			method="post"
			action="/?/update"
			bind:this={stupidForm}
			use:enhance
			onchange={queueChange}
			onfocusout={queueChange}
	>
		<input type="hidden" name="id" value="{todo.id}">
		<input
				type="checkbox"
				id="{todo.id}-check"
				bind:checked={isDone}
				title={doneLabel}
				aria-label={doneLabel}
				name="isDone"
		>
		<input
				type="text"
				name="label"
				id="{todo.id}-label"
				bind:value={todo.label}
				aria-label="label"
		>
	</form>
</li>