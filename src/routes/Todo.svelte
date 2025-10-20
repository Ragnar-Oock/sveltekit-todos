<script lang="ts">
	export interface Todo {
		readonly id: string;
		label: string;
		doneOn: Date | null;
	}
	export interface Done extends Todo {
		doneOn: Date;
	}

	const { todo = $bindable() }: {todo: Todo} = $props();

	const isDone = () => todo.doneOn !== null;
	const toggle = (isDoneNow: boolean) => todo.doneOn = isDoneNow ? new Date() : null;
</script>

<li>
	<input
		type="checkbox"
		name="{todo.id}"
		id="{todo.id}"
		bind:checked={isDone, toggle}
	>
	<label for="{todo.id}">{todo.label}</label>
</li>