import { createTodo, getAllTodos, type Todo, type TodoId, toggleTodo } from "$lib/db/json-db";
import type { Actions } from './$types';

type Data = {
	todos: Todo[];
}

export async function load(): Promise<Data> {
	return {
		todos: await getAllTodos(),
	};
}

export const actions = {
	create: async ({request}) => {
		const data = await request.formData();
		const label = data.get('label');
		if (label === null) {
			throw new TypeError('Expected label to be string, got null instead.');
		}
		if (typeof label !== "string") {
			throw new TypeError('Expected label to be string, got a File instead.');
		}
		console.log('creating todo');
		console.dir(await createTodo(label))
	},
	toggle: async ({request}) => {
		const data = await request.formData();
		const todoId = data.get('id');
		if (todoId === null) {
			throw new TypeError('Expected id to be string, got null instead.');
		}
		if (typeof todoId !== "string") {
			throw new TypeError('Expected id to be string, got a File instead.');
		}
		console.log(`toggling todo id ${todoId}`);
		console.dir(await toggleTodo(todoId as TodoId))
	}
} satisfies Actions;