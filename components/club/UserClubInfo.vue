<template>
    <div class="p-2 bg-white border-b flex flex-col items-center text-center w-full">
        <div v-if="loading" class="flex justify-center items-center h-full">
            <p>Loading...</p>
        </div>
        <div v-else>
            <div v-if="club" class="w-full flex flex-col items-center">
                <div class="flex w-full items-center">
                    <img :src="logoUrl" alt="Club Logo" class="w-24 h-24 rounded-full mb-4 object-cover" />
                    <div class="ml-4 flex flex-col items-start text-left">
                        <h2 class="text-2xl font-sans mb-2">{{ club.name }}</h2>
                        <p class="text-sm text-gray-600 mb-4">클럽 대표: {{ clubRepresentative }}</p>
                    </div>
                </div>
                <div class="flex w-full text-sm justify-between">
                    <div class="p-2 flex-1 basis-1/3 shrink-0 text-center">
                        <p class="font-semibold">Members</p>
                        <p>{{ clubMembers }}명</p>
                    </div>
                    <div class="p-2 flex-1 basis-1/3 shrink-0 text-center">
                        <p class="font-semibold">Point</p>
                        <p>{{ club.activityScore }}</p>
                    </div>
                    <div class="p-2 flex-1 basis-1/3 shrink-0 text-center">
                        <p class="font-semibold">Match</p>
                        <p>{{ totalMatches }}</p>
                    </div>
                </div>
                <div class="flex text-xs whitespace-normal w-[300px] p-2 font-sans">
                    {{ club.description }}
                </div>
                <div class="flex overflow-x-auto w-[300px] border-y">
                    <ClubMemberCard
                        v-for="member in clubMembersDetails"
                        :key="member.id"
                        :id="member.id"
                        :nickname="member.nickname"
                        :iconUrl="member.iconUrl"
                        class="mr-2"
                    />
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
import ClubMemberCard from "~/components/club/card/ClubMemberCard.vue";

const userStore = useUserStore();
const club = computed(() => userStore.club);
const loading = ref(true);
const clubRepresentative = ref("");
const clubMembers = ref(0);
const clubMembersDetails = ref([]);
const totalMatches = ref(0);
const winRate = ref(0);
const logoUrl = ref("");

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

const fetchLogoUrl = async (path) => {
    const { data, error } = await useSupabaseClient().storage.from("main-files").getPublicUrl(path);
    if (error) {
        console.error("Error fetching logo URL:", error);
        return "";
    }
    return data.publicUrl;
};

onMounted(async () => {
    if (club.value) {
        const additionalData = await fetchClubData(club.value.id);
        clubRepresentative.value = additionalData.representative ? additionalData.representative.nickname : "Unknown";
        clubMembers.value = additionalData.members?.length || 0;
        clubMembersDetails.value = additionalData.members;
        totalMatches.value = additionalData.matches?.length || 0;
        winRate.value = calculateWinRate(additionalData.matches);
        loading.value = false;
        logoUrl.value = await fetchLogoUrl(club.value.logoUrl);
    } else {
        loading.value = false;
    }
});
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
