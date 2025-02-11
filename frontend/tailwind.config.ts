import type { Config } from 'tailwindcss';
import {join} from 'path'

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/@2enter/web-kit/dist/components/*.svelte'],

	theme: {
		extend: {}
	},

	plugins: []
} satisfies Config;
