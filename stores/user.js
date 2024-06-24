import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
    const client = useSupabaseClient();
    const user = ref(null);
    const club = ref(null);

    const setUser = async () => {
        const { data } = await client.auth.getUser();
        user.value = data.user;

        if (user.value) {
            const response = await fetch(`/api/user/club?userId=${user.value.id}`);
            const data = await response.json();
            club.value = data.club;
        }
    };

    return {
        user,
        club,
        setUser,
    };
});
