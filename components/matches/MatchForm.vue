<template>
	<div class="bg-white p-4 rounded-lg shadow-md">
		<form @submit.prevent="handleSubmit">
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">YouTube Link</label>
				<input
					type="url"
					v-model="form.youtubeLink"
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
				/>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">Match Type</label>
				<select
					v-model="form.type"
					@change="updateTeams"
					class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
					required
				>
					<option value="singles">Singles</option>
					<option value="doubles">Doubles</option>
				</select>
			</div>
			<div class="mb-4">
				<div class="flex">
					<div v-for="(team, teamIndex) in form.teams" :key="teamIndex" class="w-1/2 p-2">
						<div class="bg-gray-100 p-4 rounded-lg mb-4">
							<div class="text-sm font-semibold mb-2">Team {{ teamIndex + 1 }}</div>
							<div class="mb-2">
								<label class="block text-sm font-medium text-gray-700">Score</label>
								<div class="flex items-center mb-2">
									<button
										@click="decrementScore(teamIndex)"
										type="button"
										class="text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
									>
										-
									</button>
									<span class="mx-2">{{ team.score }}</span>
									<button
										@click="incrementScore(teamIndex)"
										type="button"
										class="text-xs bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
									>
										+
									</button>
								</div>
							</div>
							<div class="mb-2">
								<label class="block text-sm font-medium text-gray-700">Players</label>
								<ul>
									<li v-for="(member, memberIndex) in team.members" :key="memberIndex" class="mb-2">
										<div class="flex items-center">
											<select
												v-model="member.userId"
												@change="emitUserChange"
												class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
												required
											>
												<option
													v-for="participant in participants"
													:key="participant.id"
													:value="participant.userId"
												>
													{{ participant.nickname || participant.name }}
												</option>
											</select>
										</div>
									</li>
								</ul>
								<button
									type="button"
									@click="addPlayer(teamIndex)"
									v-if="form.type === 'doubles' && team.members.length < 2"
									class="mt-2 text-blue-500 hover:underline text-xs"
								>
									Add Player
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex justify-end mt-4">
				<button
					type="button"
					@click="handleRemove"
					class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
				>
					Remove
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
const props = defineProps({
	match: {
		type: Object,
		required: true,
	},
	scheduleId: {
		type: Number,
		required: true,
	},
	participants: {
		type: Array,
		required: true,
	},
});
const emit = defineEmits(['remove', 'update']);

const form = ref(JSON.parse(JSON.stringify(props.match)));

const handleRemove = () => {
	emit('remove');
};

const addPlayer = (teamIndex) => {
	if (form.value.type === 'doubles' && form.value.teams[teamIndex].members.length < 2) {
		form.value.teams[teamIndex].members.push({ userId: '' });
	}
};

const updateTeams = () => {
	form.value.teams.forEach((team) => {
		if (form.value.type === 'singles') {
			team.members = [{ userId: '' }];
		} else if (form.value.type === 'doubles') {
			if (team.members.length < 2) {
				team.members.push({ userId: '' });
			}
		}
	});
};

const updateWinStatus = () => {
	if (form.value.teams.length === 2) {
		const [team1, team2] = form.value.teams;
		if (team1.score > team2.score) {
			team1.winStatus = true;
			team2.winStatus = false;
		} else if (team1.score < team2.score) {
			team1.winStatus = false;
			team2.winStatus = true;
		} else {
			team1.winStatus = false;
			team2.winStatus = false;
		}
	}
};

const incrementScore = (teamIndex) => {
	form.value.teams[teamIndex].score += 1;
	updateWinStatus();
	emit('update', form.value);
};

const decrementScore = (teamIndex) => {
	if (form.value.teams[teamIndex].score > 0) {
		form.value.teams[teamIndex].score -= 1;
		updateWinStatus();
		emit('update', form.value);
	}
};

const emitUserChange = () => {
	emit('update', form.value);
};

watch(form.value.teams, updateWinStatus, { deep: true });

onMounted(() => {
	updateTeams();
});
</script>

<style scoped>
button {
	margin: 0 5px;
}
</style>
