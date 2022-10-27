<template>
  <main>
    <button class="play-button" @click="toggleIsPlaying">Let's Play!</button>
    <!-- <div class="organics-marker"></div> -->
    <div
      :class="['side-marker', 'recycling-marker', { active: swipedLeft }]"
    ></div>
    <div
      :class="['side-marker', 'rubbish-marker', { active: swipedRight }]"
    ></div>
    <div :class="['popup', { active: isPopupOpen }]">
      <div class="popup__header">
        <font-awesome-icon
          icon="fa-solid fa-times"
          @click="toggleAndReset"
        ></font-awesome-icon>
      </div>
      <div class="popup__title">
        <div class="popup__icon">
          <font-awesome-icon
            :icon="['fa-solid', popup.icon]"
          ></font-awesome-icon>
        </div>
        <h3>{{ popup.title }}</h3>
      </div>
      <div class="popup__text" v-html="popup.text"></div>
      <div class="popup__buttons" v-if="popup.buttons">
        <button
          v-for="(button, key) in popup.buttonContent"
          :key="key"
          class="button"
          :style="`background-color:${button.color}`"
          @click="button.click"
        >
          {{ button.text }}
        </button>
      </div>
    </div>
    <div class="menu">
      <div class="text container"></div>
      <button class="shutter" @click="takePhoto">
        <font-awesome-icon
          v-if="!hasTakenPhoto && !isLoading"
          icon="fa-solid fa-camera"
        ></font-awesome-icon>
        <font-awesome-icon
          v-if="hasTakenPhoto && !isLoading"
          icon="fa-solid fa-rotate-left"
        ></font-awesome-icon>
        <font-awesome-icon
          class="loading-spinner"
          icon="fa-solid fa-spinner"
          v-if="hasTakenPhoto && isLoading"
        ></font-awesome-icon>
      </button>
      <div class="text container"></div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import useEventsBus from "../../utils/EventBus";
import { useStore } from "@/store";

const { emit } = useEventsBus();
const { bus } = useEventsBus();
const store = useStore();

let isWasteRecyclable = ref(false);

let hasTakenPhoto = ref(false);
let isLoading = ref(false);

let isPopupOpen = ref(false);

// rubbish information storage
let rubbishName = ref("");

type Popup = {
  title: string;
  icon: string;
  text: string;
  buttons: boolean;
  buttonContent?: Array<{
    text: string;
    color: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    click: Function;
  }>;
};

let popup = ref({
  title: "That looks like a plastic bottle!",
  icon: "fa-info",
  text: "Remember, not all types of plastic can be thrown away. Do you want to try and guess which bin it goes into?",
  buttons: true,
  buttonContent: [
    {
      text: "Guess",
      color: "#05c46b",
      click: toggleGuessRubbishPopup,
    },
    {
      text: "Pass",
      color: "#ff4d4d",
      click: toggleInformBinTypePopup,
    },
  ],
});

watch(
  () => bus.value.get("returnedLabelData"),
  async (val) => {
    isLoading.value = false;
    await processLabelData(val);
    const [sidebarCollapsedBus] = val ?? [];
    bus.value.get("returnedLabelData").value = sidebarCollapsedBus;
  }
);

watch;

const takePhoto = () => {
  if (!hasTakenPhoto.value) {
    hasTakenPhoto.value = true;
    isLoading.value = true;
    emit("justTookAPhoto", true);
  } else if (hasTakenPhoto.value && !isLoading.value) {
    emit("resetCamera", true);
    hasTakenPhoto.value = false;
    togglePopup();
  } else {
    if (isPopupOpen.value) {
      togglePopup();
    }
  }
};

async function toggleGuessRubbishPopup() {
  isPopupOpen.value = false;

  popup.value = {
    title: "Take a crack at it",
    icon: "fa-question",
    text: "Which bin do you think it should go in?",
    buttons: true,
    buttonContent: [
      {
        text: "General",
        color: "#ff4d4d",
        click: userSelectedGeneral,
      },
      {
        text: "Recycle",
        color: "#ffa801",
        click: userSelectedRecycle,
      },
    ],
  };

  setTimeout(() => (isPopupOpen.value = true), 100);
}

async function toggleInformBinTypePopup() {
  userSelectedLearn();
}

