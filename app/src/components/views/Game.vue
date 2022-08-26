<template>
  <div class="game">
    <div class="game-welcome" v-if="currentGameState === 'welcome'">
      <div class="columns">
        <div class="column">
          <h1 class="is-brand is-white is-text-center">Rubbish Wranglers</h1>
        </div>
        <div class="column">
          <p class="is-white is-brand">High Score: {{ currentHighScore }}</p>
        </div>
        <div class="column">
          <button class="button is-circle is-big-icon" @click="startGame">
            <font-awesome-icon icon="fa-solid fa-play"></font-awesome-icon>
          </button>
        </div>
      </div>
    </div>
    <div
      class="game-body"
      v-if="currentGameState === 'playing' || currentGameState === 'bossBattle'"
    >
      <game-header></game-header>
      <div class="game-canvas-container">
        <div class="game-canvas-content">
          <canvas class="game-canvas" ref="gameCanvas"></canvas>
        </div>
        <div class="game-canvas-background">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              ref="gameBackground"
              fill="#FF0066"
              d="M26.4,-43.2C39.6,-38.2,59.3,-41.9,72.6,-36.2C86,-30.4,92.9,-15.2,87.2,-3.3C81.4,8.6,63,17.1,54.1,30.6C45.2,44,45.8,62.3,38.4,69.3C31,76.3,15.5,71.9,3.5,65.9C-8.5,59.8,-17,52,-23.8,44.7C-30.6,37.4,-35.8,30.5,-45.5,23.1C-55.2,15.7,-69.5,7.9,-75.3,-3.4C-81.2,-14.6,-78.5,-29.2,-71,-40.4C-63.5,-51.7,-51.3,-59.6,-38.6,-65C-26,-70.3,-13,-73,-3.2,-67.5C6.6,-62,13.3,-48.2,26.4,-43.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>
      <div class="game-actions" ref="gameButtons">
        <game-actions></game-actions>
      </div>
    </div>
    <div class="game-goodbye" v-if="currentGameState === 'finished'">
      <div class="columns">
        <div class="column">
          <h1 class="is-white is-brand is-text-center">Thanks for playing!</h1>
        </div>
        <div class="column">
          <p class="is-brand is-white">High Score: {{ currentHighScore }}</p>
        </div>
        <div class="column">
          <button class="action-button action-button--red" @click="startGame">
            Again
          </button>
        </div>
        <div class="column">
          <button
            class="action-button action-button--red"
            @click="toggleIsPlaying"
          >
            Home
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
const gameButtons = ref<HTMLDivElement | null>(null);
const gameBackground = ref<SVGPathElement | null>(null);

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
  complimentaryColor: "#bcbcbc",
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

const cardboardBox: rubbish = {
  name: "Cardboard Box",
  images: [
    //full assembled box
    "cardboardBox-0.png",
    // crushed box
    "cardboardBox-1.png",
  ],
  location: "focus",
  type: "cardboard",
  bin: "recycling",
  flavorText:
    "Cardboard boxes are a very environmental way to package goods, as long as they're sustainably sourced.",
  health: 100,
  score: 40,
  actionsCount: 1,
  baseImage: 0,
  complimentaryColor: "#ffc694",
  actions: [
    {
      name: "squash",
      healthEffect: 100,
      text: "Squashing the cardboard down makes it nice and compact for recycling",
      validImages: [
        {
          image: 1,
          condition: "squash",
        },
      ],
    },
  ],
};

const foodScraps: rubbish = {
  name: "Banana Peel",
  images: [
    //full assembled box
    "bananaScraps-0.png",
  ],
  location: "focus",
  type: "food",
  bin: "organics",
  flavorText: "Food scraps make excellent compost",
  health: 100,
  score: 15,
  actionsCount: 0,
  baseImage: 0,
  complimentaryColor: "#f7dd89",
  actions: [],
};

