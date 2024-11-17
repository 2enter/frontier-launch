<script lang="ts">
	import P5 from 'p5';
	import { onMount } from 'svelte';
	import { type ColorName, COLORS } from '@/config';
	import { dexie } from '@/dexie';
	import { NavBtn } from '@/components';
	import { inputState } from '@/states';

	const TOOLS = ['pen', 'brush', 'eraser'] as const;
	const MAX_VERSION = 20;

	type Tool = (typeof TOOLS)[number];

	let p5 = $state<P5>();
	let selectedTool = $state<Tool>('brush');
	let color = $state<ColorName>('black');
	let weight = $state(20);
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
						); // ADD
						p.line(
							smallX - DIFF * p.random(0.1, 2),
							smallY - DIFF * p.random(0.1, 2),
							oldX - DIFF * p.random(0.1, 2),
							oldY - DIFF * p.random(0.1, 2)
						); // ADD
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

		return () => {
			if (p5) p5.remove();
			for (let i = 0; i < 1000; ++i) {
				if (i !== version) dexie.versions.delete(i);
			}
		};
	});
</script>

<canvas bind:this={canvas} class="bg-blend-difference"></canvas>

<div class="center-content fixed bottom-3 gap-3">
	{version}/{latestVersion}
	<div class="flex flex-row gap-3">
		{#each TOOLS as tool}
			<input id={tool} type="radio" value={tool} hidden bind:group={selectedTool} />
			<label for={tool} class="btn rounded-xl border-solid border-white bg-black text-white" class:bg-white={tool !== selectedTool}>
				{tool}
			</label>
		{/each}
	</div>
	<button
		class="btn btn-primary"
		class:opacity-50={version < latestVersion - MAX_VERSION || version === 0}
		onclick={() => modifyVersion(-1)}
		ontouchstart={() => (drawing = false)}
	>
		undo
	</button>
	<button
		class="btn btn-primary"
		class:opacity-50={version === latestVersion}
		onclick={() => modifyVersion(1)}
		ontouchstart={() => (drawing = false)}
	>
		redo
	</button>
	{#if version !== 0}
		<NavBtn action={1} />
	{/if}
</div>

<div class="fixed left-1 z-[1000] flex flex-col gap-3">
	<div class="flex flex-col gap-1">
		{#each COLORS as { name, value }}
			<input type="radio" bind:group={color} value={name} id="color-{name}" hidden />
			<label
				ontouchstart={() => (drawing = false)}
				for="color-{name}"
				class="size-12 rounded-full border-2 border-solid border-white"
				class:border-opacity-0={name !== color}
				style:background-color={value}
			></label>
		{/each}
	</div>
</div>

<div
	class="full-screen center-content pointer-events-none bg-contain bg-center bg-no-repeat"
	style:background-image="url(/cargoes/{inputState.cargoType}_canva.png)"
></div>