async function userSelectedGeneral() {
  isPopupOpen.value = false;

  popup.value = {
    title: "You picked general",
    icon: isWasteRecyclable.value ? "fa-thumbs-down" : "fa-thumbs-down",
    text: isWasteRecyclable.value
      ? "Aw Shoot, that's the wrong bin sorry. Would you like to learn more?"
      : "Ka Pai! keep on being a responsible kiwi",
    buttons: isWasteRecyclable.value,
    buttonContent: [
      {
        text: "Learn",
        color: "#3c40c6",
        click: userSelectedLearn,
      },
      {
        text: "Reset",
        color: "#575fcf",
        click: userSelectedReset,
      },
    ],
  };

  setTimeout(() => (isPopupOpen.value = true), 100);
}

async function userSelectedRecycle() {
  isPopupOpen.value = false;

  popup.value = {
    title: "You picked recycle",
    icon: !isWasteRecyclable.value ? "fa-thumbs-down" : "fa-thumbs-down",
    text: !isWasteRecyclable.value
      ? "Aw Shoot, that's the wrong bin sorry. Would you like to learn more?"
      : "Ka Pai! keep on being a responsible kiwi",
    buttons: !isWasteRecyclable.value,
    buttonContent: [
      {
        text: "Learn",
        color: "#3c40c6",
        click: userSelectedLearn,
      },
      {
        text: "Reset",
        color: "#575fcf",
        click: userSelectedReset,
      },
    ],
  };

  setTimeout(() => (isPopupOpen.value = true), 100);
}

function toggleIsPlaying() {
  store.commit("setIsPlaying", true);
}

function togglePopup() {
  isPopupOpen.value = !isPopupOpen.value;
}

function toggleAndReset() {
  togglePopup();
  hasTakenPhoto.value = false;
  isLoading.value = false;
}

async function userSelectedLearn() {
  isPopupOpen.value = false;

  let text = "";

  switch (rubbishName.value) {
    case "plastic bottle":
      text = `
        <p>Plastic bottles are a highly common form of packaging for liquids of all types, including water, milk, and shampoo.</p>
        <p>CCC recycling rules require the following requirements:</p>
        <br>
        <ul>
          <li>The bottle should be cleaned.</li>
          <li>The bottle should be less than 3 liters.</li>
          <li>The bottle should be of type 1, 2, or 5.</li>
          <li>The bottle cap should go in the red bin.</li>
        </ul>
      `;
      break;
    case "glass bottle":
      text = `
        <p>Glass bottles are highly durable and can be recycled and reused far more easily than plastic.</p>
        <br>
        <p>
          When recycling glass, ensure that the bottle has been cleaned and that it is still intact. Lids should still go in the red bin.
        </p>
      `;
      break;

    case "plastic container":
      text = `
        <p>
          Plastic containers are a common form of packaging for all sorts of items. Keep the following rules in mind when recycling plastic containers:
        </p>
        <br>
        <ul>
          <li>The container should be cleaned.</li>
          <li>The container should have any lid removed.</li>
          <li>The container should be less than 3 liters.</li>
          <li>Only types 1, 2, and 5 can be recycled.</li>
        </ul>
      `;
      break;

    case "aluminium can":
      text = `
        <p>Aluminium cans have some of the highest recycling rates of any recyclable material. Thanks to this, aluminium remains 
          a solid choice for packaging.  
        </p>
        <br>
        <p>
          When recycling aluminium cans, make sure not to squash them.
        </p>
      `;
      break;

    case "cardboard / paper":
      text = `
        <p>Paper and cardboard both count as some of the least environmentally impactful materials. As long as it isn't contaminated with food,
          both of these materials can be recycled with near 100% efficiency.
        </p>
        <br>
        <p>
          Again, as long as the material is clean, it can all go in the recycling bin.
        </p>
      `;
  }

  popup.value = {
    title: "Information",
    icon: "fa-info",
    text: text,
    buttons: false,
    buttonContent: [],
  };

  setTimeout(() => (isPopupOpen.value = true), 100);
}

async function userSelectedReset() {
  togglePopup();
  emit("resetCamera", true);
  hasTakenPhoto.value = false;
  isLoading.value = false;
}

