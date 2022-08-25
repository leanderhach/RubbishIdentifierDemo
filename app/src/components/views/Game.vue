<template>
  <div class="game">
    <div class="game-welcome" v-if="currentGameState === 'welcome'">
      <div class="columns">
        <div class="column">
          <h1 class="is-brand is-white">Rubbish Wranglers</h1>
        </div>
        <div class="column">
          <p class="is-white">High Score: {{ currentHighScore }}</p>
        </div>
        <div class="column">
          <button class="button is-circle is-big-icon" @click="startGame">
            <font-awesome-icon icon="fa-solid fa-play"></font-awesome-icon>
          </button>
        </div>
      </div>
    </div>
    <div class="game-body" v-if="currentGameState === 'playing'">
      <game-header></game-header>
      <canvas class="game-canvas" ref="gameCanvas"></canvas>
      <game-actions></game-actions>
    </div>
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
import { action, rubbish, rubbishBoss, useStore } from "../../store";
import { ref, onMounted, computed, watch } from "vue";
import gamePlay from "../game/gamePlay.vue";
import useEventsBus from "../../utils/EventBus";

import gameHeader from "../game/gameHeader.vue";
import gameActions from "../game/gameActions.vue";
import { isTypeParameter } from "@babel/types";

const store = useStore();
const { bus } = useEventsBus();
const gameCanvas = ref<HTMLCanvasElement | null>(null);

let loadedImages = Array<HTMLImageElement>();
let currentGameState = computed(() => store.state.gameState);

let gameImage = ref<HTMLImageElement>();

const plasticBottle: rubbish = {
  name: "Plastic Bottle",
  images: [
    //clean bottle with cap
    "plasticBottle-0.png",
    // dirty bottle, no cap
    "plasticBottle-1.png",
    // clean bottle, no cap
    "plasticBottle-2.png",
    //dirty bottle with cap
    "plasticBottle-3.png",
  ],
  location: "focus",
  type: "plastic",
  bin: "recycling",
  flavorText:
    "the vaunted plastic bottle. Found in every home in the country, this sucker needs to be handled with extreme care",
  health: 100,
  score: 70,
  actionsCount: 2,
  baseImage: 3,
  actions: [
    {
      name: "clean",
      healthEffect: 50,
      text: "Cleaning the bottle makes in easier to recycle",
      validImages: [
        {
          image: 0,
          condition: "remove",
        },
        {
          image: 2,
          condition: "!remove",
        },
      ],
    },
    {
      name: "remove",
      healthEffect: 50,
      text: "Removing the cap makes the bottle recyclable",
      validImages: [
        {
          image: 1,
          condition: "clean",
        },
        {
          image: 2,
          condition: "!clean",
        },
      ],
    },
  ],
};

// const foodScraps: rubbish = {
//   name: "Food Scraps",
//   image: "/rubbish/plastic-bottle.png",
//   location: "focus",
//   type: "plastic",
//   bin: "recycling",
//   flavorText:
//     "the vaunted plastic bottle. Found in every home in the country, this sucker needs to be handled with extreme care",
//   health: 100,
//   score: 70,
//   actions: [
//     {
//       name: "squash",
//       healthEffect: 50,
//       text: "Cleaning the bottle makes in easier to recycle",
//     },
//     {
//       name: "clean",
//       healthEffect: 50,
//       text: "Removing the cap makes the bottle recyclable",
//     },
//   ],
// };

// let demoRubbishBoss: rubbishBoss = {
//   name: "Boss 1",
//   segments: [
//     {
//       name: "Left Arm",
//       type: "paper",
//       bin: "recycling",
//       image: "/bosses/boss1/left_arm.png",
//       location: [100, 60],
//       flavorText:
//         "the vaunted plastic bottle. Found in every home in the country, this sucker needs to be handled with extreme care",
//       health: 100,
//       score: 70,
//       actions: [
//         {
//           name: "squash",
//           healthEffect: 50,
//           text: "Cleaning the bottle makes in easier to recycle",
//         },
//         {
//           name: "clean",
//           healthEffect: 50,
//           text: "Removing the cap makes the bottle recyclable",
//         },
//       ],
//     },
//   ],
// };

