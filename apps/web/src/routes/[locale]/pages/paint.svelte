<script lang="ts">
	import P5 from 'p5';
	import { onMount } from 'svelte';
	import { slide, fly } from 'svelte/transition';

	import { Timer } from '@repo/lib/utils/runtime';
	import { randomItem } from '@repo/lib/utils/calc';

	import { dexie } from '@/dexie';
	import { type ColorName, COLORS } from '@/config';
	import { inputState, sysState } from '@/states';
	import { ImgBtn } from '@/components';

	const TOOLS = ['pen', 'brush', 'eraser'] as const;
	const WEIGHT_VALUES = [5, 15, 25, 35, 45, 55, 65, 75] as const;
	const MAX_VERSION = 20;

	let timer: Timer;
	type Tool = (typeof TOOLS)[number];

	let p5 = $state<P5>();
	let selectedTool = $state<Tool>('pen');
	let selectedWeight = $state(Math.floor(Math.random() * WEIGHT_VALUES.length));
	let color = $state<ColorName>(randomItem(COLORS.map((c) => c.name))[0]);
	let weight = $derived(WEIGHT_VALUES[selectedWeight]);
	let trace = $state<[number, number][]>([]);
	let canvas = $state<HTMLCanvasElement>();
	let version = $state(0);
	let latestVersion = $state(0);
	let drawing = true;

	const colorValue = $derived(COLORS.find((c) => c.name === color)?.value ?? '#262626');

	function takeScreenshot() {
		if (!canvas) return;
		return canvas.toDataURL('image/png');
	}

	function eraseAll() {
		if (!p5) return;
		p5.erase();
		p5.rect(0, 0, p5.windowWidth, p5.windowHeight);
		p5.noErase();
	}

	async function modifyVersion(action: -1 | 1) {
		if (!p5) return;
		version += action;
		if (version === 0) {
			eraseAll();
			return;
		}
		const dataUrl = await dexie.versions.get(version).then((data) => data?.value ?? null);
		if (!dataUrl) {
			console.log('image not found');
			version -= action;
			return;
		}
		p5.loadImage(dataUrl, (img) => {
			if (!p5) return;
			console.log(img);
			eraseAll();
			p5.image(img, 0, 0, p5.windowWidth, p5.windowHeight);
		});
	}

	const sketch = (p: P5) => {
		const SPRING = 0.8;
		const SPLIT_NUM = 100;
		const DIFF = 2.4;

		let [r, oldR, vx, vy, v] = [0, 0, 0, 0, 0.5];
		let [smallX, smallY] = [0, 0];
		let [oldX, oldY] = [0, 0];

		let friction = 0.45;

		p.setup = () => {
			p.createCanvas(p.windowWidth, p.windowHeight, 'p2d', canvas);
			p.frameRate(30);
		};

		p.draw = () => {
			p.strokeWeight(weight);
			p.stroke(colorValue);
		};

		p.touchMoved = () => {
			if (!drawing) return;

			let { mouseX: x, mouseY: y } = p;
			const last = trace.at(-1);
			trace.push([x, y]);
			if (!last) return;
			switch (selectedTool) {
				case 'pen':
					p.line(...last, x, y);
					break;
				case 'brush':
					if (trace.length === 2) {
						smallX = x;
						smallY = y;
					}
					vx += (x - smallX) * SPRING;
					vy += (y - smallY) * SPRING;
					vx *= friction;
					vy *= friction;

					v += p.sqrt(vx * vx + vy * vy) - v;
					v *= 0.55;

					oldR = r;
					r = weight - v;

					for (let i = 0; i < SPLIT_NUM; i++) {
						oldX = smallX;
						oldY = smallY;
						smallX += vx / SPLIT_NUM;
						smallY += vy / SPLIT_NUM;
						oldR += (r - oldR) / SPLIT_NUM;
						if (oldR < 1) oldR = 1;
						p.strokeWeight(oldR + DIFF);
						p.line(smallX + p.random(0, 2), smallY + p.random(0, 2), oldX + p.random(0, 2), oldY + p.random(0, 2));
						p.strokeWeight(oldR); // ADD
						p.line(
							smallX + DIFF * p.random(0.1, 2),
							smallY + DIFF * p.random(0.1, 2),
							oldX + DIFF * p.random(0.1, 2),
							oldY + DIFF * p.random(0.1, 2)
						);
						p.line(
							smallX - DIFF * p.random(0.1, 2),
							smallY - DIFF * p.random(0.1, 2),
							oldX - DIFF * p.random(0.1, 2),
							oldY - DIFF * p.random(0.1, 2)
						);
					}
					break;
				// const vector = p.createVector(x - last[0], y - last[1]);
				// const verticalVector = vector.rotate(p.HALF_PI).normalize();
				// p.beginShape();
				// p.fill(colorValue);
				// p.noStroke();
				// p.vertex(last[0] - verticalVector.x * weight, last[1] - verticalVector.y * weight);
				// p.vertex(last[0] + verticalVector.x * weight, last[1] + verticalVector.y * weight);
				// p.vertex(x + verticalVector.x * weight, y + verticalVector.y * weight);
				// p.vertex(x - verticalVector.x * weight, y - verticalVector.y * weight);
				// p.endShape();
				case 'eraser':
					p.erase();
					p.line(...last, x, y);
					p.noErase();
					break;
			}
		};

		p.touchStarted = p.touchMoved;

		p.touchEnded = async () => {
			if (!drawing) {
				drawing = true;
				return;
			}
			if (trace.length < 2) return;
			if (latestVersion >= MAX_VERSION) {
				dexie.versions.delete(latestVersion - MAX_VERSION);
			}
			if (latestVersion > version) {
				for (let i = version + 1; i <= latestVersion; i++) {
					dexie.versions.delete(i);
				}
				latestVersion = version;
			}
			trace = [];
			version++;
			latestVersion = Math.max(version, latestVersion);
			const screenshot = takeScreenshot();
			if (!screenshot) return;
			const old = await dexie.versions.get(version);
			if (old && screenshot) dexie.versions.update(version, { value: screenshot });
			else await dexie.versions.add({ id: version, value: screenshot });
		};
	};

	onMount(() => {
		dexie.versions.clear();
		p5 = new P5(sketch);

		timer = new Timer({});

		return () => {
			if (p5) p5.remove();
			inputState.drawDuration = Math.floor(timer.duration / 1000);
			for (let i = 0; i < 1000; ++i) {
				if (i !== version) dexie.versions.delete(i);
			}
		};
	});
