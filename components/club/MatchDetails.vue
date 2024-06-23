<template>
	<div class="container mx-auto p-2">
		<div v-if="isLoading" class="flex justify-center items-center h-full">
			<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
		</div>
		<div v-else>
			<div v-for="(scheduleMatches, scheduleId) in groupedMatches" :key="scheduleId" class="mb-6">
				<div class="text-xm font-semibold mb-1 text-gray-700">Schedule {{ scheduleId }}</div>
				<div v-for="match in scheduleMatches" :key="match.id" class="bg-white shadow-md rounded-lg p-3 mb-3">
					<div v-if="editingMatchId === match.id">
						<MatchForm
							:match="match"
							:scheduleId="scheduleId"
							:participants="participants"
							@update="saveMatch"
							@cancel="cancelEdit"
						/>
					</div>
					<div v-else>
						<div class="flex justify-between items-center mb-2">
							<div class="text-base font-semibold">
								{{ new Date(match.date).toLocaleDateString() }} - {{ match.location }}
							</div>
							<div>
								<button @click="toggleExpand(match.id)" class="text-xs text-blue-500 hover:underline">
									{{ expandedMatches.includes(match.id) ? '간략히 보기' : '펼치기' }}
								</button>
								<button
									@click="deleteMatch(match.id)"
									class="text-xs text-red-500 hover:underline ml-2"
								>
									삭제
								</button>
								<button
									@click="editMatch(match.id)"
									class="text-xs text-green-500 hover:underline ml-2"
								>
									수정
								</button>
							</div>
						</div>
						<div class="flex justify-start">
							<div v-for="team in match.teams" :key="team.id" class="w-full sm:w-1/2 p-1">
								<div
									:class="
										team.winStatus
											? 'bg-green-100' + ' p-3 rounded-md shadow-sm'
											: 'bg-red-100' + ' p-3 rounded-md shadow-sm'
									"
								>
									<p class="text-xs">Score: {{ team.score }}</p>
									<!-- <p class="text-xs">Win Status: {{ team.winStatus ? 'Win' : 'Lose' }}</p> -->
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
			</div>
		</div>
	</div>
</template>

<script setup>
import VideoPlayer from '~/components/matches/VideoPlayer.vue';
import MatchForm from '~/components/matches/UpdateForm.vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const matches = ref([]);
const expandedMatches = ref([]);
const editingMatchId = ref(null);
const isLoading = ref(true);
const participants = ref([]);

const fetchMatches = async (userId) => {
	try {
		const response = await fetch(`/api/club/getMatches?userId=${userId}`);
		const data = await response.json();
		matches.value = data;
	} catch (error) {
		console.error('Failed to fetch matches:', error);
	} finally {
		isLoading.value = false;
	}
};

const fetchParticipants = async (scheduleId) => {
	try {
		const response = await fetch(`/api/match/getParticipants?scheduleId=${scheduleId}`);
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

const toggleExpand = (matchId) => {
	if (expandedMatches.value.includes(matchId)) {
		expandedMatches.value = expandedMatches.value.filter((id) => id !== matchId);
	} else {
		expandedMatches.value.push(matchId);
	}
};

const deleteMatch = async (matchId) => {
	try {
		const response = await fetch(`/api/match/deleteMatch?matchId=${matchId}`, {
			method: 'DELETE',
		});
		const result = await response.json();
		if (result.success) {
			matches.value = matches.value.filter((match) => match.id !== matchId);
		} else {
			console.error('Failed to delete match:', result.error);
		}
	} catch (error) {
		console.error('Error deleting match:', error);
	}
};

const editMatch = async (matchId, scheduleId) => {
	await fetchParticipants(scheduleId);
	editingMatchId.value = matchId;
};

const saveMatch = async (updatedMatch) => {
	try {
		const response = await fetch(`/api/match/updateMatch`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedMatch),
		});
		const result = await response.json();
		if (result.success) {
			const index = matches.value.findIndex((match) => match.id === updatedMatch.id);
			if (index !== -1) {
				matches.value[index] = updatedMatch;
			}
			editingMatchId.value = null;
		} else {
			console.error('Failed to update match:', result.error);
		}
	} catch (error) {
		console.error('Error updating match:', error);
	}
};

const cancelEdit = () => {
	editingMatchId.value = null;
};

const groupedMatches = computed(() => {
	return matches.value.reduce((groups, match) => {
		const scheduleId = match.scheduleId || 'No Schedule';
		if (!groups[scheduleId]) {
			groups[scheduleId] = [];
		}
		groups[scheduleId].push(match);
		return groups;
	}, {});
});

// setup 내에서 즉시 실행 함수로 초기화 작업을 수행합니다.
(async () => {
	if (userStore.user) {
		await fetchMatches(userStore.user.id);
		isLoading.value = false;
	} else {
		isLoading.value = false;
	}
})();
</script>

<style scoped>
.container {
	max-width: 1200px;
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
