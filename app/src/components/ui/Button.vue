<template>
  <button class="button"></button>
</template>

<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {},
});
</script>

<style scoped lang="scss">
.button {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  background-color: #27ae60;
  color: white;
  position: absolute;
  top: 30px;
  right: 30px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: bold;
  font-weight: 1.25rem;
}
</style>