</script>

<canvas bind:this={canvas}></canvas>

<div
	in:slide={{ axis: 'y' }}
	class="fixed bottom-0 flex h-[12vh] w-screen items-center justify-evenly gap-3 bg-cover bg-center bg-no-repeat px-10 py-5"
	style:background-image="url(/ui/paint/tools.png)"
>
	{#each TOOLS as tool}
		<input id={tool} type="radio" value={tool} hidden bind:group={selectedTool} />
		<label
			for={tool}
			class="bg-contain bg-center bg-no-repeat p-6"
			style:background-image="url({tool === selectedTool ? '/ui/paint/frame.png' : ''})"
			ontouchstart={() => (drawing = false)}
		>
			<img src="/ui/paint/{tool}.png" class="" alt="" />
		</label>
	{/each}
	<ImgBtn src="/ui/paint/undo.png" class="" onclick={() => modifyVersion(-1)} ontouchstart={() => (drawing = false)}></ImgBtn>
	<ImgBtn src="/ui/paint/redo.png" class="" onclick={() => modifyVersion(1)} ontouchstart={() => (drawing = false)}></ImgBtn>
	<ImgBtn src="/ui/paint/help.png" class="" onclick={() => {}} ontouchstart={() => (drawing = false)}></ImgBtn>
</div>

<div class="fixed right-0 top-0">
	{#if version !== 0}
		<ImgBtn src="/ui/buttons/done.png" class="w-[30vw]" ontouchstart={() => (drawing = false)} onclick={() => sysState.navigate(1)} />
	{/if}
</div>

<div in:fly={{ x: -100 }} class="fixed left-1 z-[1000] flex flex-col gap-3">
	<div class="flex flex-col items-center pl-2">
		<ImgBtn
			src="/ui/paint/frame.png"
			ontouchstart={() => (drawing = false)}
			onclick={() => {
				selectedWeight = (selectedWeight + 1) % WEIGHT_VALUES.length;
			}}
			class="w-16"
		/>
		{weight}
		{#each COLORS as { name }}
			<input type="radio" bind:group={color} value={name} id="color-{name}" hidden />
			<label
				ontouchstart={() => (drawing = false)}
				for="color-{name}"
				class="transition-transform duration-100"
				style:transform="scale({name === color ? 1.3 : 1})"
			>
				<img class="size-18" src="/ui/paint/colors/{name}.png" alt="" />
			</label>
		{/each}
	</div>
</div>

<div
	class="full-screen center-content pointer-events-none bg-contain bg-center bg-no-repeat"
	style:background-image="url(/cargoes/{inputState.cargoType}_canva.png)"
></div>
