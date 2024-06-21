<template>
	<div class="container mx-auto p-2">
		<div v-for="match in matches" :key="match.id" class="bg-white shadow-md rounded-lg p-3 mb-3">
			<div class="flex justify-between items-center mb-2">
				<h2 class="text-base font-semibold">
					{{ new Date(match.date).toLocaleDateString() }} - {{ match.location }}
				</h2>
				<button @click="toggleExpand(match.id)" class="text-xs text-blue-500 hover:underline">
					{{ expandedMatches.includes(match.id) ? '간략히 보기' : '펼치기' }}
				</button>
			</div>
			<div class="flex flex-wrap justify-between items-start mb-2">
				<div v-for="team in match.teams" :key="team.id" class="w-full sm:w-1/2 p-2">
					<div class="bg-gray-100 p-3 rounded-md shadow-sm">
						<h3 class="text-sm font-semibold">Team {{ team.id }}</h3>
						<p class="text-xs">Score: {{ team.score }}</p>
						<p class="text-xs">Win Status: {{ team.winStatus ? 'Win' : 'Lose' }}</p>
						<div class="mt-1">
							<h4 class="text-xs font-semibold">Players:</h4>
							<ul class="list-disc list-inside">
								<li v-for="member in team.members" :key="member.id" class="text-xs mt-1">
									{{ member.user.nickname }}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div v-if="expandedMatches.includes(match.id)" class="mt-2">
				<div v-if="match.youtubeLink" class="w-full mt-2">
					<video-player :src="match.youtubeLink"></video-player>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import VideoPlayer from '~/components/matches/VideoPlayer.vue';

const user = useSupabaseUser();
const matches = ref([]);
const expandedMatches = ref([]);

const fetchMatches = async (userId) => {
	try {
		const response = await fetch(`/api/club/getMatches?userId=${userId}`);
		const data = await response.json();
		matches.value = data;
	} catch (error) {
		console.error('Failed to fetch matches:', error);
	}
};

const toggleExpand = (matchId) => {
	if (expandedMatches.value.includes(matchId)) {
		expandedMatches.value = expandedMatches.value.filter((id) => id !== matchId);
	} else {
		expandedMatches.value.push(matchId);
	}
};

onMounted(() => {
	if (user.value) {
		fetchMatches(user.value.id);
	}
});
</script>

<style scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
}
</style>
