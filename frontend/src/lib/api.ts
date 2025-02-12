import { dev } from '$app/environment';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import axios, { type AxiosRequestConfig } from 'axios';
import type { ApiResponse, Cargo, CargoInput } from '@/types/model';

const API_BASE_URL = dev ? PUBLIC_API_BASE_URL : '';

function apiUrl(path: string) {
	return `${API_BASE_URL}/api${path}`;
}

const fetcher = axios.create({
	baseURL: API_BASE_URL
});

async function lazyFetch<T>(config: AxiosRequestConfig) {
	return await fetcher<ApiResponse<T>>(config).then((res) => res.data);
}

async function getNews() {
	return lazyFetch<string[]>({ url: '/api/news' });
}

async function getSysTemp() {
	return lazyFetch<number>({ url: '/api/sys-temp' });
}

async function sendCargoMetadata(input: CargoInput) {
	return lazyFetch<Cargo>({ url: '/api/cargo/metadata', method: 'post', data: input });
}

async function sendCargoImage(input: FormData) {
	return lazyFetch<string>({ url: '/api/cargo/image', method: 'post', data: input });
}

async function getCargoes() {
	return await lazyFetch<string[]>({ url: '/api/cargo/metadata' });
}

export { API_BASE_URL, apiUrl, getCargoes, getNews, getSysTemp, sendCargoMetadata, sendCargoImage };
