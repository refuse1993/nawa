<template>
	<MainLayout>
		<div class="min-h-screen bg-gray-100 mt-2 p-2">
			<div v-if="isLoading" class="flex justify-center items-center h-full">
				<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
			</div>
			<div v-else>
				<Calendar
					v-if="userStore.user"
					:schedules="schedules"
					:userId="userStore.user.id"
					:participants="participants"
					@refresh="fetchSchedules"
				/>
				<div class="flex mt-2 items-center justify-center w-full bg-slate-600">
					<div class="text-white">일정 상세</div>
				</div>
				<div class="mt-2" v-if="userStore.user">
					<div
						v-for="schedule in schedules"
						:key="schedule.id"
						class="bg-white p-4 rounded-lg shadow-md mb-4"
					>
						<!-- 시간 및 장소를 일렬로 배치 -->
						<div class="flex justify-between items-center mb-2">
							<div class="flex-1">
								<div class="text-base font-semibold">
									{{ formatDateTime(schedule.date) }}
								</div>
							</div>
							<div class="flex-1 text-right mb-1 italic">
								<div class="text-sm">{{ schedule.location }}</div>
							</div>
						</div>

						<!-- 아래 공간을 반으로 나누어 왼쪽에 참가자 목록 -->
						<div class="flex">
							<div class="w-2/3 pr-2">
								<strong class="text-sm">참석자:</strong>
								<ul class="list-disc list-inside text-sm text-gray-700 mt-2">
									<li v-for="participant in getParticipants(schedule.id)" :key="participant.id">
										{{ participant.nickname || participant.name }}
									</li>
								</ul>
							</div>
							<!-- 오른쪽 공간을 위 아래로 나누어 참석 여부와 경기 등록 버튼 배치 -->
							<div class="w-1/3 pl-2 flex flex-col justify-start">
								<button
									@click="toggleParticipation(schedule.id)"
									class="mb-2 text-xs px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in-out"
									:class="
										isParticipating(schedule.id)
											? 'bg-red-500 text-white hover:bg-red-600'
											: 'bg-blue-500 text-white hover:bg-blue-600'
									"
								>
									{{ isParticipating(schedule.id) ? '참석 취소' : '참석' }}
								</button>
								<button
									@click="navigateToMatchRegistration(schedule.id)"
									class="text-xs px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-150 ease-in-out"
								>
									경기 등록
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</MainLayout>
</template>

<script setup>
import MainLayout from '~/layouts/MainLayout.vue';
import Calendar from '@/components/club/ClubSchedules.vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const schedules = ref([]);
const participants = ref([]);
const isLoading = ref(true);
const router = useRouter();

const fetchSchedules = async (userId) => {
	try {
		const response = await fetch('/api/club/getSchedules', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId }),
		});
		const data = await response.json();
		schedules.value = data;
	} catch (error) {
		console.error('Failed to fetch schedules:', error);
	}
};

const fetchParticipants = async () => {
	try {
		const response = await fetch('/api/schedule/getParticipants');
		const data = await response.json();
		if (Array.isArray(data)) {
			participants.value = data;
		} else {
			participants.value = [];
		}
	} catch (error) {
		console.error('Failed to fetch participants:', error);
	}
};

const isParticipating = (scheduleId) => {
	return participants.value.some(
		(participant) => participant.scheduleId === scheduleId && participant.userId === userStore.user.id
	);
};

const toggleParticipation = async (scheduleId) => {
	if (isParticipating(scheduleId)) {
		// 참석 취소
		await fetch('/api/schedule/leave', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				scheduleId: scheduleId,
				userId: userStore.user.id,
			}),
		});
		// 참석자 목록에서 제거
		participants.value = participants.value.filter(
			(participant) => !(participant.scheduleId === scheduleId && participant.userId === userStore.user.id)
		);
	} else {
		// 참석
		await fetch('/api/schedule/join', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				scheduleId: scheduleId,
				userId: userStore.user.id,
			}),
		});
		// 참석자 목록에 추가
		participants.value.push({
			scheduleId: scheduleId,
			userId: userStore.user.id,
			nickname: userStore.user.nickname || userStore.user.name, // nickname이나 name 사용
			id: userStore.user.id,
		});
	}
};

const navigateToMatchRegistration = (scheduleId) => {
	localStorage.setItem('scheduleId', scheduleId);
	router.push(`/match/${scheduleId}`);
};

const getParticipants = (scheduleId) => {
	return participants.value.filter((participant) => participant.scheduleId === scheduleId);
};

// setup 내에서 즉시 실행 함수로 초기화 작업을 수행합니다.
(async () => {
	if (userStore.user) {
		await fetchSchedules(userStore.user.id);
		await fetchParticipants();
	}
	isLoading.value = false;
})();

const formatDateTime = (dateTime) => {
	const options = {
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	};
	return new Date(dateTime).toLocaleString('ko-KR', options);
};
</script>

<style scoped>
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
