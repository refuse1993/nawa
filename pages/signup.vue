<template>
	<div id="SignupPage" class="w-full h-[100vh] h-screen pt-32 flex flex-col items-center justify-center">
		<div class="w-full max-w-[350px] mx-auto px-2 text-black">
			<div class="text-center mb-6 mt-4">Sign Up</div>

			<div class="flex flex-col items-center">
				<img :src="userImage" alt="User Image" class="w-24 h-24 rounded-full mb-4 object-cover" />
				<div class="text-gray-700 mb-4">{{ form.id }}</div>
			</div>

			<form @submit.prevent="submitForm" class="flex flex-col gap-4">
				<div>
					<label for="startDate" class="block text-gray-700">Start Date</label>
					<input
						v-model="form.startDate"
						id="startDate"
						type="date"
						class="w-full border rounded px-2 py-1"
					/>
				</div>
				<div>
					<label for="clubId" class="block text-gray-700">Club</label>
					<select v-model="form.clubId" id="clubId" class="w-full border rounded px-2 py-1">
						<option value="">Select a club</option>
						<option v-for="club in clubs" :key="club.id" :value="club.id">
							{{ club.name }}
						</option>
					</select>
					<div v-if="selectedClub">
						<img :src="selectedClub.logoUrl" alt="Club Logo" class="w-16 h-16 rounded-full mt-4 mx-auto" />
					</div>
				</div>
				<button type="submit" class="w-full bg-blue-500 text-white rounded py-2">Submit</button>
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
});
const userImage = ref('/github-logo.png');
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
	} else {
		console.log('No user is logged in');
	}
});

onMounted(async () => {
	await fetchClubs();

	if (user.value) {
		form.value.id = user.value.id;

		const { data, error } = await client.from('profiles').select('avatar_url').eq('id', user.value.id).single();

		if (error) {
			console.error(error);
		} else {
			userImage.value = data.avatar_url || '/github-logo.png';
		}

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
/* 스타일을 여기에 추가하세요 */
</style>
