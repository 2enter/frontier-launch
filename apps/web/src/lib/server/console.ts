import { getRecordsByFilter } from '@repo/lib/pb';
import { Timer } from '@repo/lib/utils/runtime';

import { LAUNCH_TIMEOUT, SHIPPING_SECOND } from '@/config';
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
				},
				{
					// ship unshipped cargoes
					check: () => this.timer.parsedTime.second % 5 === 0,
					action: async () => {
						const unshipped = await getRecordsByFilter({
							pb,
							collection: 'cargoes',
							filter: `status="shipping"&&created<"${new Date(Date.now() - SHIPPING_SECOND * 1000).toISOString().replace('T', ' ')}"`
						});
						if (!unshipped) return;
						for (const { id } of unshipped) {
							await pb.collection('cargoes').update(id, { status: 'shipped' });
						}
					}
				}
			]
		});
	}

	launch = async () => {
		const shipped = await getRecordsByFilter({ pb, collection: 'cargoes', filter: `status="shipped"` });
		const cargo_amount = shipped ? shipped.length : 0;

		ws.broadcast({ data: { type: 'launch', cargo_amount } });

		if (shipped) {
			for (const { id } of shipped) {
				await pb.collection('cargoes').update(id, { status: 'launched' });
			}
		}

		console.log('launched!');
		this.timer.reset();
	};

	start = async () => {
		if (this.started) return;
		this.started = true;
	};
}

const serverConsole = new ServerConsole();

export { serverConsole };
