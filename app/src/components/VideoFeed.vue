<template>
  <video ref="video" autoplay :srcObject="stream"></video>
</template>

<script lang="ts" setup>
import { ref } from "vue";

let stream = null;
const video = ref<HTMLVideoElement | null>(null);

async function getStream() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (e: any) {
    console.log("Rejected!", e);
  }
}

// async function quickstart() {
//     console.log('starting vision ai link');
//   // Performs label detection on the image file
//     let picToCheck = this.image.dataUrl.replace(/^data:image\/[a-z]+;base64,/, "");
//     const data = {
//     "requests" : [{
//         "features": [{
//         "type": "LABEL_DETECTION"
//         }],
//         "image": {
//         "content": this.picToCheck
//         }
//     }]
//     }
//     axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`, data)
// }

await getStream();
// await quickstart();
</script>

<script lang="ts">
export default {
  name: "VideoFeed",
};
</script>
