<template>
	<div class="container mx-auto p-4">
		<h1 class="text-4xl font-bold mb-8">Club Members</h1>
		<div
			v-for="member in members"
			:key="member.id"
			class="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center"
		>
			<img :src="member.iconUrl || '/default-icon.png'" alt="User Icon" class="w-16 h-16 rounded-full mr-4" />
			<div>
				<h2 class="text-2xl font-semibold">{{ member.nickname }}</h2>
				<p class="text-gray-600">Gender: {{ member.gender }}</p>
				<p class="text-gray-600">Score: {{ member.activityScore }}</p>
				<p class="text-gray-600">Tennis Days: {{ tennisDays(member.startDate) }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
const user = useSupabaseUser();
const members = ref([]);

const fetchMembers = async (userId) => {
	const response = await fetch(`/api/club/getMembers?userId=${userId}`);
	const data = await response.json();
	members.value = data;
};

const tennisDays = (startDate) => {
	const start = new Date(startDate);
	const today = new Date();
	const diffTime = Math.abs(today - start);
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

onMounted(() => {
	if (user.value) {
		fetchMembers(user.value.id);
	}
});
</script>

<style scoped>
.container {
	max-width: 800px;
	margin: 0 auto;
}
</style>
