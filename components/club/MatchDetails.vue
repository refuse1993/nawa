<template>
    <div class="container mx-auto p-4">
        <div v-for="match in matches" :key="match.id" class="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 class="text-2xl font-semibold mb-4">
                {{ new Date(match.date).toLocaleDateString() }} - {{ match.location }}
            </h2>
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div v-if="match.youtubeLink" class="w-full md:w-1/2 lg:w-1/3 mt-4 md:mt-0">
                    <video-player :src="match.youtubeLink"></video-player>
                </div>
                <div v-for="team in match.teams" :key="team.id" class="w-full md:w-1/2 lg:w-1/3 p-4 mt-4 md:mt-0">
                    <h3 class="text-xl font-semibold">Team {{ team.id }}</h3>
                    <p>Score: {{ team.score }}</p>
                    <p>Win Status: {{ team.winStatus ? "Win" : "Lose" }}</p>
                    <div class="mt-2">
                        <h4 class="text-lg font-semibold">Players:</h4>
                        <ul class="list-disc list-inside">
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
import VideoPlayer from "~/components/matches/VideoPlayer.vue";

const user = useSupabaseUser();
const matches = ref([]);

const fetchMatches = async (userId) => {
    try {
        const response = await fetch(`/api/club/getMatches?userId=${userId}`);
        const data = await response.json();
        matches.value = data;
    } catch (error) {
        console.error("Failed to fetch matches:", error);
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
