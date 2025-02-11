<script lang="ts">
	import { getInputState, getSysState } from '@/states';
	import { ImgBtn } from '@2enter/web-kit/components';
	import axios from 'axios';
	import type { Cargo } from '@/types/model';

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

	const fetcher = axios.create({
		baseURL: 'http://localhost:3080/'
		// headers: { 'access-control-allow-origin': '*' }
	});

	async function send() {
		if (!inputState.submittable) return;

		sysState.processing = true;
		const metadata = inputState.requestMetadata;
		let temp = await fetcher.get('/api/sys-temp').then((res) => res.data);
		console.log(temp);
		const cargo = await fetcher
			.post<Cargo>('/api/cargo/metadata', metadata)
			.then((res) => res.data)
			.catch((err) => {
				sysState.popError(err);
				sysState.processing = false;
				return null;
			});
		if (!cargo) return;

		const { id } = cargo;

		const fd = new FormData();
		fd.append('id', id);

		const paint = await inputState.getPaint();
		if (!paint) return;
		fd.append('file', paint);

		const result = fetcher.postForm('/api/cargo/image', fd, {
			onUploadProgress: (event) => {
				console.log(event);
			}
		});

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
