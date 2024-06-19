<template>
	<div class="calendar w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-4">
		<div class="flex justify-between items-center mb-4">
			<button @click="prevMonth" class="text-gray-600 hover:text-gray-800">&lt;</button>
			<h2 class="text-lg font-semibold">{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
			<button @click="nextMonth" class="text-gray-600 hover:text-gray-800">&gt;</button>
		</div>
		<div class="grid grid-cols-7 gap-2 text-center text-gray-700">
			<div v-for="day in days" :key="day" class="font-semibold">{{ day }}</div>
			<div v-for="blank in blanks" :key="blank" class="text-gray-300">-</div>
			<div v-for="date in dates" :key="date" class="relative">
				<span
					:class="{ 'bg-blue-500 text-white': hasEvents(date) }"
					class="inline-block w-8 h-8 leading-8 rounded-full cursor-pointer"
				>
					{{ date }}
				</span>
				<div v-if="hasEvents(date)" class="absolute top-full left-0 right-0 mt-1 p-1 bg-blue-200 rounded-md">
					<div v-for="event in getEvents(date)" :key="event.id" class="text-xs text-blue-800">
						{{ event.location }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	events: {
		type: Array,
		required: true,
	},
});

const current = ref(new Date());

const days = ['일', '월', '화', '수', '목', '금', '토'];
const currentYear = computed(() => current.value.getFullYear());
const currentMonth = computed(() => current.value.getMonth());

const startOfMonth = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay());
const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate());

const blanks = computed(() => Array(startOfMonth.value).fill(''));
const dates = computed(() => Array.from({ length: daysInMonth.value }, (_, i) => i + 1));

const hasEvents = (date) => {
	return props.events.some(
		(event) =>
			new Date(event.date).getFullYear() === currentYear.value &&
			new Date(event.date).getMonth() === currentMonth.value &&
			new Date(event.date).getDate() === date
	);
};

const getEvents = (date) => {
	return props.events.filter(
		(event) =>
			new Date(event.date).getFullYear() === currentYear.value &&
			new Date(event.date).getMonth() === currentMonth.value &&
			new Date(event.date).getDate() === date
	);
};

const prevMonth = () => {
	current.value = new Date(currentYear.value, currentMonth.value - 1, 1);
};

const nextMonth = () => {
	current.value = new Date(currentYear.value, currentMonth.value + 1, 1);
};
</script>

<style scoped>
.calendar {
	max-width: 700px;
	margin: 0 auto;
	background: #fff;
	padding: 1rem;
	border-radius: 0.5rem;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}
</style>
