import { serverConsole } from '@/server';
import validator from 'validator';

export const load = async ({ params }) => {
	const { num } = params;
	if (!validator.isInt(num)) return { title: '' };

	return { title: serverConsole.news[+num] ?? '' };
};
