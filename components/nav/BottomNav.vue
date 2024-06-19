<script setup lang="ts"></script>

<template>
    <div>
        <div id="BottomNav" class="fixed z-50 bottom-0 flex w-full h-[70px] border-t border-t-gray-700 bg-black">
            <div class="flex w-full max-w-[500px] mx-auto flex items-center justify-around">
                <button @click="navigateTo('/')" class="w-full h-full">
                    <Icon name="material-symbols:home-outline" size="35" color="#ffffff" />
                </button>
                <button @click="navigateTo('/')" class="w-full h-full">
                    <Icon class="mb-1" name="material-symbols:edit-square-outline-rounded" size="32" color="#ffffff" />
                </button>
                <button @click="navigateTo('/')" class="w-full h-full">
                    <Icon class="mb-1" name="ph:sign-out" size="32" color="#ffffff" />
                </button>
            </div>
        </div>
    </div>
</template>
