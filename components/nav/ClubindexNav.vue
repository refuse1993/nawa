<template>
    <div class="mt-1 h-[50px] text-lg font-sans border-b font-semibold flex justify-between items-center">
        <div class="ml-2">클럽</div>
        <button
            @click="openModal"
            class="text-slate-600 bg-white w-4 h-4 mr-3 rounded-full shadow-md flex items-center justify-center"
        >
            <Icon name="ep:plus" />
        </button>

        <!-- 클럽 생성 모달 -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-80">
                <div class="text-sm font-semibold mb-4">클럽 생성</div>
                <form @submit.prevent="createClub">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">클럽 이름</label>
                        <input
                            type="text"
                            v-model="clubName"
                            class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">클럽 로고</label>
                        <input
                            ref="file"
                            type="file"
                            @change="onChange"
                            class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            accept=".jpg,.jpeg,.png"
                        />
                        <div v-if="fileDisplay" class="mt-2">
                            <img :src="fileDisplay" alt="클럽 로고" class="w-32 h-32 rounded-lg mx-auto" />
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">소개</label>
                        <textarea
                            v-model="description"
                            class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        ></textarea>
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
                            생성
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
import { v4 as uuidv4 } from "uuid";

const userStore = useUserStore();
const supabase = useSupabaseClient();
const router = useRouter();

const showModal = ref(false);
const clubName = ref("");
const description = ref("");
const file = ref(null);
const fileDisplay = ref(null);
const isLoading = ref(false);
const successMessage = ref("");

const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    clearData();
};

const clearData = () => {
    clubName.value = "";
    description.value = "";
    file.value = null;
    fileDisplay.value = null;
    successMessage.value = "";
};

const onChange = () => {
    fileDisplay.value = URL.createObjectURL(file.value.files[0]);
};

const createClub = async () => {
    isLoading.value = true;

    let logoUrl = "";
    if (file.value) {
        const { data, error } = await supabase.storage
            .from("main-files")
            .upload(`${uuidv4()}.jpg`, file.value.files[0]);
        if (error) {
            console.log(error);
            isLoading.value = false;
            return;
        }
        logoUrl = data.path;
    }

    try {
        const response = await fetch("/api/club/createClub", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                representativeId: userId,
                creationDate: new Date().toISOString(),
                name: clubName.value,
                logoUrl: logoUrl,
                description: description.value,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            clearData();
            successMessage.value = "신규 클럽 개설이 완료되었습니다!";
            await userStore.fetchClub();
            setTimeout(() => {
                closeModal();
                router.push("/");
            }, 2000);
        } else {
            console.log(result.error);
        }
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
#CreateClub {
    animation: fadeIn 0.3s;
}
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
