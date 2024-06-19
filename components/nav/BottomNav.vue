<script setup>
import { useRouter } from 'vue-router';
import { useNavigationStore } from '~/stores/navigation';

const router = useRouter();
const navigationStore = useNavigationStore();

function setActiveTab(tab, path) {
	navigationStore.setActiveTab(tab);
	router.push(path);
}
</script>
<template>
	<div id="BottomNav" class="fixed z-50 bottom-0 flex w-full h-[50px] border-t border-t-gray-700 bg-black">
		<div class="flex w-full max-w-[500px] mx-auto flex items-center justify-around">
			<button @click="setActiveTab('club', '/club/clubindex')" class="w-full h-full">
				<Icon name="material-symbols:home-outline" size="23" color="#ffffff"></Icon>
				<div class="leading-3 text-xs text-gray-100">클럽</div>
			</button>
			<button @click="setActiveTab('schedule', '/schedule')" class="w-full h-full">
				<Icon class="mb-1" name="material-symbols:calendar-today" size="18" color="#ffffff"></Icon>
				<div class="leading-3 text-xs text-gray-100">일정</div>
			</button>
			<button @click="setActiveTab('records', '/matches')" class="w-full h-full">
				<Icon class="mb-1" name="tabler:vs" size="19" color="#ffffff"></Icon>
				<div class="leading-3 text-xs text-gray-100 px-8">전적</div>
			</button>
			<button @click="setActiveTab('other', '/myinfo')" class="w-full h-full">
				<Icon class="mb-1" name="material-symbols:person" size="19" color="#ffffff"></Icon>
				<div class="leading-3 text-xs text-gray-100">내정보</div>
			</button>
		</div>
	</div>
</template>

<style scoped>
nav {
	background-color: #333;
	color: white;
	padding: 1rem;
}

ul {
	list-style: none;
	display: flex;
	gap: 1rem;
}

li {
	cursor: pointer;
	color: white;
	text-decoration: none;
}
</style>
