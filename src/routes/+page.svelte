<script lang="ts">
	import type { Done, TodoId } from "$lib/db/json-db";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { Attachment } from "svelte/attachments";
	import TodoItem from './Todo.svelte';
	import { on } from "svelte/events";
	import { enhance } from '$app/forms';

	let { data } = $props();

	const todo = (label: string) => ({
		id: crypto.randomUUID() as TodoId,
		label,
		doneAt: null,
		createdAt: Date.now()
	})

	const todos = $derived(data.todos);

	let newTodo = $state('');
	let newTodoInput: HTMLInputElement;


	const addTodo: Attachment = form => {
		on(form, 'submit', event => {
			if (newTodo === '') {return;}
			todos.push(todo(newTodo));
			event.preventDefault();
			newTodoInput.focus();
			newTodo = '';
		})
	}

	const doneTodos = $derived.by(() =>
		todos
			.filter((todo): todo is Done => todo.doneAt !== null)
			.sort((before, after) => before.doneAt.valueOf() - after.doneAt.valueOf())
	)
	const pendingTodos = $derived.by(() => todos.filter(({doneAt}) => doneAt === null));

	const onSubmit: SubmitFunction = () => ({update}) => {
		update();
		newTodoInput.focus();
		console.log(newTodoInput)
	};
</script>

<form method="post" action="?/create" use:enhance={onSubmit}>
	<label for="newTodo">add todo</label>
	<input type="text" name="label" id="newTodo" bind:value={newTodo} bind:this={newTodoInput}>

	<input type="submit" value="addTodo">
</form>

<h2>Done :</h2>
{#each doneTodos as todo,index}
	<ul>
		<TodoItem bind:todo={() => todo, update => doneTodos[index] = update}></TodoItem>
	</ul>
{/each}

<h2>To Do :</h2>
{#each pendingTodos as todo,index (todo.id)}
	<ul>
		<TodoItem bind:todo={() => todo, update => pendingTodos[index] = update}></TodoItem>
	</ul>
{/each}

