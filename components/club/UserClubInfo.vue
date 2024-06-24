<template>
    <div class="max-h-[20vh] p-4 bg-white rounded-lg shadow-md flex flex-col items-center text-center">
        <div v-if="loading" class="flex justify-center items-center h-full">
            <p>Loading...</p>
        </div>
        <div v-else>
            <div v-if="club" class="w-full">
                <img :src="club.logoUrl" alt="Club Logo" class="w-24 h-24 rounded-full mb-4 object-cover" />
                <h2 class="text-2xl font-sans mb-2">{{ club.name }}</h2>
                <p class="text-sm text-gray-600 mb-4">클럽 대표: {{ clubRepresentative }}</p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="bg-gray-100 p-2 rounded-lg">
                        <p class="font-semibold">인원</p>
                        <p>{{ clubMembers }}명</p>
                    </div>
                    <div class="bg-gray-100 p-2 rounded-lg">
                        <p class="font-semibold">활동 점수</p>
                        <p>{{ club.activityScore }}</p>
                    </div>
                    <div class="bg-gray-100 p-2 rounded-lg">
                        <p class="font-semibold">총 경기수</p>
                        <p>{{ totalMatches }}</p>
                    </div>
                    <div class="bg-gray-100 p-2 rounded-lg">
                        <p class="font-semibold">승률</p>
                        <p>{{ winRate }}%</p>
                    </div>
                </div>
            </div>
            <div v-else class="text-center p-4 bg-white rounded-lg shadow-md">
                <p class="text-xl font-semibold">가입한 클럽이 없습니다!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
import { computed, ref, onMounted } from "vue";

const userStore = useUserStore();
const club = computed(() => userStore.club);
const loading = ref(true);
const clubRepresentative = ref("");
const clubMembers = ref(0);
const totalMatches = ref(0);
const winRate = ref(0);

const calculateWinRate = (matches) => {
    if (!matches || matches.length === 0) return 0;
    const wins = matches.filter((match) => match.teams.some((team) => team.winStatus)).length;
    return ((wins / matches.length) * 100).toFixed(2);
};

const fetchClubData = async (clubId) => {
    const response = await fetch(`/api/club/getDetails?clubId=${clubId}`);
    const data = await response.json();
    return data;
};

onMounted(async () => {
    if (club.value) {
        const additionalData = await fetchClubData(club.value.id);
        clubRepresentative.value = additionalData.representative ? additionalData.representative.nickname : "Unknown";
        clubMembers.value = additionalData.members?.length || 0;
        totalMatches.value = additionalData.matches?.length || 0;
        winRate.value = calculateWinRate(additionalData.matches);
        loading.value = false;
    } else {
        loading.value = false;
    }
});
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
