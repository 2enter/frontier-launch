import type { Cargo, CargoInput } from '@/types/model';

import axios from 'axios';
import { dev } from '$app/environment';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { Api } from '@2enter/web-kit/runtime';

const API_BASE_URL = dev ? PUBLIC_API_BASE_URL : '';

function apiUrl(path: string) {
	return `${API_BASE_URL}/api${path}`;
}

const api = new Api(axios.create({ baseURL: API_BASE_URL }));

async function getNews() {
	return api.fetch<string[]>({ url: '/api/news' });
}

async function getSysTemp() {
	return api.fetch<number>({ url: '/api/sys-temp' });
}

async function postCargoMetadata(input: CargoInput) {
	return api.fetch<Cargo>({ url: '/api/cargo/metadata', method: 'post', data: input });
}

async function postCargoImage(input: FormData) {
	return api.fetch<string>({ url: '/api/cargo/image', method: 'post', data: input });
}

async function getCargoes() {
	return api.fetch<string[]>({ url: '/api/cargo/metadata' });
}

export { API_BASE_URL, apiUrl, getCargoes, getNews, getSysTemp, postCargoMetadata, postCargoImage };
