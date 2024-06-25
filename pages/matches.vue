<script setup>
import MainLayout from "~/layouts/MatchLayout.vue";
import MatchDetails from "~/components/club/MatchDetails.vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();
const router = useRouter();

watchEffect(async () => {
    if (!userStore.user) {
        await userStore.setUser();
    }

    if (!userStore.user) {
        router.push("/auth");
    }
});
</script>

<template>
    <MainLayout>
        <div class="min-h-screen mt-2">
            <MatchDetails />
        </div>
    </MainLayout>
</template>