const newRubbishBoss: rubbishBoss = {
  name: "Quisquilia",
  score: 300,
  health: 100,
  segments: [
    {
      instance: "boss",
      image: "rubbishBoss-0.png",
      position: [68, 156],
    },
    {
      instance: JSON.parse(JSON.stringify(plasticBottle)),
      image: "rubbishBoss-bottle.png",
      position: [270, 193],
    },
    {
      instance: JSON.parse(JSON.stringify(foodScraps)),
      image: "rubbishBoss-scraps.png",
      position: [-12, 200],
    },
    {
      instance: JSON.parse(JSON.stringify(cardboardBox)),
      image: "rubbishBoss-box.png",
      position: [61, 280],
    },
  ],
};

// functions required for playing
async function processPlayerAction(action: any) {
  action = action[0];

  // check if the game is currently in a boss state. if yes, the rules change a bit
  if (store.state.gameState === "bossBattle") {
    //TODO
  }

  // first check if the action is throwing away. If yes, check that the right choice
  // was made
  if (action === "recycling" || action === "organics" || action === "general") {
    if (rubbishItem.value.bin === action) {
      store.commit("removeFirstRubbishItem");
      navigator.vibrate([100, 20, 50, 20, 200]);
      return;
    } else {
      navigator.vibrate([100, 20, 100]);
      store.commit("endGame");
      gameButtons.value?.classList.add("hurt");
      setInterval(() => {
        gameButtons.value?.classList.remove("hurt");
      }, 400);
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
        gameImage.value = await getSprite(
          rubbishItem.value.images[validImage.image]
        );
      } else if (
        !validImage.condition.includes("!") &&
        rubbishItem.value.actions.findIndex(
          (item) => item.name === validImage.condition
        ) !== -1
      ) {
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
    gameCanvas.value?.classList.add("hurt");
    setInterval(() => {
      gameCanvas.value?.classList.remove("hurt");
    }, 400);
  } else {
    navigator.vibrate([100, 20, 100]);
    store.commit("endGame");
    gameButtons.value?.classList.add("hurt");
    setInterval(() => {
      gameButtons.value?.classList.remove("hurt");
    }, 400);
  }
}

function startGame() {
  store.commit("resetGame");
  store.commit("createRubbishItem", JSON.parse(JSON.stringify(foodScraps)));
  store.commit("createRubbishItem", JSON.parse(JSON.stringify(cardboardBox)));
  store.commit("createRubbishItem", JSON.parse(JSON.stringify(plasticBottle)));
  // store.commit("createRubbishBoss", JSON.parse(JSON.stringify(newRubbishBoss)));
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
        }
      }
      if (store.state.gameState === "bossBattle") {
        console.log("its happening!");

        let boss = currentRubbishBoss.value;

        for (let segment of boss.segments) {
          let sprite = await getSprite(segment.image);

          context.drawImage(
            sprite,
            segment.position[0] * newRatio,
            segment.position[1] * newRatio
          );
        }

        // draw the boss images in the correct place. This is more complex
      }
      // if not boss battle, draw the gameImage as necessary
      else if (gameImage.value) {
        context.drawImage(gameImage.value, 0, 0);
        gameBackground.value?.setAttribute(
          "fill",
          rubbishItem.value.complimentaryColor
        );
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
  overflow-x: hidden;
  background-color: #111215;
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

.game-canvas,
.game-actions {
  &.hurt {
    animation: hurtAnimation 0.4s;
  }
}

.game-canvas-container {
  position: relative;
}

.game-canvas-content {
  margin-bottom: 10px;
  animation: bounce 4s infinite;
  z-index: 1;
  position: relative;
}

.game-canvas-background {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  animation: bounce 4s 0.5s infinite;
}

@keyframes bounce {
  0% {
    margin-bottom: 10px;
    margin-top: 0;
  }
  50% {
    margin-bottom: 0;
    margin-top: 10px;
  }
  100% {
    margin-bottom: 10px;
    margin-top: 0;
  }
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
