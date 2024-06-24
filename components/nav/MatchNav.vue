<template>
    <div class="ml-2 mt-1 h-[30px] text-lg font-sans font-semibold flex justify-between items-center">
        <span>전적</span>
        <!-- 전적 추가 버튼 -->
        <button
            @click="openModal"
            class="text-slate-600 bg-white w-4 h-4 mr-3 rounded-full shadow-md flex items-center justify-center"
        >
            <Icon name="ep:plus" />
        </button>

        <!-- 전적 추가 모달 -->
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
