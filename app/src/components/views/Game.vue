<template>
  <div class="game">
    <game-welcome v-if="currentGameState === 'welcome'"></game-welcome>
    <game-play v-if="currentGameState === 'playing'"></game-play>
    <!-- <game-goodbye v-if="currentGameState === 'finished'"></game-goodbye> -->
  </div>
</template>

<script setup>
import { useStore } from "../../store";
import { ref, onMounted, computed } from "vue";
import gameWelcome from "../game/gameWelcome.vue";
import gamePlay from "../game/gamePlay.vue";

const store = useStore();

let currentGameState = computed(() => store.state.gameState);

onMounted(() => {
  store.commit("setGameState", "welcome");
});
</script>

<script>
export default {
  name: "Game",
};
</script>

<style lang="scss">
.game {
  height: 100%;
  width: 100%;
}
</style>
