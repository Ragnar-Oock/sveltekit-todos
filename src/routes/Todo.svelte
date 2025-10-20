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

	let isChecked = $derived(todo.doneOn !== null);
	const toggle = () => todo.doneOn = isChecked ? new Date() : null;
</script>

<li>
	<input
		type="checkbox"
		name="{todo.id}"
		id="{todo.id}"
		bind:checked={isChecked}
		onchange={toggle}
	>
	<label for="{todo.id}">{todo.label}</label>
</li>