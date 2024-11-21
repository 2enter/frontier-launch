<script lang="ts">
	import { ImgBtn } from '@/components';
	import { sysState } from '@/states';
</script>

<img class="pointer-events-none fixed h-full" src="/ui/layouts/intro_page.webp" alt="" />
<ImgBtn src="/ui/buttons/start.webp" class="fixed bottom-[30vh] w-1/2" onclick={sysState.navigate}></ImgBtn>
