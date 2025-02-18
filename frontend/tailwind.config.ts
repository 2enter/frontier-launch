import type { Config } from 'tailwindcss';
import { mobileLock, utils } from '@2enter/web-kit/tw-plugin';
import daisyui from 'daisyui';
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@2enter/web-kit/dist/components/*.svelte'
	],
	theme: {
		extend: {}
	},
	plugins: [daisyui, utils, mobileLock]
} satisfies Config;
