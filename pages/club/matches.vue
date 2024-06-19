<script setup>
import MainLayout from '~/layouts/MainLayout.vue';
import MatchDetails from '~/components/club/MatchDetails.vue';
</script>

<template>
	<MainLayout>
		<div class="min-h-screen bg-gray-100 p-4">
			<h1 class="text-4xl font-bold mb-8">Club Matches</h1>
			<MatchDetails />
		</div>
	</MainLayout>
</template>
