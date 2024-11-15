import { json } from '@sveltejs/kit';
import { serverConsole } from '@/server';

export const GET = async () => {
	const { duration } = serverConsole.timer;
	return json(duration);
};
