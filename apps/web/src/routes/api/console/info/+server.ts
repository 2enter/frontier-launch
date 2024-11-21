import { json } from '@sveltejs/kit';
import { serverConsole } from '@/server';

export const GET = async () => {
	const info = await serverConsole.getInfo();
	return json(info);
};
