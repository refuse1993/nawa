<template>
	<div class="member-card p-2 flex flex-col items-center">
		<img :src="iconUrl" alt="Member Icon" class="w-16 h-16 rounded-full object-cover" />
		<p class="mt-2 text-sm">{{ nickname }}</p>
	</div>
</template>

<script setup>
defineProps({
	id: {
		type: Number,
		required: true,
	},
	nickname: {
		type: String,
		required: true,
	},
	iconUrl: {
		type: String,
		required: true,
	},
});
</script>

<style scoped>
.member-card {
	width: 80px;
}
</style>
