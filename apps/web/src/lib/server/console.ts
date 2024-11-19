import { getRecordsByFilter } from '@repo/lib/pb';
import { Timer } from '@repo/lib/utils/runtime';

import moment from 'moment';

import { LAUNCH_TIMEOUT, SHIPPING_SECOND } from '@/config';
import { pb, ws } from '@/server';
import { getRaining } from '@/server/weather';

class ServerConsole {
	started = false;
	timer: Timer;
	news: string[] = [];

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
					check: () => moment(this.timer.now).minute() === 0 && moment(this.timer.now).second() === 0,
					action: async () => {
						ws.broadcast({ data: { type: 'weather', raining: await getRaining() } });
					}
				},
				{
					// ship unshipped cargoes
					check: () => moment(this.timer.now).second() % 5 === 0,
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
				},
				{
					// update news
					check: () => moment(this.timer.now).second() === 0,
					action: async () => {
						const { items: news } = await pb.collection('news').getList(1, 20, { sort: '-created' });
						const sorted = news.sort((a, b) => a.hype - b.hype);
						this.news = sorted.slice(0, 10).map(({ title }) => title);
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
