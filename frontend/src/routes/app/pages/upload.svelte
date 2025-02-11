<script lang="ts">
	import { getInputState, getSysState } from '@/states';
	import { ImgBtn } from '@2enter/web-kit/components';
	import axios from 'axios';
	import type { ApiResponse, Cargo } from '@/types/model';
	import { API_BASE_URL } from '@/api';

	const [inputState, sysState] = [getInputState(), getSysState()];

	const lightBeam = (node: HTMLImageElement) => {
		let num = 2;
		const interval = setInterval(() => {
			num += num;
			node.style.marginBottom = `${num}px`;
			if (num > window.innerHeight * 1.5) {
				sysState.navigate();
			}
		}, 100);

		return {
			destroy() {
				clearInterval(interval);
			}
		};
	};

	const api = axios.create({
		baseURL: API_BASE_URL
		// headers: { 'access-control-allow-origin': '*' }
	});

	function failure(err?: any) {
		console.error(err);
		sysState.popError('上傳失敗');
		sysState.processing = false;
	}

	async function send() {
		if (!inputState.submittable) return;
		sysState.processing = true;

		// extract metadata from `inputState`
		const metadata = inputState.requestMetadata;

		// upload metadata
		const { data: cargo } = await api
			.post<ApiResponse<Cargo>>('/api/cargo/metadata', metadata)
			.then((res) => res.data);

		if (!cargo) {
			failure();
			return;
		}

		// make form data to submit
		const { id } = cargo;
		const paint = await inputState.getPaint();
		if (!paint) return;

		const fd = new FormData();
		fd.append('id', id);
		fd.append('file', paint);

		// upload image
		const { data: result } = await api
			.postForm<ApiResponse<string>>('/api/cargo/image', fd)
			.then((res) => res.data);

		if (!result) {
			failure();
			return;
		}

		inputState.result = cargo;
		sysState.processing = false;
	}
</script>

{#if !inputState.result}
	<img src={inputState.resultImgUrl} alt="" class="pointer-events-none fixed h-auto w-full" />
	{#if !sysState.processing}
		<ImgBtn src="/ui/buttons/upload.png" class="z-[2000]" onclick={send} />
	{/if}
{:else}
	<img use:lightBeam class="h-[50vh] w-screen" src="/ui/animations/light_beam.webp" alt="" />
{/if}
