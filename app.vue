<template>
	<div>
		<NuxtPage />
	</div>
</template>

<script setup>
const supabase = useSupabaseClient();
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
