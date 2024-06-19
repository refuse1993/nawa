<template>
	<div class="container mx-auto p-4">
		<div v-for="match in matches" :key="match.id" class="bg-white shadow-md rounded-lg p-4 mb-6">
			<h2 class="text-2xl font-semibold mb-4">
				{{ new Date(match.date).toLocaleDateString() }} - {{ match.location }}
			</h2>
			<div class="flex justify-between items-center mb-4">
				<div v-for="team in match.teams" :key="team.id" class="w-1/2 p-2">
					<h3 class="text-xl font-semibold">Team {{ team.id }}</h3>
					<p>Score: {{ team.score }}</p>
					<p>Win Status: {{ team.winStatus ? 'Win' : 'Lose' }}</p>
					<div class="mt-2">
						<h4 class="text-lg font-semibold">Players:</h4>
						<ul>
							<li v-for="member in team.members" :key="member.id" class="mt-1">
								{{ member.user.nickname }}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const user = useSupabaseUser();
const matches = ref([]);

const fetchMatches = async (userId) => {
	const response = await fetch(`/api/club/getMatches?userId=${userId}`);
	const data = await response.json();
	matches.value = data;
};

onMounted(() => {
	if (user.value) {
		fetchMatches(user.value.id);
	}
});
</script>

<style scoped>
.container {
	max-width: 800px;
	margin: 0 auto;
}
</style>
