<template>
    <div id="BottomNav" class="fixed z-50 bottom-0 flex w-full h-[50px] border-t border-t-gray-700 bg-black font-sans">
        <div class="w-full max-w-[500px] mx-auto flex items-center justify-around">
            <button
                @click="setActiveTab('club', '/club/clubindex')"
                class="w-full h-full flex flex-col items-center justify-center"
            >
                <Icon
                    :name="activeTab === 'club' ? 'material-symbols:home' : 'material-symbols:home-outline'"
                    :color="activeTab === 'club' ? '#ffeb3b' : '#ffffff'"
                    size="23"
                ></Icon>
                <div :class="activeTab === 'club' ? 'text-yellow-300' : 'text-gray-100'" class="leading-3 text-xs">
                    클럽
                </div>
            </button>
            <button
                @click="setActiveTab('schedule', '/schedule')"
                class="w-full h-full flex flex-col items-center justify-center"
            >
                <Icon
                    :name="
                        activeTab === 'schedule'
                            ? 'material-symbols:calendar-today'
                            : 'material-symbols:calendar-today-outline'
                    "
                    :color="activeTab === 'schedule' ? '#ffeb3b' : '#ffffff'"
                    size="18"
                    class="mb-1"
                ></Icon>
                <div :class="activeTab === 'schedule' ? 'text-yellow-300' : 'text-gray-100'" class="leading-3 text-xs">
                    일정
                </div>
            </button>
            <button
                @click="setActiveTab('records', '/matches')"
                class="w-full h-full flex flex-col items-center justify-center"
            >
                <Icon
                    :name="activeTab === 'records' ? 'ri:align-item-bottom-fill' : 'ri:align-item-bottom-line'"
                    :color="activeTab === 'records' ? '#ffeb3b' : '#ffffff'"
                    size="19"
                    class="mb-1"
                ></Icon>
                <div
                    :class="activeTab === 'records' ? 'text-yellow-300' : 'text-gray-100'"
                    class="leading-3 text-xs px-8"
                >
                    전적
                </div>
            </button>
            <button
                @click="setActiveTab('other', '/myinfo')"
                class="w-full h-full flex flex-col items-center justify-center"
            >
                <Icon
                    :name="activeTab === 'other' ? 'material-symbols:person' : 'material-symbols:person-outline'"
                    :color="activeTab === 'other' ? '#ffeb3b' : '#ffffff'"
                    size="19"
                    class="mb-1"
                ></Icon>
                <div :class="activeTab === 'other' ? 'text-yellow-300' : 'text-gray-100'" class="leading-3 text-xs">
                    내정보
                </div>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useNavigationStore } from "~/stores/navigation";

const router = useRouter();
const navigationStore = useNavigationStore();
const activeTab = computed(() => navigationStore.activeTab);

function setActiveTab(tab, path) {
    navigationStore.setActiveTab(tab);
    router.push(path);
}
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
