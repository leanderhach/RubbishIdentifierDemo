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
import { computed, onMounted } from "@vue/runtime-core";
import { useStore } from "./store";

const store = useStore();

const isPlayingGame = computed<boolean>(() => store.state.isPlaying);

onMounted(() => {
  window.addEventListener("load", function () {
    setTimeout(function () {
      // This hides the address bar:
      window.scrollTo(0, 1);
    }, 0);
  });
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap");
@import "~bulma";
@import url("https://fonts.googleapis.com/css2?family=Rubik+Dirt&family=Silkscreen&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap");

body,
html,
main {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

:root {
  --background-color: #f1d893;
  --dark-purple: #51167f;
  --light-purple: #86399e;
  --red: #ed5b75;
  --green: #61b0a5;
  --black: #060c10;
}

#app {
  margin: 0;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--black);
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

h1 {
  font-size: 2rem;
}

h1,
h2,
h3,
p {
  &.is-brand {
    font-family: "Silkscreen";
  }

  &.is-white {
    color: white;
  }
}

.is-text-center {
  text-align: center;
}

.button {
  &.is-circle {
    border-radius: 50%;
  }

  &.is-big-icon {
    font-size: 1rem;
    height: 4rem;
    width: 4rem;
  }
}
</style>
