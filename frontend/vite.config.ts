import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const { BACKEND_PORT, BACKEND_HOST } = process.env;
const API_BASE_URL = `http://${BACKEND_HOST ?? 'localhost'}:${BACKEND_PORT ?? 3000}`;

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: API_BASE_URL,
				changeOrigin: true
			}
		},
		port: 5173
	}
});
