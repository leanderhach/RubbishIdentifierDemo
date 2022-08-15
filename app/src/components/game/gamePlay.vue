<template>
  <div class="game-play">
    <game-header></game-header>
    <game-body></game-body>
    <game-actions></game-actions>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "../../store";
import gameHeader from "../game/gameHeader.vue";
import gameBody from "../game/gameBody.vue";
import gameActions from "../game/gameActions.vue";

const store = useStore();
</script>

<script>
export default {
  name: "gamePlay",
};
</script>

<style lang="scss">
.game-play {
}
</style>
