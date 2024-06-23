<script setup>
import MainLayout from '~/layouts/MainLayout.vue';
import UserClubInfo from '~/components/club/UserClubInfo.vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const router = useRouter();

watchEffect(async () => {
	await userStore.setUser();

	if (!userStore.user) {
		router.push('/auth');
	} else if (!userStore.club) {
		router.push('/signup');
	}
});
</script>

<template>
	<MainLayout>
		<div class="flex flex-col items-center justify-center min-h-[20vh]">
			<UserClubInfo />
		</div>
	</MainLayout>
</template>
