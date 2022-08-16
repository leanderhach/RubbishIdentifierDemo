<template>
  <div class="game">
    <div class="game-welcome" v-if="currentGameState === 'welcome'">
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
    <game-play v-if="currentGameState === 'playing'"></game-play>
    <div class="game-goodbye" v-if="currentGameState === 'finished'">
      <div class="columns">
        <div class="column">
          <h1>Thanks for playing!</h1>
          <p>High Score: {{ currentHighScore }}</p>
        </div>
        <div class="column">
          <button class="button is-link" @click="startGame">Again?</button>
        </div>
        <div class="column">
          <button class="button is-danger" @click="toggleIsPlaying">
            Back to Scanner
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { action, rubbish, useStore } from "../../store";
import { ref, onMounted, computed, watch } from "vue";
import gamePlay from "../game/gamePlay.vue";
import useEventsBus from "../../utils/EventBus";

const store = useStore();
const { bus } = useEventsBus();

let currentGameState = computed(() => store.state.gameState);

const demoRubbish = {
  name: "Plastic Bottle",
  image: "/rubbish/plastic-bottle.png",
  type: "plastic",
  bin: "recycling",
  flavorText:
    "the vaunted plastic bottle. Found in every home in the country, this sucker needs to be handled with extreme care",
  health: 100,
  score: 70,
  actions: [
    {
      name: "squash",
      healthEffect: 50,
      text: "Cleaning the bottle makes in easier to recycle",
    },
    {
      name: "twist",
      healthEffect: 25,
      text: "Removing the cap makes the bottle recyclable",
    },
    {
      name: "remove",
      healthEffect: 25,
      text: "Labels aren't recyclable",
    },
  ],
};

// functions required for playing
function processPlayerAction(action: any) {
  action = action[0];

  // first check if the action is throwing away. If yes, check that the right choice
  // was made
  if (action === "recycling" || action === "organics" || action === "general") {
    if (rubbishItem.value.bin === action && rubbishItem.value.health <= 0) {
      console.log("Congrats! that was the right choice");
      store.commit("removeFirstRubbishItem");
      return;
    } else {
      console.log("wtaf are you doing");
      return;
    }
  }

  // check if the action used exists in the valid actions array
  let isCorrectAction = rubbishItem.value.actions.find(
    (item: action) =>
      item.name.toLocaleLowerCase() === action.toLocaleLowerCase()
  );

  // if the action chosen exists on the item that is being fought
  if (isCorrectAction) {
    rubbishItem.value.health -= isCorrectAction.healthEffect;
    rubbishItem.value.actions.splice(
      rubbishItem.value.actions.indexOf(isCorrectAction),
      1
    );
  } else {
    console.log("Nope!");
  }
}

function startGame() {
  store.commit("createRubbishItem", JSON.parse(JSON.stringify(demoRubbish)));
  store.commit("setGameState", "playing");
}

function toggleIsPlaying() {
  store.commit("setIsPlaying", false);
}
// watcher for player actions
watch(
  () => bus.value.get("playerAction"),
  async (val) => {
    await processPlayerAction(val);
    const [playerAction] = val ?? [];
    bus.value.get("playerAction").value = playerAction;
  }
);

// computed variables from the store
let rubbishItem = computed<rubbish>((): rubbish => {
  return store.state.rubbishItems[0];
});

let currentHighScore = computed<number>((): number => {
  return store.state.currentHighScore;
});

onMounted(() => {
  store.commit("setGameState", "welcome");
});
</script>

<script lang="ts">
export default {
  name: "gameView",
};
</script>

<style lang="scss">
.game {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.game-welcome,
.game-goodbye {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>