// functions required for playing
async function processPlayerAction(action: any) {
  action = action[0];

  // first check if the action is throwing away. If yes, check that the right choice
  // was made
  if (action === "recycling" || action === "organics" || action === "general") {
    if (rubbishItem.value.bin === action && rubbishItem.value.health <= 0) {
      console.log("Congrats! that was the right choice");
      store.commit("removeFirstRubbishItem");
      navigator.vibrate([100, 20, 50, 20, 200]);
      return;
    } else {
      console.log("wtaf are you doing");
      navigator.vibrate([100, 20, 100]);
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

    // check every action, check if the images are valid, then display them
    // iterate through the actions still on the object
    // iterate through the valid images array of the action
    for (let validImage of isCorrectAction.validImages) {
      // check the content of the validator
      if (
        validImage.condition.includes("!") &&
        rubbishItem.value.actions.findIndex(
          (item) => item.name === validImage.condition.substring(1)
        ) === -1
      ) {
        console.log("its a negation");
        gameImage.value = await getSprite(
          rubbishItem.value.images[validImage.image]
        );
      } else if (
        !validImage.condition.includes("!") &&
        rubbishItem.value.actions.findIndex(
          (item) => item.name === validImage.condition
        ) !== -1
      ) {
        console.log("its not a negation");
        console.log(validImage.image);
        gameImage.value = await getSprite(
          rubbishItem.value.images[validImage.image]
        );
      }
    }

    rubbishItem.value.actions.splice(
      rubbishItem.value.actions.indexOf(isCorrectAction),
      1
    );
    navigator.vibrate([100]);
  } else {
    navigator.vibrate([100, 20, 100]);
    console.log("Nope!");
  }
}

function startGame() {
  // store.commit("createRubbishItem", JSON.parse(JSON.stringify(foodScraps)));
  store.commit("createRubbishItem", JSON.parse(JSON.stringify(plasticBottle)));
  store.commit("setGameState", "playing");
  store.commit("setCurrentHighScore", 0);
}

async function drawGame() {
  // run infinite loop to continously draw the right image to the screen
  const baseHeight = 540;
  const baseWidth = 390;

  const screenWidth = window.innerWidth;
  const newRatio = screenWidth / baseWidth;

  let adjustedHeight = baseHeight * newRatio;
  let adjustedWidth = baseWidth * newRatio;

  if (gameCanvas.value) {
    const context = gameCanvas.value.getContext("2d");

    if (context) {
      context.canvas.width = adjustedWidth;
      context.canvas.height = adjustedHeight;

      // check that the current game state is playing
      if (store.state.gameState === "playing") {
        // get the current rubbish item
        let item = rubbishItem.value;

        // if the actionsCount matches actions length, it means
        // the user hasn't made any moves. Draw the baseImage
        if (item.actionsCount === item.actions.length) {
          gameImage.value = await getSprite(item.images[item.baseImage]);
        } else {
          // check every action, check if the images are valid, then display them
          // iterate through the actions still on the object
          // for (let action of item.actions) {
          //   console.log(action.name);
          //   // iterate through the valid images array of the action
          //   for (let validImage of action.validImages) {
          //     console.log(validImage.condition);
          //     // check the content of the validator
          //     if (
          //       validImage.condition.includes("!") &&
          //       item.actions.findIndex(
          //         (item) => item.name === validImage.condition.substring(1)
          //       ) === -1
          //     ) {
          //       gameImage.value = await getSprite(
          //         item.images[validImage.image]
          //       );
          //     }
          //   }
          // }
        }
      }
      if (store.state.gameState === "bossBattle") {
        //TOD
      }

      //finally, draw the frame
      if (gameImage.value) {
        context.drawImage(gameImage.value, 0, 0);
      }
    }
  }

  window.requestAnimationFrame(drawGame);
}

async function getSprite(file: string) {
  let img = new Image();
  img.src = `/rubbish/${file}`;

  await img.decode();
  return img;
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

let currentRubbishBoss = computed<rubbishBoss>((): rubbishBoss => {
  return store.state.rubbishBosses[0];
});

let currentHighScore = computed<number>((): number => {
  return store.state.currentHighScore;
});

onMounted(() => {
  drawGame();
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

.game-body {
  // animation: hurtAnimation 0.6s infinite;
}

@keyframes hurtAnimation {
  0% {
    filter: none;
  }
  25% {
    filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg)
      saturate(600%) contrast(0.8);
  }
  50% {
    filter: none;
  }
  75% {
    filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg)
      saturate(600%) contrast(0.8);
  }
  100% {
    filter: none;
  }
}
</style>