function containsWord(str: string, word: string) {
  return str.match(new RegExp("\\b" + word + "\\b")) != null;
}

function processLabelData(data: any) {
  type labelAnnotation = {
    mid: string;
    description: string;
    score: number;
    topicality: number;
  };

  const recyclables = [
    "aluminium",
    "glass",
    "plastic",
    "cardboard",
    "iron",
    "tinfoil",
    "can",
    "bottle",
    "wood",
  ];
  const types = ["glass", "plastic"];
  const nonRecyclables = ["pizza"];

  let annotations: labelAnnotation[] = data[0].responses[0].labelAnnotations;

  console.log(annotations);

  // find if the item has a label with content matching a value in the recyclables list, and if it doesn't contain a word from the
  // explicitly non-recyclable list (e.g. pizza box could be listed as "cardboard" and "pizza", which is not recyclable)
  let isRecyclable = annotations.find((label) =>
    recyclables.some(
      (recyclable) =>
        containsWord(label.description.toLowerCase(), recyclable) &&
        !nonRecyclables.some((nonRecyclable) =>
          containsWord(label.description, nonRecyclable)
        )
    )
  );

  console.log(isRecyclable);

  if (isRecyclable) {
    // if the recyclable is a bottle
    if (isRecyclable.description.toLowerCase().includes("bottle")) {
      let plasticPriority = annotations.findIndex((item) =>
        item.description.toLowerCase().includes("plastic")
      );
      let glassPriority = annotations.findIndex((item) =>
        item.description.toLowerCase().includes("glass")
      );

      if (plasticPriority > glassPriority) {
        rubbishName.value = "plastic bottle";

        popup.value = {
          title: `That looks like a ${rubbishName.value}`,
          icon: "fa-info",
          text: "Plastic bottles are a very common container. Would you like to guess which bin it goes in?",
          buttons: true,
          buttonContent: [
            {
              text: "Guess",
              color: "#05c46b",
              click: toggleGuessRubbishPopup,
            },
            {
              text: "Pass",
              color: "#ff4d4d",
              click: toggleInformBinTypePopup,
            },
          ],
        };
      } else {
        rubbishName.value = "glass bottle";

        popup.value = {
          title: `That looks like a ${rubbishName.value}`,
          icon: "fa-info",
          text: "Glass is a highly durable and long-lived material. Remember that some areas will require sorting glass by color. Do you want to guess what bin it belongs in?",
          buttons: true,
          buttonContent: [
            {
              text: "Guess",
              color: "#05c46b",
              click: toggleGuessRubbishPopup,
            },
            {
              text: "Pass",
              color: "#ff4d4d",
              click: toggleInformBinTypePopup,
            },
          ],
        };
      }
    } else if (isRecyclable.description.toLowerCase().includes("plastic")) {
      rubbishName.value = "plastic container";

      popup.value = {
        title: `That looks like a ${rubbishName.value}`,
        icon: "fa-info",
        text: "Plastic containers are a commonly available and cheap form of packaging. Do you want to guess what bin it belongs in?",
        buttons: true,
        buttonContent: [
          {
            text: "Guess",
            color: "#05c46b",
            click: toggleGuessRubbishPopup,
          },
          {
            text: "Pass",
            color: "#ff4d4d",
            click: toggleInformBinTypePopup,
          },
        ],
      };
    } else if (
      isRecyclable.description.toLowerCase().includes("aluminum can")
    ) {
      rubbishName.value = "aluminium can";

      popup.value = {
        title: `That looks like an ${rubbishName.value}`,
        icon: "fa-info",
        text: "Aluminium cans are a superior alternative to plastic for packaging. Do you want to guess what bin it belongs in?",
        buttons: true,
        buttonContent: [
          {
            text: "Guess",
            color: "#05c46b",
            click: toggleGuessRubbishPopup,
          },
          {
            text: "Pass",
            color: "#ff4d4d",
            click: toggleInformBinTypePopup,
          },
        ],
      };
    } else if (
      isRecyclable.description.toLowerCase().includes("cardboard") ||
      isRecyclable.description.toLowerCase().includes("wood") ||
      isRecyclable.description.toLowerCase().includes("paper")
    ) {
      rubbishName.value = "cardboard / paper";

      popup.value = {
        title: `That looks like ${rubbishName.value}`,
        icon: "fa-info",
        text: "Paper and cardboard are cheap to produce. Do you want to guess what bin it belongs in?",
        buttons: true,
        buttonContent: [
          {
            text: "Guess",
            color: "#05c46b",
            click: toggleGuessRubbishPopup,
          },
          {
            text: "Pass",
            color: "#ff4d4d",
            click: toggleInformBinTypePopup,
          },
        ],
      };
    }
    isWasteRecyclable.value = true;
  } else {
    popup.value = {
      title: "That looks like general waste",
      icon: "fa-info",
      text: `
        <p>This item is not recyclable. you can learn more about waste mitigation at the link below:</p>
        <br>
        <a href="https://ccc.govt.nz/services/rubbish-and-recycling/yellowbin">Click Me</a>
        <br><br>
        <p>
          Reducing the amount of waste we generate, as well as making sure that the rubbish is environmentally low-impact, helps ensure the future of 
          our planet.  
        </p>
      `,
      buttons: false,
      buttonContent: [],
    };
    isWasteRecyclable.value = false;
  }

  togglePopup();
}
</script>

