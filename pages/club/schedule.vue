<template>
	<MainLayout>
		<div class="min-h-screen bg-gray-100 p-4">
			<Calendar
				v-if="user"
				:schedules="schedules"
				:userId="user.id"
				:participants="participants"
				@refresh="fetchSchedules"
			/>
			<div class="mt-8" v-if="user">
				<h2 class="text-xl font-semibold mb-4">Schedules</h2>
				<div v-for="schedule in schedules" :key="schedule.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
					<div class="flex justify-between items-center mb-2">
						<div>
							<h3 class="text-base font-semibold">
								{{ new Date(schedule.date).toLocaleDateString() }} - {{ schedule.location }}
							</h3>
							<p class="text-sm text-gray-600">{{ schedule.description }}</p>
						</div>
						<div class="flex space-x-2">
							<button
								@click="toggleParticipation(schedule.id)"
								class="text-xs text-blue-600 hover:underline"
							>
								{{ isParticipating(schedule.id) ? '참석 취소' : '참석' }}
							</button>
							<router-link
								:to="{ name: 'match-registration', params: { scheduleId: schedule.id } }"
								class="text-xs text-blue-600 hover:underline"
							>
								경기 등록
							</router-link>
						</div>
					</div>
					<div>
						<strong class="text-sm">참석자:</strong>
						<ul class="list-disc list-inside text-sm text-gray-700">
							<li v-for="participant in getParticipants(schedule.id)" :key="participant.id">
								{{ participant.nickname || participant.name }}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</MainLayout>
</template>

<script setup>
import MainLayout from '~/layouts/MainLayout.vue';
import Calendar from '@/components/club/ClubSchedules.vue';

const user = useSupabaseUser();
const schedules = ref([]);
const participants = ref([]);

const fetchSchedules = async (userId) => {
	const response = await fetch('/api/club/getSchedules', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	});
	const data = await response.json();
	schedules.value = data;
};

const fetchParticipants = async () => {
	const response = await fetch('/api/schedule/getParticipants');
	const data = await response.json();
	if (Array.isArray(data)) {
		participants.value = data;
	} else {
		participants.value = [];
	}
};

const isParticipating = (scheduleId) => {
	return participants.value.some(
		(participant) => participant.scheduleId === scheduleId && participant.userId === user.value.id
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
				userId: user.value.id,
			}),
		});
		// 참석자 목록에서 제거
		participants.value = participants.value.filter(
			(participant) => !(participant.scheduleId === scheduleId && participant.userId === user.value.id)
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
				userId: user.value.id,
			}),
		});
		// 참석자 목록에 추가
		participants.value.push({
			scheduleId: scheduleId,
			userId: user.value.id,
			nickname: user.value.nickname || user.value.name, // nickname이나 name 사용
			id: user.value.id,
		});
	}
};

const getParticipants = (scheduleId) => {
	return participants.value.filter((participant) => participant.scheduleId === scheduleId);
};

onMounted(async () => {
	if (user.value) {
		await fetchSchedules(user.value.id);
		await fetchParticipants();
	}
});
</script>

<style scoped>
/* Add additional styles if necessary */
</style>
