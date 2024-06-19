<script setup>
import PersonalLayout from '~/layouts/PersonalLayout.vue';
import { useUserStore } from '~/stores/user';
const userStore = useUserStore();
</script>

<template>
	<PersonalLayout>
		<div>MY Info</div>
		<button @click="userStore.isLogoutOverlay = true" class="w-20 h-5">
			<Icon class="mb-1" name="material-symbols:person" size="19" color="#ffffff"></Icon>
			<div class="leading-3 text-xs text-gray-900">로그아웃</div>
		</button>
		<Modal
			:class="[
				{
					'max-h-[100vh] transition-all duration-200 ease-in visible': userStore.isLogoutOverlay,
				},
				{
					'max-h-0 transition-all duration-200 ease-out invisible': !userStore.isLogoutOverlay,
				},
			]"
		/>
	</PersonalLayout>
</template>
