<template>
  <div class="game-welcome">
    <div class="columns">
        <div class="column">
            <h1>Rubbish Wranglers</h1>
            <p>High Score: {{ currentHighScore }}</p>
        </div>
        <div class="column">
            <button class="button is-link" @click="startGame">Lets Play!</button>
        </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from "vue";
import { useStore } from '../../store';

const store = useStore();

let currentHighScore = store.state.currentHighScore;

function startGame() {
    store.commit("setGameState", "playing");
}

</script>

<script>
export default {
  name: "gameWelcome",
};
</script>

<style lang="scss">
.game-welcome {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
