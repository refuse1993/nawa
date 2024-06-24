<template>
	<div class="flex items-center justify-center min-h-screen bg-white bg-opacity-50">
		<div class="flex flex-col items-center">
			<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const router = useRouter();

const checkUserExists = async (userId) => {
	try {
		const response = await fetch(`/api/user/checkUser?userId=${userId}`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data.exists;
	} catch (error) {
		console.error('Error checking user:', error);
		alert('Failed to check user existence. Please try again.');
		return false;
	}
};

watchEffect(async () => {
	if (!userStore.user) {
		await userStore.setUser();
	}

	if (userStore.user) {
		console.log('User is logged in:', userStore.user);
		const userExists = await checkUserExists(userStore.user.id);
		if (userExists) {
			router.push('/club/clubindex');
		} else {
			router.push('/auth');
		}
	} else {
		router.push('/auth');
	}
});
</script>

<style scoped>
.loader {
	border-color: #3490dc;
	border-top-color: transparent;
	animation: spinner 1s linear infinite;
}

@keyframes spinner {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
