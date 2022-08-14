<template>
  <main>
    <!-- <Suspense>
          <video-feed />
        </Suspense>
        <interactable-overlay /> -->
    <Game />
  </main>
</template>

<script lang="ts" setup>
import VideoFeed from "./components/scanner/VideoFeed.vue";
import InteractableOverlay from "./components/scanner/InteractableOverlay.vue";
import Game from "./components/views/Game.vue";
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap");
@import "~bulma";

body,
html,
main {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app {
  margin: 0;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
