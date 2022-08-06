<template>
  <Suspense>
    <video-feed />
  </Suspense>
  <interactable-overlay />
</template>

<script lang="ts" setup>
import VideoFeed from "./components/VideoFeed.vue";
import InteractableOverlay from "./components/InteractableOverlay.vue";
</script>

<style lang="scss">
body, html {
  margin:0;
  padding:0;
  height:100%;
  width:100%;
}
#app {
  margin:0;
  width:100%;
  height:100%;
  position:relative;
}
</style>
