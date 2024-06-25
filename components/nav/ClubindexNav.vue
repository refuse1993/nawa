<template>
	<div class="border-b mt-1 h-[35px] text-lg font-sans font-semibold flex justify-between items-center">
		<div class="ml-2">클럽</div>
	</div>
	<!-- <div class="flex justify-end items-center bg-white shadow overflow-hidden">
        <div class="flex justify-end items-end w-1/2 mb-1 mr-2">
            <div
                class="flex-grow flex justify-center items-center cursor-pointer font-sans ml-2"
                :class="{ 'bg-opacity-20': activeTab === 'club' }"
                @click="setActiveTab('club')"
            >
                <div
                    class="text-xs p-1 justify-center flex rounded-xl w-10"
                    :class="{
                        'font-semibold bg-black text-white': activeTab === 'club',
                        'text-gray-500 border-gray-500 border': activeTab !== 'club',
                    }"
                >
                    클럽
                </div>
            </div>
            <div
                class="flex-grow flex justify-center items-center cursor-pointer font-sans ml-2"
                :class="{ 'bg-opacity-10': activeTab === 'schedule' }"
                @click="setActiveTab('schedule')"
            >
                <div
                    class="text-xs p-1 justify-center flex rounded-xl w-10"
                    :class="{
                        'font-semibold bg-black text-white': activeTab === 'schedule',
                        'text-gray-500 border-gray-500 border': activeTab !== 'schedule',
                    }"
                >
                    일정
                </div>
            </div>
            <div
                class="flex-grow flex justify-center items-center cursor-pointer font-sans ml-2"
                :class="{ 'bg-opacity-10': activeTab === 'records' }"
                @click="setActiveTab('records')"
            >
                <div
                    class="text-xs p-1 justify-center flex rounded-xl w-10"
                    :class="{
                        'font-semibold bg-black text-white': activeTab === 'records',
                        'text-gray-500 border-gray-500 border': activeTab !== 'records',
                    }"
                >
                    전적
                </div>
            </div>
            <div
                class="flex-grow flex justify-center items-center cursor-pointer font-sans ml-2"
                :class="{ 'bg-opacity-10': activeTab === 'other' }"
                @click="setActiveTab('other')"
            >
                <div
                    class="text-xs p-1 justify-center flex rounded-xl w-10"
                    :class="{
                        'font-semibold bg-black text-white': activeTab === 'other',
                        'text-gray-500 border-gray-500 border': activeTab !== 'other',
                    }"
                >
                    멤버
                </div>
            </div>
        </div>
    </div> -->
</template>

<script setup></script>
