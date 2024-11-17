const LAUNCH_TIMEOUT = 5 * 60 * 1000;
const SHIPPING_SECOND = 15;
const RESULT_SIZE = 1000;
const COLORS = [
	{ name: 'red', value: '#EB0018' },
	{ name: 'orange', value: '#ED6A19' },
	{ name: 'yellow', value: '#DFDD2C' },
	{ name: 'lime', value: '#84D044' },
	{ name: 'green', value: '#2E8250' },
	{ name: 'blue', value: '#3E67D6' },
	{ name: 'cyan', value: '#53C6D9' },
	{ name: 'purple', value: '#855AA8' },
	{ name: 'pink', value: '#EB7DD1' },
	{ name: 'peach', value: '#EDBEAA' },
	{ name: 'brown', value: '#723D1E' },
	{ name: 'black', value: '#262626' }
] as const;

type ColorName = (typeof COLORS)[number]['name'];

export { COLORS, LAUNCH_TIMEOUT, SHIPPING_SECOND, RESULT_SIZE };

export type { ColorName };
