<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import type { Done, Todo } from "./Todo.svelte";
	import TodoItem from './Todo.svelte';
	import { on } from "svelte/events";


	const todo = (label: string) => ({
		id: crypto.randomUUID(),
		label,
		doneOn: null,
	})

	const todos = $state<Todo[]>([
		todo('groceries'),
		todo('sport'),
		todo('cooking')
	]);

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
			.filter((todo): todo is Done => todo.doneOn !== null)
			.sort((before, after) => before.doneOn.valueOf() - after.doneOn.valueOf())
	)
	const pendingTodos = $derived.by(() => todos.filter(({doneOn}) => doneOn === null));
</script>

<form {@attach addTodo}>

	<label for="newTodo">add todo</label>
	<input type="text" name="newTodo" id="newTodo" bind:value={newTodo} bind:this={newTodoInput}>

	<input type="submit" value="addTodo">
</form>

<output><pre>{JSON.stringify(todos, null, 2)}</pre></output>

<h2>Done :</h2>
{#each doneTodos as todo,index (todo.id)}
	<ul>
		<TodoItem todo={doneTodos[index]}></TodoItem>
	</ul>
{/each}

<h2>To Do :</h2>
{#each pendingTodos as todo,index (todo.id)}
	<ul>
		<TodoItem todo={pendingTodos[index]}></TodoItem>
	</ul>
{/each}

