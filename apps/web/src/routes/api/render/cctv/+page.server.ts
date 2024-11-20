import { pb } from '@/server';
import { shuffle } from '@repo/lib/utils/calc';

export const load = async () => {
	const { items } = await pb.collection('cargoes').getList(1, 100);
	const cargoes = shuffle(items)
		.slice(0, 12)
		.map((c) => c.id);
	return { cargoes };
};
