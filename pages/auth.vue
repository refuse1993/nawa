<template>
	<div id="AuthPage" class="w-full h-[100vh] h-screen pt-32 flex flex-col items-center justify-center">
		<div class="w-full flex flex-col items-center justify-center gap-2.5 p-2">
			<h1 class="italic text-xl font-semibold">Nawa !!</h1>
		</div>

		<div class="max-w-[350px] mx-auto px-2 text-black flex flex-col items-center justify-center h-[50vh]">
			<div class="text-center mb-6 mt-4">Login / Register</div>

			<button @click="login('kakao')" class="w-full max-w-[300px] flex items-center justify-center">
				<img class="w-full rounded-full" src="/kakao_login_medium_wide.png" />
			</button>
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
const supabase = useSupabaseClient();
const router = useRouter();
const userStore = useUserStore();

const login = async (prov) => {
	console.log('Login provider:', prov);
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: prov,
		options: {
			redirectTo: window.location.origin + '/auth',
		},
	});

	if (error) console.log(error);
};

watchEffect(async () => {
	await userStore.setUser();

	if (userStore.user) {
		if (userStore.club) {
			router.push('/club/clubindex');
		} else {
			router.push('/signup');
		}
	}
});
</script>

<style scoped>
/* 스타일을 여기에 추가하세요 */
</style>
