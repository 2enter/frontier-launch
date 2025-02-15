import type { Cargo, CargoRequest } from '@/types/model';

import axios from 'axios';
import { dev } from '$app/environment';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { Api } from '@2enter/web-kit/runtime';
import { objToFD } from '@2enter/web-kit/calc';

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

async function postCargo(input: CargoRequest) {
	const fd = objToFD({ ...input });
	return api.fetch<Cargo>({ url: '/api/cargo', method: 'post', data: fd });
}

async function getCargoes() {
	return api.fetch<Cargo[]>({ url: '/api/cargo' });
}

async function getTodayCargoes() {
	return api.fetch<Cargo[]>({ url: '/api/cargo/today' });
}

export { API_BASE_URL, apiUrl, getCargoes, getNews, getSysTemp, getTodayCargoes, postCargo };
