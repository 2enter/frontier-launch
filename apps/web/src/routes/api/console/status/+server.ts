import { json } from '@sveltejs/kit';
import { serverConsole } from '@/server';

export const GET = async () => {
	const status = await serverConsole.getStatus();
	return json(status);
};
