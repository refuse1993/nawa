<template>
    <div class="flex items-center justify-center min-h-screen bg-white bg-opacity-50">
        <div class="flex flex-col items-center">
            <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        </div>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const checkUserExists = async (userId) => {
    // commit test
    try {
        const response = await fetch(`/api/user/checkUser?userId=${userId}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error("Error checking user:", error);
        return false;
    }
};

watchEffect(async () => {
    if (user.value) {
        console.log("User is logged in:", user.value);
        const userExists = await checkUserExists(user.value.id);
        if (userExists) {
            navigateTo("/club/clubindex");
        } else {
            navigateTo("/auth");
        }
    } else {
        navigateTo("/auth");
    }
});
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
