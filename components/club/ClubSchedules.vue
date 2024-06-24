<template>
	<div class="calendar w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-2">
		<div class="flex justify-between items-center mb-2">
			<button @click="prevMonth" class="text-gray-600 hover:text-gray-800 text-sm">&lt;</button>
			<h2 class="text-md font-semibold">{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
			<button @click="nextMonth" class="text-gray-600 hover:text-gray-800 text-sm">&gt;</button>
		</div>
		<div class="grid grid-cols-7 gap-1 text-center text-gray-700">
			<div v-for="day in days" :key="day" class="font-semibold text-xs">{{ day }}</div>
			<div v-for="blank in blanks" :key="blank" class="text-gray-300 text-xs">-</div>
			<div v-for="date in dates" :key="date" class="relative">
				<span
					:class="[
						'inline-block w-6 h-6 leading-6 rounded-full cursor-pointer text-xs',
						hasScheduleOnDate(date) ? 'bg-green-500 text-white' : '',
						isParticipatingOnDate(date) ? 'bg-blue-500 text-white' : '',
					]"
				>
					{{ date }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
import { ref, computed } from 'vue';

const props = defineProps({
	schedules: {
		type: Array,
		required: true,
	},
	participants: {
		type: Array,
		required: true,
	},
});

const userStore = useUserStore();
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
				(participant) => participant.scheduleId === schedule.id && participant.userId === userStore.user?.id
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
	max-width: 400px;
	margin: 0 auto;
	background: #fff;
	padding: 0.5rem;
	border-radius: 0.5rem;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}
</style>
