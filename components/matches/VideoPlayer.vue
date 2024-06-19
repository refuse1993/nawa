<template>
    <div>
        <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered" controls></video>
    </div>
</template>

<script setup>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

const props = defineProps({
    src: {
        type: String,
        required: true,
    },
});

const videoPlayer = ref(null);

onMounted(() => {
    const player = videojs(videoPlayer.value, {
        techOrder: ["youtube"],
        sources: [{ type: "video/youtube", src: props.src }],
        youtube: { ytControls: 2 },
    });

    player.on("ready", () => {
        player.play();
    });
});

watch(
    () => props.src,
    (newSrc) => {
        if (videoPlayer.value) {
            const player = videojs(videoPlayer.value);
            player.src({ type: "video/youtube", src: newSrc });
            player.play();
        }
    }
);
</script>

<style scoped>
.video-js {
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    margin-top: 16px;
}
</style>