<script lang="ts">
export default {
  name: "InteractableOverlay",
};
</script>

<style lang="scss" scoped>
main {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.side-marker {
  height: calc(100% - 70px);
  top: 5px;
  position: absolute;
  width: 0;
}

.organics-marker {
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: green;
}

.recycling-marker {
  left: 0;
  background-color: yellow;
  transition: all 0.33s ease;

  &.active {
    transition: all 0.33s ease;
    box-shadow: 11px 5px 15px 5px yellow;
  }
}

.rubbish-marker {
  right: 0;
  background-color: red;
  transition: all 0.33s ease;

  &.active {
    transition: all 0.33s ease;
    box-shadow: -11px 5px 15px 5px #ff0000;
  }
}

.menu {
  position: absolute;
  bottom: 0;
  height: 65px;
  width: calc(100% - 20px);
  margin-left: 10px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 1rem;
  box-sizing: border-box;
  box-shadow: 1px -5px 5px 1px rgba(0, 0, 0, 0.24);
}

.shutter {
  padding: 20px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: none;
  margin-top: -32.5px;
  margin-bottom: 32.5px;
  font-size: 1rem;
  color: white;
  background: linear-gradient(
    301deg,
    rgba(245, 59, 80, 1) 0%,
    rgba(255, 211, 42, 1) 100%
  );
  box-shadow: 1px 0px 5px 5px rgba(0, 0, 0, 0.24);
}
.popup {
  position: absolute;
  bottom: -100px;
  left: 10px;
  background-color: white;
  border-radius: 15px;
  width: calc(100% - 20px);
  padding: 20px;
  padding-bottom: 45px;
  box-sizing: border-box;
  opacity: 0;
  transition: all 0.3s ease;

  &.active {
    transition: all 0.3s ease;
    opacity: 1;
    bottom: 90px;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 1.25em;
  }

  &__text {
    margin-bottom: 1em;
    padding: 0 1em;
    font-weight: 500;
  }

  &__icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #3c40c6;
    border-radius: 25px;
    color: white;
    padding: 15px 20px;
    box-shadow: 1px -3px 65px 4px rgba(0, 0, 0, 0.41);
    position: relative;
    z-index: 2;
  }

  &__title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.5em;
    font-weight: 700;

    h3 {
      font-weight: bold;
      background-color: #575fcf;
      color: white;
      padding: 5px 10px 5px 15px;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      margin-left: -10px;
      position: relative;
      z-index: 0;
    }
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}

.button {
  border: none;
  border-radius: 2em;
  color: white;
  font-weight: bold;
  padding: 1.5em 2em;
  font-family: "Montserrat";
  font-weight: 700;
}

.loading-spinner {
  animation: rotating 3s infinite linear;
}

.play-button {
  padding: 1em 2em;
  border-radius: 2em;
  border: none;
  outline: none;
  color: white;
  position: absolute;
  top: 30px;
  right: 30px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-weight: 1.5rem;
  background: linear-gradient(
    301deg,
    rgba(245, 59, 80, 1) 0%,
    rgba(255, 211, 42, 1) 100%
  );
}

ul {
  list-style-type: decimal;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
