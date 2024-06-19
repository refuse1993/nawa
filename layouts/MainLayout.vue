<template>
    <div id="MainLayout" class="h-screen">
        <div class="w-full max-w-[500px] mx-auto">
            <div id="TopMenu" class="w-full flex items-center justify-center px-2 h-10 my-2">
                <HeaderNav />
            </div>
        </div>

        <div class="flex w-full max-w-[500px] mx-auto h-screen">
            <slot />
        </div>
        <BottomNav />
    </div>
</template>

<script lang="ts" setup>
import BottomNavVue from "~/components/nav/BottomNav.vue";
import HeaderNavVue from "~/components/nav/HeaderNav.vue";
</script>

<style></style>
