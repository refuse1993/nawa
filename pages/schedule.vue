<template>
    <MainLayout>
        <div class="min-h-screen mt-2">
            <div v-if="isLoading" class="flex justify-center items-center h-full">
                <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            </div>
            <div v-else>
                <!-- 일정 삭제 확인 모달 -->
                <div
                    v-if="showDeleteModal"
                    class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                >
                    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
                        <div class="text-sm font-semibold mb-4">일정 삭제</div>
                        <p class="mb-4">이 일정을 삭제하시겠습니까?</p>
                        <div class="flex justify-end text-xs">
                            <button
                                @click="closeDeleteModal"
                                type="button"
                                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                            >
                                취소
                            </button>
                            <button
                                @click="deleteSchedule"
                                type="button"
                                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>

                <schedulenav :openModal="openModal" />

                <!-- 일정 생성/수정 모달 -->
                <div
                    v-if="showModal"
                    class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                >
                    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
                        <div class="text-sm font-semibold mb-4">{{ isEditMode ? "일정 수정" : "일정 등록" }}</div>
                        <form @submit.prevent="saveSchedule">
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
                                <button
                                    type="submit"
                                    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    {{ isEditMode ? "수정" : "등록" }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <Calendar
                    v-if="userStore.user"
                    :schedules="schedules"
                    :userId="userStore.user.id"
                    :participants="participants"
                    @refresh="fetchSchedules"
                />
                <div class="flex justify-between items-center border-b mt-2 w-full">
                    <div class="text-slate-800 ml-2 text-xs mb-1 font-semibold">일정 상세</div>
                </div>

                <div class="mt-2" v-if="userStore.user">
                    <div v-for="schedule in schedules" :key="schedule.id" class="bg-white p-0.5 border-b mt-2">
                        <!-- 시간 및 장소를 일렬로 배치 -->
                        <div class="flex justify-between items-center ml-2 mr-2">
                            <div class="flex-1">
                                <div class="text-xs font-semibold">{{ formatDateTime(schedule.date) }}</div>
                            </div>
                            <div class="flex-1 text-right mb-1 italic font-semibold">
                                <div class="text-sm">{{ schedule.location }}</div>
                            </div>
                            <div class="flex mb-1 ml-2 items-center justify-center">
                                <button
                                    @click="() => openModal(schedule)"
                                    class="text-blue-500 w-4 h-4 flex items-center justify-center"
                                >
                                    <Icon name="ep:edit" />
                                </button>
                                <button
                                    @click="confirmDeleteSchedule(schedule.id)"
                                    class="text-red-500 w-4 h-4 flex items-center justify-center ml-2"
                                >
                                    <Icon name="ep:close-bold" />
                                </button>
                            </div>
                        </div>

                        <!-- 아래 공간을 반으로 나누어 왼쪽에 참가자 목록 -->
                        <div class="flex">
                            <div class="w-2/3 pl-2">
                                <div class="text-lg font-sans font-semibold ml-2">
                                    참석 인원 : {{ getParticipants(schedule.id).length }}
                                </div>
                                <button @click="toggleParticipants(schedule.id)" class="text-xs hover:underline mt-2">
                                    <span v-if="expandedParticipants.includes(schedule.id)">
                                        <div class="text-xs p-0.5 bg-red-700 w-[100px] rounded-xl text-white">
                                            <div class="flex justify-center font-semibold">참석자 접기</div>
                                        </div>
                                    </span>
                                    <span v-else>
                                        <div class="text-xs p-0.5 bg-slate-400 w-[100px] rounded-xl text-white">
                                            <div class="flex justify-center font-semibold">참석자 보기</div>
                                        </div>
                                    </span>
                                </button>
                                <ul
                                    v-if="expandedParticipants.includes(schedule.id)"
                                    class="mt-2 text-sm text-gray-700"
                                >
                                    <li v-for="participant in getParticipants(schedule.id)" :key="participant.id">
                                        <img
                                            :src="participant.iconUrl || '/user.png'"
                                            class="w-5 h-5 shadow-md rounded-full inline"
                                        />
                                        {{ participant.nickname || participant.name }}
                                    </li>
                                </ul>
                            </div>
                            <!-- 오른쪽 공간을 위 아래로 나누어 참석 여부와 경기 등록 버튼 배치 -->
                            <div class="w-1/3 pl-2 mr-1 mb-2 ml-6 flex flex-col justify-center">
                                <button
                                    @click="toggleParticipation(schedule.id)"
                                    class="mb-0.5 text-xs p-0.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4624] focus:ring-offset-2 transition-all duration-150 ease-in-out"
                                    :class="
                                        isParticipating(schedule.id)
                                            ? 'bg-[#ec4624] text-white hover:bg-[#ec4624]'
                                            : 'bg-[#434d61] text-white hover:bg-[#434d61]'
                                    "
                                >
                                    {{ isParticipating(schedule.id) ? "참석 취소" : "참석" }}
                                </button>
                                <button
                                    @click="navigateToMatchRegistration(schedule.id)"
                                    class="mb-0.5 text-xs p-0.5 rounded-lg bg-[#434d61] text-white hover:bg-[#434d61] focus:outline-none focus:ring-2 focus:ring-[#434d61] focus:ring-offset-2 transition-all duration-150 ease-in-out"
                                >
                                    경기 결과 등록
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>가입된 클럽이 없습니다.</p>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import MainLayout from "~/layouts/ScheduleLayout.vue";
import Calendar from "~/components/club/ClubSchedules.vue";

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

const schedules = ref([]);
const participants = ref([]);
const isLoading = ref(true);
const expandedParticipants = ref([]);
const showModal = ref(false); // 모달 상태
const isEditMode = ref(false);
const scheduleDate = ref("");
const scheduleTime = ref("");
const scheduleLocation = ref("");
const currentScheduleId = ref(null);
const showDeleteModal = ref(false); // 삭제 확인 모달 상태
const scheduleToDelete = ref(null);

const fetchSchedules = async (userId) => {
    try {
        const response = await fetch("/api/club/getSchedules", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        if (data.error) {
            console.error("Failed to fetch schedules:", data.error);
            schedules.value = [];
        } else {
            schedules.value = data;
        }
    } catch (error) {
        console.error("Failed to fetch schedules:", error);
    }
};

const fetchParticipants = async () => {
    try {
        const response = await fetch("/api/schedule/getParticipants");
        const data = await response.json();
        if (Array.isArray(data)) {
            participants.value = data;
        } else {
            participants.value = [];
        }
    } catch (error) {
        console.error("Failed to fetch participants:", error);
    }
};

const isParticipating = (scheduleId) => {
    return participants.value.some(
        (participant) => participant.scheduleId === scheduleId && participant.userId === userStore.user.id
    );
};

const toggleParticipation = async (scheduleId) => {
    if (isParticipating(scheduleId)) {
        // 참석 취소
        await fetch("/api/schedule/leave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                scheduleId: scheduleId,
                userId: userStore.user.id,
            }),
        });
        // 참석자 목록에서 제거
        participants.value = participants.value.filter(
            (participant) => !(participant.scheduleId === scheduleId && participant.userId === userStore.user.id)
        );
    } else {
        // 참석
        await fetch("/api/schedule/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                scheduleId: scheduleId,
                userId: userStore.user.id,
                iconUrl: userStore.user.iconUrl,
            }),
        });
        // 참석자 목록에 추가
        participants.value.push({
            scheduleId: scheduleId,
            userId: userStore.user.id,
            nickname: userStore.user.nickname || userStore.user.name, // nickname이나 name 사용
            id: userStore.user.id,
            iconUrl: userStore.user.iconUrl,
        });
    }
    // 참가자 목록을 다시 불러옵니다.
    await fetchParticipants();
};

