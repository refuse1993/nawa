<template>
	<div class="max-h-[20vh]">
		<div v-if="loading" class="flex justify-center items-center h-full">
			<p>Loading...</p>
		</div>
		<div v-else>
			<div v-if="club" class="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
				<img :src="club.logoUrl" alt="Club Logo" class="w-24 h-24 rounded-full mb-4 object-cover" />
				<h2 class="text-2xl font-semibold">{{ club.name }}</h2>
			</div>
			<div v-else class="text-center p-4 bg-white rounded-lg shadow-md">
				<p class="text-xl font-semibold">가입한 클럽이 없습니다!</p>
			</div>
		</div>
	</div>
</template>

<script setup>
const user = useSupabaseUser();
const club = ref(null);
const loading = ref(true);

const getUserClub = async (userId) => {
	try {
		const response = await fetch(`/api/user/club?userId=${userId}`);
		const data = await response.json();
		console.log('Fetched club:', data);
		return data.club;
	} catch (error) {
		console.error('Error fetching user club:', error);
		return null;
	}
};

onMounted(async () => {
	if (user.value) {
		console.log('User ID in UserClubInfo:', user.value.id); // 디버그 로그 추가
		club.value = await getUserClub(user.value.id);
		loading.value = false;
		console.log('Club data:', club.value); // 디버그 로그 추가
	} else {
		loading.value = false;
		console.log('No user is logged in');
	}
});
</script>

<style scoped>
/* Add additional styles if necessary */
</style>
