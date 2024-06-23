<template>
	<MainLayout>
		<div class="min-h-screen bg-gray-100 mt-2">
			<ClubMembers />
		</div>
	</MainLayout>
</template>

<script setup>
import MainLayout from '~/layouts/MainLayout.vue';
import ClubMembers from '~/components/club/ClubMembers.vue';
</script>

<style scoped>
/* 추가 스타일 */
</style>
