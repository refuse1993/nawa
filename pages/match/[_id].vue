<template>
	<div class="container mx-auto p-4">
		<h1 class="text-xl font-semibold mb-4">경기 등록</h1>
		<div class="bg-white p-4 rounded-lg shadow-md mb-4">
			<h2 class="text-lg font-semibold">
				{{ new Date(schedule.date).toLocaleDateString() }} - {{ schedule.location }}
			</h2>
			<p>{{ schedule.description }}</p>
		</div>
		<button @click="addMatch" class="mb-4 text-blue-500 hover:underline">새 경기 추가</button>
		<div v-for="(match, index) in matches" :key="index" class="bg-white p-4 rounded-lg shadow-md mb-4">
			<MatchForm
				:match="match"
				:scheduleId="scheduleId"
				:participants="participants"
				@remove="removeMatch(index)"
			/>
		</div>
		<div class="flex justify-end mt-4">
			<button @click="saveMatches" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
				저장
			</button>
		</div>
	</div>
</template>

<script setup>
import MatchForm from '~/components/matches/MatchForm.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const scheduleId = ref(route.params._id);

console.log('Schedule ID:', scheduleId.value); // 디버그용 로그

const matches = ref([
	{
		date: '',
		location: '',
		youtubeLink: '',
		type: 'singles',
		teams: [
			{
				score: 0,
				winStatus: false,
				members: [{ userId: '' }],
			},
			{
				score: 0,
				winStatus: false,
				members: [{ userId: '' }],
			},
		],
	},
]);

const participants = ref([]);
const schedule = ref({ date: '', location: '', description: '' });

const addMatch = () => {
	matches.value.push({
		date: '',
		location: '',
		youtubeLink: '',
		type: 'singles',
		teams: [
			{
				score: 0,
				winStatus: false,
				members: [{ userId: '' }],
			},
			{
				score: 0,
				winStatus: false,
				members: [{ userId: '' }],
			},
		],
	});
};

const removeMatch = (index) => {
	matches.value.splice(index, 1);
};

const saveMatches = async () => {
	const response = await fetch('/api/matches/save', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			matches: matches.value,
			scheduleId: parseInt(scheduleId.value),
		}),
	});
	const data = await response.json();

	if (data.error) {
		console.error('Error saving matches:', data.error);
	} else {
		router.push('/club/schedule');
	}
};

const fetchParticipants = async () => {
	const response = await fetch(`/api/match/getParticipants?scheduleId=${scheduleId.value}`);
	const data = await response.json();
	if (data.error) {
		console.error('Error fetching participants:', data.error);
	} else {
		participants.value = data;
	}
};

const fetchSchedule = async () => {
	const response = await fetch(`/api/schedule/getSchedule?scheduleId=${scheduleId.value}`);
	const data = await response.json();
	if (data.error) {
		console.error('Error fetching schedule:', data.error);
	} else {
		schedule.value = data;
	}
};

onMounted(async () => {
	if (scheduleId.value) {
		await fetchParticipants();
		await fetchSchedule();
	} else {
		console.error('Schedule ID is undefined');
	}
});
</script>

<style scoped>
.container {
	max-width: 600px;
	margin: 0 auto;
}
</style>
