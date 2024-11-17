<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { sysState, inputState } from '@/states';
	import { onDestroy, onMount } from 'svelte';

	const loader = new GLTFLoader();
	const textureLoader = new THREE.TextureLoader();
	let threeDom = $state<HTMLDivElement>();
	let frame = 0;
	const scene = new THREE.Scene();

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
		light.position.z = 5;
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

		camera.position.z = 3.5;

		function animate() {
			setTimeout(() => {
				rotation += 0.1;
				frame = requestAnimationFrame(animate);
				renderer.render(scene, camera);
				cargo.rotation.y = rotation;
			}, 80);
		}
		animate();
	});

	onDestroy(() => {
		scene.clear();
		cancelAnimationFrame(frame);
	});
</script>

<div bind:this={threeDom} class="full-screen z-[1000]"></div>
