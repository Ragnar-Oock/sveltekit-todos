<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Todo } from "$lib/db/json-db";

	const { todo = $bindable() }: {todo: Todo} = $props();

	let isDone = $derived(todo.doneAt !== null);
	$effect(() => console.log(todo))

	let stupidForm: HTMLFormElement;
	const onChange = () => {
		stupidForm?.requestSubmit();
	}

</script>

<li>
	<form method="post" action="/?/toggle" bind:this={stupidForm} use:enhance>
		<input type="hidden" name="id" value="{todo.id}">
		<input
				type="checkbox"
				id="{todo.id}"
				bind:checked={isDone}
				onchange={onChange}
		>
		<label for="{todo.id}">{todo.label}{#if todo.doneAt !== null} ({todo.doneAt.valueOf()}){/if}</label>
	</form>
</li>