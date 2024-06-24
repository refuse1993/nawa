<script setup>
import PersonalLayout from "~/layouts/InfoLayout.vue";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
</script>

<template>
    <PersonalLayout>
        <div>MY Info</div>
        <div class="absolute bottom-14 right-4 flex items-center bg-gradient-to-r">
            <button
                @click="userStore.isLogoutOverlay = true"
                class="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
                <Icon class="mr-2" name="material-symbols:person" size="19" color="#ffffff"></Icon>
                <span class="text-sm font-semibold">로그아웃</span>
            </button>
        </div>
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
