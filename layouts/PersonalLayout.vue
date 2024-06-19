<template>
	<div id="MainLayout" class="h-screen">
		<div class="w-full max-w[500px] mx-auto">
			<div id="TopMenu" class="w-full flex items-center justify-center px-2 h-8 my-2">
				<h1 class="italic text-xl font-semibold">Nawa !!</h1>
			</div>
		</div>

		<div class="flex w-full max-w-[500px] mx-auto h-screen">
			<!-- <slot /> -->
			<slot />
		</div>

		<Bottomnav />
	</div>
</template>

<script setup>
import Bottomnav from '@/components/nav/BottomNav.vue';
import { useNavigationStore } from '~/stores/navigation';
const navigationStore = useNavigationStore();
</script>

<style scoped>
/* 스타일을 여기에 추가하세요 */
</style>
