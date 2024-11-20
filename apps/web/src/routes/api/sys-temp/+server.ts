import sysInfo from 'systeminformation';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const memData = await sysInfo.mem();
	const load = await sysInfo.currentLoad().then((data) => data.currentLoad);
	const { total, active } = memData;

	const temperature = (active * load) / (total * 10);
	return json(+temperature.toFixed(1));
};
