<template>
    <div class="mt-1 h-[50px] text-lg font-sans border-b font-semibold flex justify-between items-center">
        <div class="ml-2">일정</div>
        <!-- 일정 생성 버튼 -->
        <button
            @click="openModal"
            class="text-slate-600 bg-white w-4 h-4 mr-3 rounded-full shadow-md flex items-center justify-center"
        >
            <Icon name="ep:plus" />
        </button>

        <!-- 일정 생성 모달 -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-80">
                <div class="text-sm font-semibold mb-4">일정 등록</div>
                <form @submit.prevent="createSchedule">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">날짜</label>
                        <input
                            type="date"
                            v-model="scheduleDate"
                            class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">시간</label>
                        <input
                            type="time"
                            v-model="scheduleTime"
                            class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">장소</label>
                        <input
                            type="text"
                            v-model="scheduleLocation"
                            class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div class="flex justify-end text-xs">
                        <button
                            @click="closeModal"
                            type="button"
                            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                        >
                            취소
                        </button>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            등록
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();

const showModal = ref(false);
const scheduleDate = ref("");
const scheduleTime = ref("");
const scheduleLocation = ref("");

const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const createSchedule = async () => {
    try {
        const dateTime = new Date(`${scheduleDate.value}T${scheduleTime.value}`);
        const response = await fetch("/api/schedule/createSchedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: dateTime,
                location: scheduleLocation.value,
                creatorId: userStore.user.id, // userStore는 global store에서 가져와야 합니다.
            }),
        });
        const result = await response.json();
        if (result.success) {
            emit("scheduleCreated"); // 이벤트 발생
            closeModal(); // 모달 닫기
        } else {
            console.error("Failed to create schedule:", result.error);
        }
    } catch (error) {
        console.error("Error creating schedule:", error);
    }
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
