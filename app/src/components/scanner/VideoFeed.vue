<template>
  <video
    ref="video"
    autoplay
    muted
    playsinline
    :width="windowWidth"
    :height="windowHeight"
    :srcObject="stream"
  ></video>
  <canvas ref="canvas"></canvas>
  <img ref="photo" src="" alt="" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import axios from "axios";
import useEventsBus from "../../utils/EventBus";

const { bus } = useEventsBus();
const { emit } = useEventsBus();

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

watch(
  () => bus.value.get("justTookAPhoto"),
  async (val) => {
    await takePicture();
    const [sidebarCollapsedBus] = val ?? [];
    bus.value.get("justTookAPhoto").value = sidebarCollapsedBus;
  }
);

watch(
  () => bus.value.get("resetCamera"),
  async (val) => {
    video.value?.play();
    const [sidebarCollapsedBus] = val ?? [];
    bus.value.get("resetCamera").value = sidebarCollapsedBus;
  }
);

let stream = null;
const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const photo = ref<HTMLImageElement | null>(null);

async function getStream() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "environment" },
    });
  } catch (e: any) {
    console.log("Rejected!", e);
  }
}

async function takePicture() {
  if (canvas.value !== null) {
    const context = canvas.value.getContext("2d");

    if (
      context &&
      video.value &&
      video.value.videoWidth &&
      video.value.videoHeight
    ) {
      canvas.value.width = video.value.videoWidth;
      canvas.value.height = video.value.videoHeight;
      context.drawImage(
        video.value,
        0,
        0,
        video.value.videoWidth,
        video.value.videoHeight
      );

      const imageData = canvas.value
        .toDataURL("image/png")
        .replace(/^data:image\/[a-z]+;base64,/, "");

      const data = {
        requests: [
          {
            features: [
              {
                type: "LABEL_DETECTION",
              },
            ],
            image: {
              content: imageData,
            },
          },
        ],
      };

      video.value.pause();

      const label = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VUE_APP_GOOGLE_API_KEY}`,
        data
      );

      console.log(label);

      if (label.data) {
        emit("returnedLabelData", label.data);
      }
    }
  }
}

await getStream();
</script>

<script lang="ts">
export default {
  name: "VideoFeed",
};
</script>

<style lang="scss" scoped>
canvas {
  display: none;
}
</style>
