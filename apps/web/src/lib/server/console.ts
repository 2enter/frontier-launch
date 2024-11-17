import { getRecordsByFilter } from '@repo/lib/pb';
import { Timer } from '@repo/lib/utils/runtime';
import { LAUNCH_TIMEOUT } from '@/config';

import { pb, ws } from '@/server';
import { getRaining } from '@/server/weather';

class ServerConsole {
	started = false;
	timer: Timer;

	constructor() {
		this.timer = new Timer({
			timeout: 1000,
			triggers: [
				{
					// launch rocket
					check: () => this.timer.duration > LAUNCH_TIMEOUT,
					action: this.launch
				},
				{
					// send weather data
					check: () => this.timer.parsedTime.minute === 0 && this.timer.parsedTime.second === 0,
					action: async () => {
						ws.broadcast({ data: { type: 'weather', raining: await getRaining() } });
					}
				}
			]
		});
	}

	getStoredSupplies = async () => {
		return await getRecordsByFilter({ pb, collection: 'supplies', filter: 'status="shipped"' });
	};

	launch = async () => {
		const supplies = await this.getStoredSupplies();
		console.log(supplies);
		const supply_amount = supplies ? supplies.length : 0;

		ws.broadcast({ data: { type: 'launch', supply_amount } });

		if (supplies) {
			for (const { id } of supplies) {
				await pb.collection('supplies').update(id, { status: 'launched' });
			}
		}

		console.log('launched!');
		this.timer.reset();
	};

	start = async () => {
		if (this.started) return;
		this.started = true;
	};

	getStatus = async () => {
		return {
			duration: this.timer.duration,
			supplies: await this.getStoredSupplies()
		};
	};
}

const serverConsole = new ServerConsole();

export { serverConsole };
