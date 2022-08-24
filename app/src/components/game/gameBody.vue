<template>
  <div class="game-body">
    <img :src="rubbishImage" alt="" class="image" />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "../../store";
import { computed } from "vue";

const store = useStore();

let rubbishImage = computed(() => store.state.rubbishItems[0].image);
</script>

<script lang="ts">
export default {
  name: "gameBody",
};
</script>

<style lang="scss"></style>
