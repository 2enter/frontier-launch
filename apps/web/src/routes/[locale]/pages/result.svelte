<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	import { sysState, inputState } from '@/states';
	import { onDestroy, onMount } from 'svelte';

	import { ImgBtn } from '@/components';

	const loader = new GLTFLoader();
	const textureLoader = new THREE.TextureLoader();
	const scene = new THREE.Scene();

	let threeDom = $state<HTMLDivElement>();
	let frame = 0;

	onMount(async () => {
		if (!inputState.result) {
			console.log('result not found');
			return;
		}
		let rotation = 0;
		const model = await loader.loadAsync(`/cargoes/${inputState.result.type}.glb`);

		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ alpha: true });

		renderer.setSize(window.innerWidth, window.innerHeight);
		const light = new THREE.PointLight('white', 80);
		light.position.set(2, 2, 4.5);
		scene.add(light);

		if (threeDom) threeDom.appendChild(renderer.domElement);
		const texture = await textureLoader.loadAsync(`/api/texture/${inputState.result.id}`);
		texture.flipY = false;
		const material = new THREE.MeshToonMaterial({ map: texture });
		const cargo = model.scene.children[0];
		if ('material' in cargo) {
			cargo.material = material;
		}
		scene.add(cargo);

		camera.position.z = 3.6;
		camera.position.y = 1.5;
		camera.lookAt(0, 0, 0);

		function animate() {
			setTimeout(() => {
				rotation += 0.01;
				frame = requestAnimationFrame(animate);
				renderer.render(scene, camera);
				cargo.rotation.y = rotation;
			}, 10);
		}
		animate();
	});

	onDestroy(() => {
		scene.clear();
		cancelAnimationFrame(frame);
	});
</script>

<div bind:this={threeDom} class="full-screen z-[1000]"></div>
<div class="full-screen flex flex-col justify-between px-12 py-40">
	<img src="/ui/texts/upload_success.webp" alt="" />
	<img src="/ui/texts/head_up.webp" alt="" />
</div>

<ImgBtn
	class="fixed bottom-12 z-[3000] w-56"
	src="/ui/buttons/restart.webp"
	onclick={() => {
		inputState.reset();
		sysState.routeTo(0);
	}}
/>
