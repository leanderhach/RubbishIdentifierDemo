<template>
  <div class="game-header">
    <div class="game-header__name">{{ rubbishItem.name }}</div>
    <div class="health-bar">
      <progress
        class="progress is-success"
        :value="rubbishItem.health"
        max="100"
      ></progress>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { rubbish, useStore } from "../../store";
import { computed } from "@vue/runtime-core";

const store = useStore();
let rubbishItem = computed<rubbish>((): rubbish => {
  return store.state.rubbishItems[0];
});
</script>

<script lang="ts">
export default {
  name: "gameHeader",
};
</script>

<style lang="scss">
.game-header {
  display: flex;
  flex-direction: column;
  padding: 2rem;

  &__name {
    font-weight: bold;
    font-family: "Silkscreen";
    color: var(--red);
    font-size: 1.25rem;
    text-align: center;
    margin-bottom: 1rem;
  }
}
</style>
