import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@2enter/web-kit/dist/components/*.svelte'
	],

	theme: {
		extend: {}
	},

	plugins: [require('daisyui')]
} satisfies Config;
