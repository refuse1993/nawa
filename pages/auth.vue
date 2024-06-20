<template>
    <div id="AuthPage" class="w-full h-[100vh] h-screen pt-32 flex flex-col items-center justify-center">
        <div class="w-full flex flex-col items-center justify-center gap-2.5 p-2">
            <h1 class="italic text-xl font-semibold">Nawa !!</h1>
        </div>

        <div class="max-w-[350px] mx-auto px-2 text-black flex flex-col items-center justify-center h-[50vh]">
            <div class="text-center mb-6 mt-4">Login / Register</div>

            <button @click="login('kakao')" class="w-full max-w-[300px] flex items-center justify-center">
                <img class="w-full rounded-full" src="/kakao_login_medium_wide.png" />
            </button>
        </div>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const isLoading = ref(true);

const checkUserExists = async (userId) => {
    try {
        const response = await fetch(`/api/user/checkUser?userId=${userId}`);
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error("Error checking user:", error);
        return false;
    }
};

// Auth 상태 변화를 감지하고 처리
supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        const userExists = await checkUserExists(session.user.id);
        if (userExists) {
            router.push("/club/clubindex");
        } else {
            router.push("/signup");
        }
    } else {
        console.log("No user is logged in");
    }
    isLoading.value = false;
});

// 페이지 로드 시 로그인 상태 확인
watchEffect(async () => {
    if (user.value) {
        console.log("User is logged in:", user.value);
        const userExists = await checkUserExists(user.value.id);
        if (userExists) {
            router.push("/club/clubindex");
        } else {
            router.push("/signup");
        }
    } else {
        console.log("No user is logged in");
    }
    isLoading.value = false;
});

const login = async (prov) => {
    console.log("Login provider:", prov);
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: prov,
        options: {
            redirectTo: window.location.origin + "/auth",
        },
    });

    if (error) console.log(error);
};
</script>

<style scoped>
/* 스타일을 여기에 추가하세요 */
</style>
