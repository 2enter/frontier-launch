import { getRecordsByFilter } from '@repo/lib/pb';

import { pb, ws } from '@/server';
import { Timer } from '@/timer';
import { getRaining } from '@/server/weather';

const LAUNCH_TIMEOUT = 15 * 60 * 1000;

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

	async getStoredSupplies() {
		return await getRecordsByFilter({ pb, collection: 'supplies', filter: 'status="shipped"' });
	}

	async launch() {
		const supplies = await this.getStoredSupplies();
		const supply_amount = supplies?.length ?? 0;

		ws.broadcast({ data: { type: 'launch', supply_amount } });

		if (supplies) {
			for (const { id } of supplies) {
				await pb.collection('supplies').update(id, { status: 'launched' });
			}
		}

		console.log('launched!');
		this.timer.reset();
	}

	async start() {
		if (this.started) return;
		this.started = true;
	}

	async getStatus() {
		return {
			duration: this.timer.duration,
			supplies: await this.getStoredSupplies()
		};
	}
}

const serverConsole = new ServerConsole();

export { serverConsole };
