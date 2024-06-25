<script setup>
import PersonalLayout from "~/layouts/InfoLayout.vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();
const router = useRouter();

watchEffect(async () => {
    if (!userStore.user) {
        await userStore.setUser();
    }

    if (!userStore.user) {
        router.push("/auth");
    }
});
</script>

<template>
    <PersonalLayout>
        <div class="flex flex-col items-center space-y-4">
            <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
                <div v-if="userStore.user" class="space-y-2">
                    <div class="flex items-center space-x-4">
                        <img
                            v-if="userStore.nawauser.iconUrl"
                            :src="userStore.nawauser.iconUrl"
                            alt="프로필 사진"
                            class="h-12 w-12 rounded-full"
                        />
                        <div>
                            <p class="text-lg font-semibold">
                                {{ userStore.nawauser.nickname }}
                            </p>
                            <p class="text-gray-600">{{ userStore.nawauser.gender }}</p>
                        </div>
                    </div>

                    <div v-if="userStore.club" class="mt-4">
                        <h3 class="text-m font-semibold mb-2">소속 클럽 정보</h3>
                        <p class="text-gray-600">클럽 이름: {{ userStore.club.name }} {{}}</p>
                        <!-- 추가적인 클럽 정보 표시 -->
                    </div>

                    <!-- <div v-if="userStore.allSchedules.length > 0" class="mt-4">
                        <h3 class="text-lg font-semibold mb-2">일정이 있는 경기</h3>
                        <ul class="list-disc list-inside">
                            <li v-for="schedule in userStore.allSchedules" :key="schedule.id">
                                일정: {{ userStore.allSchedules.date }}, {{ userStore.allSchedules.location }}
                            </li>
                        </ul>
                    </div> -->
                </div>

                <div v-else>
                    <p>Loading user information...</p>
                </div>
            </div>

            <button
                @click="userStore.isLogoutOverlay = true"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
                <Icon class="mr-2" name="material-symbols:person" size="19" color="#ffffff"></Icon>
                <span class="text-sm font-semibold">로그아웃</span>
            </button>
        </div>

        <Modal
            :class="[
                'max-h-[100vh] transition-all duration-200',
                {
                    'ease-in visible': userStore.isLogoutOverlay,
                    'ease-out invisible': !userStore.isLogoutOverlay,
                },
            ]"
        />
    </PersonalLayout>
</template>

<style scoped>
/* 추가적인 스타일링을 원하시면 여기에 작성하세요 */
</style>