const navigateToMatchRegistration = (scheduleId) => {
    localStorage.setItem("scheduleId", scheduleId);
    router.push(`/match/${scheduleId}`);
};

const getParticipants = (scheduleId) => {
    return participants.value.filter((participant) => participant.scheduleId === scheduleId);
};

const toggleParticipants = (scheduleId) => {
    if (expandedParticipants.value.includes(scheduleId)) {
        expandedParticipants.value = expandedParticipants.value.filter((id) => id !== scheduleId);
    } else {
        expandedParticipants.value.push(scheduleId);
    }
};

const openModal = (schedule) => {
    if (schedule) {
        // 수정 모드
        isEditMode.value = true;
        scheduleDate.value = schedule.date.split("T")[0];
        scheduleTime.value = schedule.date.split("T")[1].slice(0, 5);
        scheduleLocation.value = schedule.location;
        currentScheduleId.value = schedule.id;
    }
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const saveSchedule = async () => {
    try {
        const dateTime = new Date(`${scheduleDate.value}T${scheduleTime.value}`);
        const payload = {
            date: dateTime,
            location: scheduleLocation.value,
            creatorId: userStore.user.id,
        };

        const url = isEditMode.value
            ? `/api/schedule/updateSchedule?scheduleId=${currentScheduleId.value}`
            : "/api/schedule/createSchedule";

        const method = isEditMode.value ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.success) {
            await fetchSchedules(userStore.user.id); // 일정을 새로 고침
            closeModal(); // 모달 닫기
        } else {
            console.error("Failed to save schedule:", result.error);
        }
    } catch (error) {
        console.error("Error saving schedule:", error);
    }
};

const confirmDeleteSchedule = (scheduleId) => {
    scheduleToDelete.value = scheduleId;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    scheduleToDelete.value = null;
};

const deleteSchedule = async () => {
    try {
        const response = await fetch(`/api/schedule/deleteSchedule?scheduleId=${scheduleToDelete.value}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (result.success) {
            await fetchSchedules(userStore.user.id); // 일정을 새로 고침
            closeDeleteModal(); // 삭제 모달 닫기
        } else {
            console.error("Failed to delete schedule:", result.error);
        }
    } catch (error) {
        console.error("Error deleting schedule:", error);
    }
};

// setup 내에서 즉시 실행 함수로 초기화 작업을 수행합니다.
(async () => {
    if (userStore.user) {
        await fetchSchedules(userStore.user.id);
        await fetchParticipants();
    }
    isLoading.value = false;
})();

const formatDateTime = (dateTime) => {
    const options = {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(dateTime).toLocaleString("ko-KR", options);
};
</script>

<style scoped>
.loader {
    border-color: #3490dc;
    border-top-color: transparent;
    animation: spinner 1s linear infinite;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
