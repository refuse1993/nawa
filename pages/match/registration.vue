<template>
	<div class="container mx-auto p-4">
		<h1 class="text-xl font-semibold mb-4">경기 등록</h1>
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

const router = useRouter();
const route = useRoute();
const scheduleId = route.params.scheduleId;
const supabase = useSupabaseClient();

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
	const { data, error } = await supabase.from('matches').insert(
		matches.value.map((match) => ({
			...match,
			scheduleId: parseInt(scheduleId),
		}))
	);

	if (error) {
		console.error('Error saving matches:', error);
	} else {
		router.push('/club/schedule');
	}
};

const fetchParticipants = async () => {
	const { data, error } = await supabase.from('participants').select('userId, nickname').eq('scheduleId', scheduleId);

	if (error) {
		console.error('Error fetching participants:', error);
	} else {
		participants.value = data;
	}
};

onMounted(async () => {
	await fetchParticipants();
});
</script>

<style scoped>
.container {
	max-width: 600px;
	margin: 0 auto;
}
</style>
