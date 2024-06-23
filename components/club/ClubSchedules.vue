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
					:class="{
						'bg-green-500 text-white': hasScheduleOnDate(date),
						'bg-blue-500 text-white': isParticipatingOnDate(date),
					}"
					class="inline-block w-8 h-8 leading-8 rounded-full cursor-pointer"
				>
					{{ date }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	schedules: {
		type: Array,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	participants: {
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

const hasScheduleOnDate = (date) => {
	const checkDate = new Date(currentYear.value, currentMonth.value, date);
	return props.schedules.some((schedule) => {
		const scheduleDate = new Date(schedule.date);
		return (
			scheduleDate.getFullYear() === checkDate.getFullYear() &&
			scheduleDate.getMonth() === checkDate.getMonth() &&
			scheduleDate.getDate() === checkDate.getDate()
		);
	});
};

const isParticipatingOnDate = (date) => {
	const checkDate = new Date(currentYear.value, currentMonth.value, date);
	return props.schedules.some((schedule) => {
		const scheduleDate = new Date(schedule.date);
		return (
			scheduleDate.getFullYear() === checkDate.getFullYear() &&
			scheduleDate.getMonth() === checkDate.getMonth() &&
			scheduleDate.getDate() === checkDate.getDate() &&
			props.participants.some(
				(participant) => participant.scheduleId === schedule.id && participant.userId === props.userId
			)
		);
	});
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
	max-width: 500px;
	margin: 0 auto;
	background: #fff;
	padding: 1rem;
	border-radius: 0.5rem;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}
</style>
