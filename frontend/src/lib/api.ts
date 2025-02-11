import { dev } from '$app/environment';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const API_BASE_URL = dev ? PUBLIC_API_BASE_URL : '';

function storageUrl(filepath: string) {
	return `${API_BASE_URL}/api/storage${filepath}`;
}

function apiUrl(path: string) {
	return `${API_BASE_URL}/api${path}`;
}

export { storageUrl, apiUrl, API_BASE_URL };
