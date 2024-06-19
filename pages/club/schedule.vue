<template>
	<MainLayout>
		<div class="min-h-screen bg-gray-100 p-4">
			<Calendar :events="events" />
			<div class="mt-8">
				<h2 class="text-xl font-semibold mb-4">Schedules</h2>
				<div v-for="schedule in schedules" :key="schedule.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
					<h3 class="text-lg font-semibold">
						{{ new Date(schedule.date).toLocaleDateString() }} - {{ schedule.location }}
					</h3>
					<p>{{ schedule.description }}</p>
				</div>
			</div>
		</div>
	</MainLayout>
</template>

<script setup>
import MainLayout from '~/layouts/MainLayout.vue';
import Calendar from '@/components/club/ClubSchedules.vue';

const user = useSupabaseUser();
const events = ref([]);
const schedules = ref([]);

const fetchSchedules = async (userId) => {
	const response = await fetch('/api/club/getSchedules', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	});
	const data = await response.json();
	events.value = data;
	schedules.value = data;
};

onMounted(async () => {
	if (user.value) {
		await fetchSchedules(user.value.id);
	}
});
</script>

<style scoped>
/* Add additional styles if necessary */
</style>
