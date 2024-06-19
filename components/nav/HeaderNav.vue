<template>
	<div class="flex justify-between items-center bg-white shadow px-4 overflow-hidden">
		<div
			class="flex-grow flex flex-col justify-center items-center cursor-pointer p-2"
			:class="{ 'bg-opacity-10': activeTab === 'club' }"
			@click="setActiveTab('club')"
		>
			<div
				class="text-sm"
				:class="{ 'text-black font-semibold': activeTab === 'club', 'text-gray-500': activeTab !== 'club' }"
			>
				클럽
			</div>
			<div v-if="activeTab === 'club'" class="w-full h-1 bg-black rounded-full bottom-0"></div>
		</div>
		<div
			class="flex-grow flex flex-col justify-center items-center cursor-pointer p-2"
			:class="{ 'bg-opacity-10': activeTab === 'schedule' }"
			@click="setActiveTab('schedule')"
		>
			<div
				class="text-sm"
				:class="{
					'text-black font-semibold': activeTab === 'schedule',
					'text-gray-500': activeTab !== 'schedule',
				}"
			>
				클럽 일정
			</div>
			<div v-if="activeTab === 'schedule'" class="w-full h-1 bg-black rounded-full bottom-0"></div>
		</div>
		<div
			class="flex-grow flex flex-col justify-center items-center cursor-pointer p-2"
			:class="{ 'bg-opacity-10': activeTab === 'records' }"
			@click="setActiveTab('records')"
		>
			<div
				class="text-sm"
				:class="{
					'text-black font-semibold': activeTab === 'records',
					'text-gray-500': activeTab !== 'records',
				}"
			>
				클럽 전적
			</div>
			<div v-if="activeTab === 'records'" class="w-full h-1 bg-black rounded-full bottom-0"></div>
		</div>
		<div
			class="flex-grow flex flex-col justify-center items-center cursor-pointer p-2"
			:class="{ 'bg-opacity-10': activeTab === 'other' }"
			@click="setActiveTab('other')"
		>
			<div
				class="text-sm"
				:class="{
					'text-black font-semibold': activeTab === 'other',
					'text-gray-500': activeTab !== 'other',
				}"
			>
				클럽 멤버
			</div>
			<div v-if="activeTab === 'other'" class="w-full h-1 bg-black rounded-full bottom-0"></div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNavigationStore } from '~/stores/navigation';

const router = useRouter();
const navigationStore = useNavigationStore();
const activeTab = computed(() => navigationStore.activeTab);

function setActiveTab(tab) {
	navigationStore.setActiveTab(tab);
	switch (tab) {
		case 'club':
			router.push('/club/clubindex');
			break;
		case 'schedule':
			router.push('/club/schedule');
			break;
		case 'records':
			router.push('/club/matches');
			break;
		case 'other':
			router.push('/club/members'); // 다른 페이지를 만들지 않으셨다면 이 부분은 필요없습니다.
			break;
	}
}
</script>
