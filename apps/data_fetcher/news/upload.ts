import { getRecordsByFilter, type NewsRecord } from '@repo/lib/pb';
import { createMultiple } from '@repo/lib/pb';

import { pb } from './pb';
import chalk from 'chalk';
import type { RawNews } from './config';

async function uploadNews(rawNewsList: RawNews[]) {
	console.log(chalk.yellow('ready to upload to database'));

	const toPush: RawNews[] = [];
	for (const rawNews of rawNewsList) {
		const exists = await getRecordsByFilter({ pb, collection: 'news', filter: `title="${rawNews.title}"` });

		if (exists && exists[0]) {
			const exist = exists[0];
			await pb.collection('news').update(exist.id, { hype: exist.hype + 1 });
			continue;
		}
		toPush.push(rawNews);
	}

	const result: NewsRecord[] = toPush.map(({ title }, index) => {
		return {
			hype: 1,
			title
		};
	});

	console.log(chalk.green(`successfully upload ${rawNewsList.length} news, with ${rawNewsList.length - result.length} old news`));

	if (result.length > 0) {
		console.log(chalk.yellow('New news: '));
		for (const [i] of result.entries()) {
			console.log(`${i}: ${rawNewsList[i].title}`);
		}
	}

	return await createMultiple({ pb, records: result, collection: 'news' });
}

export { uploadNews };
