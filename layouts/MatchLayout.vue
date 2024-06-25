<template>
	<div id="MainLayout" class="h-screen flex flex-col">
		<!-- 고정된 헤더 -->
		<div class="w-full mx-auto fixed top-0 left-0 right-0 bg-white z-10">
			<!-- <div id="TopMenu" class="w-full flex items-center justify-center px-2 h-8 my-2">
				<h1 class="italic text-xl font-semibold">Nawa !!</h1>
			</div> -->
			<Headernav />
		</div>

		<!-- 페이지 콘텐츠 -->
		<div class="flex-1 w-full mx-auto mt-[35px] mb-[60px]">
			<!-- 헤더와 하단 내비게이션 높이만큼 마진 추가 -->
			<slot />
		</div>

		<!-- 고정된 하단 내비게이션 -->
		<div class="w-full mx-auto fixed bottom-0 left-0 right-0 bg-white z-10">
			<Bottomnav />
		</div>
	</div>
</template>

<script setup>
import Headernav from '@/components/nav/MatchNav.vue';
import Bottomnav from '@/components/nav/BottomNav.vue';
import { useNavigationStore } from '~/stores/navigation';
const navigationStore = useNavigationStore();
</script>

<style scoped>
/* 스타일을 여기에 추가하세요 */
</style>
