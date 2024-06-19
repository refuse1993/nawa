<template>
    <div class="tabs" id="HeaderNav">
        <div class="item" :class="{ 'item--checked': tab === 'club' }" @click="tab = 'club'">
            <div class="text">클럽</div>
            <div class="checked" v-if="tab === 'club'"></div>
        </div>
        <div class="item" :class="{ 'item--checked': tab === 'schedule' }" @click="tab = 'schedule'">
            <div class="text">클럽 일정</div>
        </div>
        <div class="item" :class="{ 'item--checked': tab === 'record' }" @click="tab = 'record'">
            <div class="text">클럽 전적</div>
        </div>
        <div class="item" :class="{ 'item--checked': tab === 'unknown' }" @click="tab = 'unknown'">
            <div class="text">???</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const tab = ref("club");
</script>

<style scoped>
.tabs {
    @apply w-88 h-10 shadow-md flex justify-start items-center gap-4 px-4 overflow-hidden bg-white;
}
.item {
    @apply flex-grow h-10 flex flex-col justify-center items-center overflow-hidden;
}
.text {
    @apply flex-shrink-0 self-stretch h-5 overflow-hidden whitespace-nowrap overflow-ellipsis font-sans text-base leading-5;
}
.checked {
    @apply absolute w-11 h-1 rounded-full bg-blue-600;
}
.item--checked .text {
    @apply text-gray-800 font-semibold;
}
.item:not(.item--checked) .text {
    @apply text-gray-600 font-normal;
}
</style>
