<template>
	<div class="container mx-auto p-2">
		<div v-if="isLoading" class="flex justify-center items-center h-full">
			<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
		</div>
		<div v-else>
			<!-- 삭제 확인 모달 -->
			<div
				v-if="showDeleteModal"
				class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
			>
				<div class="bg-white p-6 rounded-lg shadow-lg w-80">
					<div class="text-sm font-semibold mb-4">경기 삭제</div>
					<p class="mb-4">이 경기를 삭제하시겠습니까?</p>
					<div class="flex justify-end text-xs">
						<button
							@click="closeDeleteModal"
							type="button"
							class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
						>
							취소
						</button>
						<button
							@click="confirmDeleteMatch"
							type="button"
							class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
						>
							삭제
						</button>
					</div>
				</div>
			</div>

			<div v-for="(group, scheduleId) in groupedMatches" :key="scheduleId" class="mb-3">
				<div class="text-xs font-semibold mb-1 text-gray-700 flex justify-center">
					{{ group.date }} {{ group.location }}
				</div>
				<div v-for="match in group.matches" :key="match.id" class="bg-white border-b p-1 mb-3">
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
						<div class="flex justify-end items-center">
							<button @click="toggleExpand(match.id)" class="text-xs hover:underline mr-2">
								<span v-if="expandedMatches.includes(match.id)">&#9650;</span>
								<span v-else>&#9660;</span>
							</button>
						</div>
						<div class="flex mt-2">
							<!-- 왼쪽 영역: 팀별 선수 이름 -->
							<div class="w-4/5">
								<div v-for="team in match.teams" :key="team.id" class="mb-1">
									<div :class="['text-xs ml-2 border-b flex w-full']">
										<div v-for="member in team.members" :key="member.id" class="mr-2">
											{{ member.user.nickname }}
										</div>
									</div>
								</div>
							</div>
							<!-- 오른쪽 영역: 팀별 점수 -->
							<div class="w-1/3">
								<div v-for="team in match.teams" :key="team.id" class="mb-1">
									<div
										:class="[
											'text-xs mr-2  text-white',
											team.winStatus ? 'bg-green-600' : 'bg-red-500',
										]"
									>
										<div class="text-center text-xs border-b font-semibold">{{ team.score }}</div>
									</div>
								</div>
							</div>
						</div>
						<div v-if="expandedMatches.includes(match.id)">
							<div v-if="match.youtubeLink" class="w-full">
								<video-player :src="match.youtubeLink"></video-player>
							</div>
							<div class="flex justify-end items-center mt-2">
								<button
									@click="editMatch(match.id)"
									class="text-xs text-green-600 hover:underline ml-2"
								>
									수정
								</button>
								<button
									@click="openDeleteModal(match.id)"
									class="text-xs text-red-600 hover:underline ml-2 mr-2"
								>
									삭제
								</button>
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
const showDeleteModal = ref(false);
const matchToDelete = ref(null);

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

const openDeleteModal = (matchId) => {
	matchToDelete.value = matchId;
	showDeleteModal.value = true;
};

const closeDeleteModal = () => {
	matchToDelete.value = null;
	showDeleteModal.value = false;
};

const confirmDeleteMatch = async () => {
	if (!matchToDelete.value) return;

	try {
		const response = await fetch(`/api/match/deleteMatch?matchId=${matchToDelete.value}`, {
			method: 'DELETE',
		});
		const result = await response.json();
		if (result.success) {
			matches.value = matches.value.filter((match) => match.id !== matchToDelete.value);
			closeDeleteModal();
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
		const scheduleDate = match.date ? new Date(match.date).toLocaleDateString() : 'No Date';
		const scheduleLocation = match.location || 'No Location';

		if (!groups[scheduleId]) {
			groups[scheduleId] = {
				date: scheduleDate,
				location: scheduleLocation,
				matches: [],
			};
		}
		groups[scheduleId].matches.push(match);
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
