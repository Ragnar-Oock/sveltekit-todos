import { listEntities, updateEntity, writeEntity } from "$lib/db/json-db.core";

export type TodoId = UUID & { __brand: 'todo'};

export const todoId = () => crypto.randomUUID() as TodoId;

export type Todo = {
	id: TodoId,
	label: string,
	doneAt: Date | null,
	createdAt: Date,
}
export interface Done extends Todo {
	doneAt: Date;
}
export type DB = {
	todo: Record<TodoId, Todo>
}
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export const tables = ['todo'] as const satisfies (keyof DB)[]

export async function createTodo(label: string, done = false): Promise<Todo> {
	const id = todoId();
	if (label.length < 1) {
		throw new Error('Todo.label should be a non empty string');
	}
	return await writeEntity('todo', id, {
		id,
		label,
		doneAt: done ? new Date() : null,
		createdAt: new Date(),
	});
}


export async function toggleTodo(id: TodoId): Promise<boolean> {
	let wasDown: boolean | undefined = undefined;

	const updated = await updateEntity('todo', id, todo => {
		console.log(todo)
		wasDown = todo.doneAt !== null
		todo.doneAt = wasDown ? null : new Date();
		return todo;
	})
	console.log(updated)

	if (wasDown === undefined) {
		throw new Error('updater is fucked up')
	}

	return !wasDown;
}

export async function getAllTodos(): Promise<Todo[]> {
	return Object
		.values(await listEntities('todo'))
		.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}