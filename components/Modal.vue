<template>
	<div
		id="Modal"
		class="fixed grid place-items-center h-screen z-50 bottom-0 bg-black bg-opacity-50 backdrop-blur-md h-screen w-full"
	>
		<div class="bg-black w-full max-w-[300px] rounded-lg text-white border border-gray-600 p-2">
			<button
				@click="userStore.isLogoutOverlay = false"
				class="flex items-center justify-between bg-black w-full p-3"
			>
				<div>Close</div>
				<Icon name="mdi:close" size="25" />
			</button>
			<div class="border-b border-b-gray-700 my-1" />
			<button @click="logout()" class="flex items-center justify-between bg-black w-full p-3">
				<div>Log Out</div>
				<Icon name="ph:sign-out" size="25" />
			</button>
			<button @click="deleteAccount()" class="flex items-center justify-between bg-black w-full p-3">
				<div>회원탈퇴</div>
				<Icon name="ph:sign-out" size="25" />
			</button>
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const client = useSupabaseClient();
const router = useRouter();

const logout = async () => {
	await client.auth.signOut();
	nextTick(() => {
		userStore.isLogoutOverlay = false;
		router.push('/auth');
	});
};

const deleteAccount = async () => {
	if (!userStore.user) {
		console.error('No user is logged in');
		return;
	}

	const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
	if (!confirmation) {
		return;
	}

	try {
		const response = await fetch('/api/user/deleteUser', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId: userStore.user.id }),
		});

		if (response.ok) {
			console.log('User deleted successfully');
			await client.auth.signOut();
			userStore.isLogoutOverlay = false;
			router.push('/auth');
		} else {
			const data = await response.json();
			console.error('Error deleting user:', data.error);
		}
	} catch (error) {
		console.error('An error occurred:', error);
	}
};
</script>
