<template>
	<MainLayout>
		<div class="min-h-screen flex flex-col w-full items-center mt-2">
			<UserClubInfo />
		</div>
	</MainLayout>
</template>

<script setup>
import MainLayout from '~/layouts/ClubindexLayout.vue';
import UserClubInfo from '~/components/club/UserClubInfo.vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const router = useRouter();

watchEffect(async () => {
	if (!userStore.user) {
		await userStore.setUser();
	}

	if (!userStore.user) {
		router.push('/auth');
	}
});
</script>

<style scoped>
/* 여기에 스타일을 추가하세요 */
</style>
