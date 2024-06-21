<template>
	<div id="SignupPage" class="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
		<div class="w-full max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md text-gray-800">
			<h2 class="text-center text-2xl font-semibold mb-6">Sign Up</h2>

			<div class="flex items-center justify-center mb-6">
				<div v-if="user" class="flex items-center text-gray-800">
					<img
						class="rounded-full h-12 w-12 object-cover"
						:src="user.identities[0].identity_data.avatar_url"
					/>
					<div class="ml-3 font-semibold text-lg">
						{{ user.identities[0].identity_data.full_name }}
					</div>
				</div>
			</div>

			<form @submit.prevent="submitForm" class="space-y-4">
				<div v-if="user">
					<label for="nickname" class="block text-sm font-medium text-gray-700">Nickname</label>
					<input
						v-model="form.nickname"
						id="nickname"
						type="text"
						:placeholder="user.identities[0].identity_data.full_name"
						class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					/>
				</div>
				<div>
					<label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
					<select
						v-model="form.gender"
						id="gender"
						class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					>
						<option value="">Select gender</option>
						<option value="남성">남성</option>
						<option value="여성">여성</option>
					</select>
				</div>
				<div>
					<label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
					<input
						v-model="form.startDate"
						id="startDate"
						type="date"
						class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					/>
				</div>
				<div>
					<label for="clubId" class="block text-sm font-medium text-gray-700">Club</label>
					<select
						v-model="form.clubId"
						id="clubId"
						class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					>
						<option value="">Select a club</option>
						<option v-for="club in clubs" :key="club.id" :value="club.id">
							{{ club.name }}
						</option>
					</select>
					<div v-if="selectedClub" class="flex justify-center mt-4">
						<img :src="selectedClub.logoUrl" alt="Club Logo" class="w-16 h-16 rounded-full" />
					</div>
				</div>
				<button
					type="submit"
					class="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Submit
				</button>
			</form>
		</div>
	</div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const form = ref({
	id: '',
	startDate: '',
	clubId: '',
	gender: '',
	nickname: '', // 닉네임 필드 추가
});

const clubs = ref([]);

const fetchClubs = async () => {
	try {
		const response = await fetch('/api/club/getClubInfo');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		console.log('Fetched clubs:', data); // 데이터를 확인하는 로그 추가
		if (Array.isArray(data)) {
			clubs.value = data;
		} else {
			throw new Error('Fetched data is not an array');
		}
	} catch (error) {
		console.error('Error fetching clubs:', error);
	}
};

const selectedClub = computed(() => {
	if (Array.isArray(clubs.value)) {
		return clubs.value.find((club) => club.id === form.value.clubId);
	}
	return null;
});

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
		}
	}
});

onMounted(async () => {
	await fetchClubs();

	if (user.value) {
		form.value.id = user.value.id;
		form.value.nickname = user.identities[0].identity_data.full_name; // 기본 닉네임 설정

		const userExists = await checkUserExists(user.value.id);
		if (userExists) {
			router.push('/club/clubindex');
		}
	}

	const today = new Date().toISOString().split('T')[0];
	form.value.startDate = today;
});

const submitForm = async () => {
	try {
		const response = await fetch('/api/user/saveUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: form.value.id,
				startDate: form.value.startDate,
				clubId: form.value.clubId,
				gender: form.value.gender,
				nickname: form.value.nickname, // 닉네임 필드 추가
			}),
		});
		const data = await response.json();

		if (response.ok) {
			router.push('/club/clubindex');
		} else {
			console.error(data.error);
		}
	} catch (error) {
		console.error('An error occurred:', error);
	}
};
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
