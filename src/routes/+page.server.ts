import { createTodo, getAllTodos, type Todo, type TodoId, toggleTodo, updateTodo } from "$lib/db/json-db";
import type { Actions } from './$types';

type Data = {
	todos: Todo[];
}

export async function load(): Promise<Data> {
	return {
		todos: await getAllTodos(),
	};
}

function stringParam<output = string>(data: FormData, field: string): output {
	const fieldValue = data.get(field);

	if (fieldValue === null) {
		throw new TypeError(`Expected ${field} to be string, got null instead.`);
	}
	if (typeof fieldValue !== "string") {
		throw new TypeError(`Expected ${field} to be string, got a File instead.`);
	}
	return fieldValue as output;
}

function booleanParam(data: FormData, field: string): boolean {
	return data.get(field) !== null;
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
	},
	update: async ({request}) => {
		const data = await request.formData();
		const id = stringParam<TodoId>(data, 'id');
		const label = stringParam(data, 'label');

		console.log(`updating todo id ${id}`);
		console.dir(await updateTodo({
			id,
			label,
		}))
	}
} satisfies Actions;