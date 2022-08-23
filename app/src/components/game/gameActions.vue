<template>
  <div class="game-actions">
    <div class="columns is-mobile" v-if="rubbishItem.health > 0">
      <div class="column">
        <button
          class="action-button action-button--blue"
          @click="emitActionChoice('cut')"
        >
          Cut
        </button>
      </div>
      <div class="column">
        <button
          class="action-button action-button--orange"
          @click="emitActionChoice('squash')"
        >
          Squash
        </button>
      </div>
    </div>
    <div class="columns is-mobile" v-if="rubbishItem.health > 0">
      <div class="column">
        <button
          class="action-button action-button--green"
          @click="emitActionChoice('clean')"
        >
          Clean
        </button>
      </div>
      <div class="column">
        <button
          class="action-button action-button--purple"
          @click="emitActionChoice('grab')"
        >
          Grab
        </button>
      </div>
    </div>
    <div class="columns is-mobile" v-if="rubbishItem.health <= 0">
      <div class="column">
        <button
          class="action-button action-button--yellow"
          @click="emitActionChoice('recycling')"
        >
          Recycling
        </button>
      </div>
      <div class="column">
        <button
          class="action-button action-button--green"
          @click="emitActionChoice('organics')"
        >
          Organics
        </button>
      </div>
      <div class="column">
        <button
          class="action-button action-button--red"
          @click="emitActionChoice('general')"
        >
          General
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useEventsBus from "../../utils/EventBus";
import { rubbish, useStore } from "../../store";
import { computed } from "vue";

const { emit } = useEventsBus();
const store = useStore();

function emitActionChoice(choice: string) {
  emit("playerAction", choice);
}

let rubbishItem = computed<rubbish>(() => store.state.rubbishItems[0]);
</script>

<script lang="ts">
export default {
  name: "gameActions",
};
</script>

<style lang="scss">
.action-button {
  padding: 1.25rem 0;
  border-radius: 1rem;
  outline: none;
  border: none;
  font-family: "Silkscreen";
  width: 100px;
  background-color: var(--light-purple);
  color: white;
  position: relative;
  margin-top:0;
  border-bottom: 8px solid var(--dark-purple);
  transition: all 0.3s ease;

  &:hover,
  &:active {
    border-bottom: 1px solid var(--dark-purple);
    margin-top: 7px;
    transition: all 0.3s ease;
  }

  // &--green {
  //   background-color: #3ae374;
  //   color: white;
  // }

  // &--red {
  //   background-color: #ff3838;
  //   color: white;
  // }

  // &--orange {
  //   background-color: #ff9f1a;
  //   color: white;
  // }

  // &--blue {
  //   background-color: #0652dd;
  //   color: white;
  // }

  // &--purple {
  //   background-color: #c56cf0;
  //   color: white;
  // }

  // &--pink {
  //   background-color: #ef5777;
  //   color: white;
  // }
  // &--yellow {
  //   background-color: #ffd32a;
  //   color: white;
  // }
}

.column {
  display: flex !important;
  justify-content: center;
}
</style>
