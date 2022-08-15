<template>
  <main>
    <template v-if="!isPlayingGame">
      <Suspense>
        <video-feed />
      </Suspense>
      <interactable-overlay />
    </template>
    <game-view v-if="isPlayingGame" />
  </main>
</template>

<script lang="ts" setup>
import VideoFeed from "./components/scanner/VideoFeed.vue";
import InteractableOverlay from "./components/scanner/InteractableOverlay.vue";
import gameView from "./components/views/Game.vue";
import { computed } from "@vue/runtime-core";
import { useStore } from "./store";

const store = useStore();

const isPlayingGame = computed<boolean>(() => store.state.isPlaying);
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap");
@import "~bulma";
@import url("https://fonts.googleapis.com/css2?family=Silkscreen&display=swap");

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
