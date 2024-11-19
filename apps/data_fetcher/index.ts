import moment from 'moment';
import chalk from 'chalk';
import { Timer } from '@repo/lib/utils/runtime';
import { uploadNews, Scraper } from './news';

const UPDATE_TIME = (Bun.env.UPDATE_TIME ?? '00_00').split('_').map((item) => +item);

const scraper = new Scraper();

const timer = new Timer({
	triggers: [
		{
			check: () => {
				const now = moment(Date.now());
				const currentTime = [now.minute(), now.second()];

				return JSON.stringify(currentTime) === JSON.stringify(UPDATE_TIME);
			},
			action: async () => {
				const news = await scraper.getNews();
				const records = await uploadNews(news);
				console.log(chalk.red('Finished!'));
			}
		}
	]
});
