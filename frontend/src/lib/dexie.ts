import type { EntityTable } from 'dexie';
import { Dexie } from 'dexie';

interface Version {
	id: number;
	value: string;
}

const dexie = new Dexie('DB') as Dexie & {
	versions: EntityTable<Version, 'id'>;
};

dexie.version(1).stores({
	versions: '++id, value'
});

export { dexie };
export type { Version };
