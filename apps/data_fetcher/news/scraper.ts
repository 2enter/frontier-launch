import type { RawNews } from './config';

import chalk from 'chalk';
import firefox from 'selenium-webdriver/firefox';
import { Builder, By } from 'selenium-webdriver';

import { sleep } from '@repo/lib/utils/runtime';
import { URL, ELEMENT_IDENTIFIERS } from './config';

class Scraper {
	readonly driver = new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().addArguments('--headless')).build();

	async getNews() {
		await this.driver.get(URL);

		console.log(chalk.yellow('driver initialized'));

		await sleep(Math.random() * 1000 + 500);
		await this.driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
		await sleep(Math.random() * 1000 + 500);

		const sections = await this.driver.findElements(By.css(`${ELEMENT_IDENTIFIERS.section.attr} .${ELEMENT_IDENTIFIERS.section.class} `));
		const result: RawNews[] = [];
		for (const section of sections) {
			let titleDom = await section.findElement(By.css(`.${ELEMENT_IDENTIFIERS.title.class}`)).catch(() => null);
			if (!titleDom) {
				titleDom = await section.findElement(By.css(`.JtKRv`)).catch(() => null);
				if (!titleDom) continue;
			}
			const title = await titleDom.getText();

			console.log(chalk.cyan(`Fetched news:\t\t${title}`));

			result.push({
				title
			});
			// await sleep(Math.random() * 800 + 500);
		}

		await this.driver.close();

		console.log(chalk.green(`Finished fetching news, amount: ${result.length}`));
		return result;
	}
}

export { Scraper };
