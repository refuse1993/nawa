<script setup>
import MainLayout from '~/layouts/MainLayout.vue';
import UserClubInfo from '~/components/club/UserClubInfo.vue';

const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const checkUserExists = async (userId) => {
	try {
		const response = await fetch(`/api/user/checkUser?userId=${userId}`);
		const data = await response.json();
		return data.exists;
	} catch (error) {
		console.error('Error checking user:', error);
		return false;
	}
};

watchEffect(async () => {
	if (user.value) {
		console.log('User is logged in:', user.value);
		const userExists = await checkUserExists(user.value.id);
		if (!userExists) {
			router.push('/signup');
		}
	} else {
		console.log('No user is logged in');
	}
});
</script>

<template>
	<MainLayout>
		<div class="flex flex-col items-center justify-center min-h-[20vh] bg-gray-100">
			<!-- 클럽 정보를 표시하는 컴포넌트를 추가 -->
			<UserClubInfo />
		</div>
	</MainLayout>
</template>
