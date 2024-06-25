import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const client = useSupabaseClient();
    const user = ref(null);
    const club = ref(null);
    const matchesWithSchedules = ref([]);

    const setUser = async () => {
        const { data } = await client.auth.getUser();
        user.value = data.user;

        if (user.value) {
            await fetchClub();
        }
    };

    const fetchClub = async () => {
        if (user.value) {
            const response = await fetch(`/api/user/club?userId=${user.value.id}`);
            const data = await response.json();
            club.value = data.club;

            if (club.value) {
                await fetchMatchesWithSchedules();
            }
        }
    };

    const fetchMatchesWithSchedules = async () => {
        if (club.value) {
            const response = await fetch(`/api/club/matches-with-schedules?clubId=${club.value.id}`);
            const data = await response.json();
            matchesWithSchedules.value = data;
        }
    };

    return {
        user,
        club,
        matchesWithSchedules,
        setUser,
        fetchClub,
        fetchMatchesWithSchedules,
    };
});
