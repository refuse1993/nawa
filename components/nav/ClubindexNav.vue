<template>
	<div class="flex justify-between items-center bg-white shadow overflow-hidden">
		<div class="p-2 text-lg font-semibold">클럽</div>
		<div class="flex justify-right w-1/2">
			<div
				class="flex-grow flex flex-col justify-center items-center cursor-pointer p-2"
				:class="{ 'bg-opacity-10': activeTab === 'club' }"
				@click="setActiveTab('club')"
			>
				<div
					class="text-xs p-1 justify-center flex rounded-xl w-full"
					:class="{
						'font-semibold bg-black text-white': activeTab === 'club',
						'text-gray-500 border-gray-500 border': activeTab !== 'club',
					}"
				>
					클럽
				</div>
			</div>
			<div
				class="flex-grow flex flex-col justify-center items-center cursor-pointer p-2"
				:class="{ 'bg-opacity-10': activeTab === 'schedule' }"
				@click="setActiveTab('schedule')"
			>
				<div
					class="text-xs p-1 justify-center flex rounded-xl w-full"
					:class="{
						'font-semibold bg-black text-white': activeTab === 'schedule',
						'text-gray-500 border-gray-500 border': activeTab !== 'schedule',
					}"
				>
					일정
				</div>
				<div v-if="activeTab === 'schedule'" class="w-full h-1 bg-black rounded-full bottom-0"></div>
			</div>
			<div
				class="flex-grow flex flex-col justify-center items-center cursor-pointer p-2"
				:class="{ 'bg-opacity-10': activeTab === 'records' }"
				@click="setActiveTab('records')"
			>
				<div
					class="text-xs p-1 justify-center flex rounded-xl w-full"
					:class="{
						'font-semibold bg-black text-white': activeTab === 'records',
						'text-gray-500 border-gray-500 border': activeTab !== 'records',
					}"
				>
					전적
				</div>
				<div v-if="activeTab === 'records'" class="w-full h-1 bg-black rounded-full bottom-0"></div>
			</div>
			<div
				class="flex-grow flex flex-col justify-center items-center cursor-pointer p-2"
				:class="{ 'bg-opacity-10': activeTab === 'other' }"
				@click="setActiveTab('other')"
			>
				<div
					class="text-xs p-1 justify-center flex rounded-xl w-full"
					:class="{
						'font-semibold bg-black text-white': activeTab === 'other',
						'text-gray-500 border-gray-500 border': activeTab !== 'other',
					}"
				>
					멤버
				</div>
				<div v-if="activeTab === 'other'" class="w-full h-1 bg-black rounded-full bottom-0"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
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
