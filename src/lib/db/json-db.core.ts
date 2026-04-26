import { type DB, tables, type UUID } from "$lib/db/json-db";
import fs from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from 'url';


const isUUID = (id: string): id is UUID => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)

const toTablePath = (table: string): string => {
	if (!(tables.includes(table as keyof DB))) {
		throw new Error(`Tried to access non existing table : "${table}"`);
	}
	return resolve(`${dirname(fileURLToPath(import.meta.url))}/db-store/${ table }`);
}

const toEntityPath = (table: string, id: UUID): string => {

	if (!isUUID(id)) {
		throw new Error(`Tried to access an entity with a non UUID id : "${id}"`);
	}
	return `${toTablePath(table)}/${ id }.json`;
}

type keyofTable<tableName extends keyof DB> = (keyof DB[tableName] & string & UUID);

export async function readEntity<tableName extends keyof DB, rowId extends keyofTable<tableName>>(table: tableName, id: rowId): Promise<DB[tableName][rowId] | null> {
	return JSON.parse(await fs.readFile(toEntityPath(table, id), { encoding: 'utf8' })) ?? null;
}

export async function writeEntity<tableName extends keyof DB, rowId extends keyofTable<tableName>>(table: tableName, id: rowId, value: DB[tableName][rowId]): Promise<DB[tableName][rowId]> {
	await fs.writeFile(toEntityPath(table, id), JSON.stringify(value));
	return value;
}

/**
 * Get an entity from storage, run the updater function on it and save the return of it (if lacking on the potentially
 * modified original object) back in the storage
 *
 * @param table the type of entity to update
 * @param id the entity's unique id
 * @param updater an updater function taking the existing entity and returning an entity of the same kind or nothing
 */
export async function updateEntity<tableName extends keyof DB, rowId extends keyofTable<tableName>>(table: tableName, id: rowId, updater: (entity: DB[tableName][rowId]) => (DB[tableName][rowId] | void)): Promise<DB[tableName][rowId]> {
	const entity = await readEntity(table, id);
	if (entity === null) {
		throw new Error(`Tried to update non existing ${table} entity with id ${id}.`);
	}
	return await writeEntity(table, id, updater(entity) ?? entity);
}

export async function deleteEntity<tableName extends keyof DB, rowId extends keyofTable<tableName>>(table: tableName, id: rowId): Promise<void> {
	await fs.rm(toEntityPath(table, id));
}

export async function listEntitiesIds<tableName extends keyof DB>(table: tableName): Promise<keyofTable<tableName>[]> {
	return (await fs.readdir(toTablePath(table), { withFileTypes: true }))
		.filter(dirent => dirent.isFile())
		.map(({name}) => name.replace(/\.\w+$/, ''))
		.filter(id => id !== undefined && id !== '' && isUUID(id)) as keyofTable<tableName>[];
}

export async function listEntities<tableName extends keyof DB>(table: tableName): Promise<DB[tableName]> {
	return Object.fromEntries(
		(await Promise.all(
				(await listEntitiesIds(table))
					.map(async id => ([id, await readEntity(table, id)] as const))
			))
			.filter(entity => entity[1] !== null)
	) as DB[tableName];
}
