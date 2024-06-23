<template>
	<div class="container mx-auto p-2">
		<div v-if="isLoading" class="flex justify-center items-center">
			<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
		</div>
		<div v-else>
			<div
				v-for="member in members"
				:key="member.id"
				class="bg-white shadow-md rounded-lg p-3 mb-2 flex items-center"
			>
				<img
					:src="member.iconUrl || '/default-icon.png'"
					alt="User Icon"
					class="w-20 h-20 mr-3 shadow-md rounded-full"
				/>
				<div class="flex flex-col">
					<div class="text-m font-semibold text-gray-700">{{ member.nickname }}</div>
					<div class="text-sm text-gray-500">
						<p>Gender: {{ member.gender }}</p>
						<p>Score: {{ member.activityScore }}</p>
						<p>Tennis Days: {{ tennisDays(member.startDate) }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const members = ref([]);
const isLoading = ref(true);

const fetchMembers = async (userId) => {
	try {
		const response = await fetch(`/api/club/getMembers?userId=${userId}`);
		const data = await response.json();
		members.value = data;
	} catch (error) {
		console.error('Failed to fetch members:', error);
	} finally {
		isLoading.value = false;
	}
};

const tennisDays = (startDate) => {
	const start = new Date(startDate);
	const today = new Date();
	const diffTime = Math.abs(today - start);
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// setup 내에서 즉시 실행 함수로 초기화 작업을 수행합니다.
(async () => {
	if (userStore.user) {
		await fetchMembers(userStore.user.id);
	} else {
		isLoading.value = false;
	}
})();
</script>

<style scoped>
.container {
	max-width: 600px;
	margin: 0 auto;
}

.loader {
	border-color: #3490dc;
	border-top-color: transparent;
	animation: spinner 1s linear infinite;
}

@keyframes spinner {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
