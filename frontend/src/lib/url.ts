import { dev } from '$app/environment';
import path from 'path';

const API_BASE_URL = dev ? 'http://localhost:3080' : '';

function storageUrl(filepath: string) {
	return `${API_BASE_URL}/api/storage${filepath}`;
}

function apiUrl(path: string) {
	return `${API_BASE_URL}/api${path}`;
}

export { storageUrl, apiUrl };
