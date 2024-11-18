import type { NewsRecord } from '@repo/lib/pb';

const URL = 'https://news.google.com/search?q=%E5%A4%AA%E7%A9%BA&hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant';

type RawNews = Omit<NewsRecord, 'hype'>;

const ELEMENT_IDENTIFIERS = {
	section: {
		attr: 'c-wiz',
		class: 'PO9Zff'
	},
	title: {
		attr: 'h4',
		class: 'gPFEn'
	},
	media: {
		logo: {
			attr: 'img',
			class: 'qEdqNd',
			alt_class: 'msvBD'
		},
		name: {
			attr: 'div',
			class: 'vr1PYe'
		}
	},
	time: {
		attr: 'time',
		class: 'hvbAAd'
	},
	article: {
		attr: 'article',
		class: {
			with_img: 'IBr9hb',
			without_img: 'UwIKyb'
		}
	},
	img: {
		attr: 'img',
		class: 'Quavad'
	},
	link: {
		attr: 'a',
		class: 'WwrzSb'
	}
} as const;

export { URL, ELEMENT_IDENTIFIERS };
export type { RawNews };
