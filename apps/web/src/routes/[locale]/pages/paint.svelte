<script lang="ts">
	import P5 from 'p5';
	import { onMount } from 'svelte';
	import { type ColorName, COLORS } from '@/config';

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

	const colorValue = $derived(COLORS.find((c) => c.name === color)?.value ?? '#262626');

	function screenshot() {
		if (!canvas) return;
		return canvas.toDataURL('image/png');
	}

	const sketch = (p: P5) => {
		const SPRING = 0.8;
		const SPLIT_NUM = 100;
		const DIFF = 2.4;

		let forcing = false;
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

		function eraseAll() {
			p.erase();
			p.rect(0, 0, p.windowWidth, p.windowHeight);
			p.noErase();
		}

		p.touchMoved = () => {
			let { mouseX: x, mouseY: y } = p;
			const last = trace.at(-1);
			trace.push([x, y]);
			if (!last) return;
			switch (selectedTool) {
				case 'pen':
					p.line(...last, x, y);
					break;
				case 'brush':
					if (!forcing) {
						forcing = true;
						smallX = trace[0][0];
						smallY = trace[0][1];
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
					break;
				case 'eraser':
					p.erase();
					p.line(...last, x, y);
					p.noErase();
					break;
			}
		};
		p.touchStarted = p.touchMoved;

		p.touchEnded = () => {
			trace = [];
			if (!forcing) return;
			vx = vy = 0;
			forcing = false;
		};
	};

	onMount(() => {
		p5 = new P5(sketch);
		return {
			destroy() {
				if (p5) p5.remove();
			}
		};
	});
</script>

<canvas bind:this={canvas}></canvas>

<div class="center-content fixed bottom-0 gap-2">
	<div class="flex flex-row gap-2">
		{#each TOOLS as tool}
			<input id={tool} type="radio" value={tool} hidden bind:group={selectedTool} />
			<label for={tool} class="border-2 border-solid border-white bg-black p-1 text-white" class:border-opacity-0={tool !== selectedTool}>
				{tool}
			</label>
		{/each}
	</div>
	<button class="btn btn-primary">undo</button>
	<button class="btn btn-primary">redo</button>
</div>

<div class="fixed left-1 flex flex-col gap-3">
	<div class="flex flex-col gap-1">
		{#each COLORS as { name, value }}
			<input type="radio" bind:group={color} value={name} id="color-{name}" hidden />
			<label
				for="color-{name}"
				class="size-12 rounded-full border-2 border-solid border-white"
				class:border-opacity-0={name !== color}
				style:background-color={value}
			></label>
		{/each}
	</div>
</div>
