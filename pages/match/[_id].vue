<template>
	<div class="container mx-auto p-4">
		<h1 class="text-xl font-semibold mb-4">경기 등록</h1>
		<div v-if="isLoading" class="flex justify-center items-center h-full">
			<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
		</div>
		<div v-else>
			<div class="bg-white p-4 rounded-lg shadow-md mb-4">
				<div class="text-lg font-semibold">
					{{ new Date(schedule.date).toLocaleDateString() }} - {{ schedule.location }}
				</div>
			</div>
			<button @click="addMatch" class="mb-4 text-blue-500 hover:underline">새 경기 추가</button>
			<div v-for="(match, index) in matches" :key="index" class="bg-white p-4 rounded-lg shadow-md mb-4">
				<MatchForm
					:match="match"
					:scheduleId="scheduleId"
					:participants="participants"
					@remove="removeMatch(index)"
					@update="updateMatch(index, $event)"
				/>
				<div class="mt-2">
					<h3 class="text-sm font-semibold mb-2">Selected Users</h3>
					<ul>
						<li v-for="(team, teamIndex) in match.teams" :key="teamIndex">
							<div v-for="(member, memberIndex) in team.members" :key="memberIndex">
								{{ member.userId }}
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="flex justify-end mt-4">
				<button @click="saveMatches" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
					저장
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import MatchForm from '~/components/matches/MatchForm.vue';

const router = useRouter();
const route = useRoute();
const scheduleId = ref(route.params._id);

const matches = ref([]);
const participants = ref([]);
const schedule = ref({ date: '', location: '', clubId: '' });
const isLoading = ref(true);

const addMatch = () => {
	matches.value.push({
		date: schedule.value.date,
		location: schedule.value.location,
		clubId: schedule.value.clubId,
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

const updateMatch = (index, updatedMatch) => {
	matches.value[index] = updatedMatch;
};

const isValidDate = (date) => {
	return !isNaN(new Date(date).getTime());
};

const saveMatches = async () => {
	try {
		const matchesToSave = matches.value.map((match) => {
			if (!isValidDate(match.date)) {
				throw new Error(`Invalid date format for match: ${match.date}`);
			}
			return {
				...match,
				date: new Date(match.date).toISOString(), // Date 형식 맞추기
			};
		});

		const response = await fetch('/api/match/saveMatch', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				matches: matchesToSave,
				scheduleId: parseInt(scheduleId.value),
			}),
		});
		const data = await response.json();

		if (data.error) {
			console.error('Error saving matches:', data.error);
		} else {
			router.push('/club/schedule');
		}
	} catch (error) {
		console.error('Error saving matches:', error.message);
	}
};

const fetchParticipants = async () => {
	try {
		const response = await fetch(`/api/match/getParticipants?scheduleId=${scheduleId.value}`);
		const data = await response.json();
		if (data.error) {
			console.error('Error fetching participants:', data.error);
		} else {
			participants.value = data;
		}
	} catch (error) {
		console.error('Error fetching participants:', error);
	}
};

const fetchSchedule = async () => {
	try {
		const response = await fetch(`/api/schedule/getSchedule?scheduleId=${scheduleId.value}`);
		const data = await response.json();
		if (data.error) {
			console.error('Error fetching schedule:', data.error);
		} else {
			schedule.value = data;

			// 데이터 로딩이 완료된 후 matches 초기화
			addMatch();
		}
	} catch (error) {
		console.error('Error fetching schedule:', error);
	}
};

onMounted(async () => {
	if (scheduleId.value) {
		await fetchParticipants();
		await fetchSchedule();
		isLoading.value = false; // 로딩 상태 종료
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
