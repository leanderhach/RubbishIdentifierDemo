<template>
  <main
    @touchstart.self="registerTouchStart"
    @touchend.self="registerTouchMove"
  >
    <button class="play-button">Let's Play!</button>
    <!-- <div class="organics-marker"></div> -->
    <div
      :class="['side-marker', 'recycling-marker', { active: swipedLeft }]"
    ></div>
    <div
      :class="['side-marker', 'rubbish-marker', { active: swipedRight }]"
    ></div>
    <div :class="['popup', { active: isPopupOpen }]">
      <div class="popup__header">
        <font-awesome-icon icon="fa-solid fa-times"></font-awesome-icon>
      </div>
      <div class="popup__title">
        <h3>{{ popup.title }}</h3>
        <font-awesome-icon :icon="['fa-solid', popup.icon]"></font-awesome-icon>
      </div>
      <div class="popup__text">{{ popup.text }}</div>
    </div>
    <div class="menu">
      <div class="text container">
        <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon>
        <p>Recycle</p>
      </div>
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
      <div class="text container">
        <p>Rubbish</p>
        <font-awesome-icon icon="fa-solid fa-arrow-right"></font-awesome-icon>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import useEventsBus from "../utils/EventBus";

const { emit } = useEventsBus();
const { bus } = useEventsBus();

let touchStartX = ref(0);
let touchEndX = ref(0);

let swipedLeft = ref(false);
let swipedRight = ref(false);

// swipe direction and rubbishType
let touchDirection = ref(0);
let isWasteRecyclable = ref(false);

let hasTakenPhoto = ref(false);
let isLoading = ref(false);

let isPopupOpen = ref(false);
let popup = ref({
  title: "That looks like a plastic bottle",
  icon: "fa-info",
  text: "Remember, only certain types of plastics can be recycled",
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
  hasTakenPhoto.value = !hasTakenPhoto.value;

  if (hasTakenPhoto.value) {
    isLoading.value = true;
    emit("justTookAPhoto", true);
  } else {
    if (isPopupOpen.value) {
      togglePopup();
    }
  }
};

function togglePopup() {
  isPopupOpen.value = !isPopupOpen.value;
}

function calculateTouchDirection() {
  // detect movement left
  if (touchEndX.value < touchStartX.value) {
    touchDirection.value = 1;

    swipedLeft.value = true;
    swipedRight.value = false;

    setTimeout(() => (swipedLeft.value = false), 300);
  }

  // detect movement right
  if (touchEndX.value > touchStartX.value) {
    touchDirection.value = 2;

    swipedLeft.value = false;
    swipedRight.value = true;

    setTimeout(() => (swipedRight.value = false), 300);
  }

  // check that swipe direction and rubbish type match up. If not, penalty time

  if (hasTakenPhoto.value) {
    console.log("a photo was taken, the popup is being toggled");
    // close popup if it's open to change the message

    if (touchDirection.value === 1 && isWasteRecyclable.value === true) {
      popup.value = {
        title: "Ka Pai!",
        icon: "fa-thumbs-up",
        text: "Keep on being a responsible kiwi!",
      };
    } else if (
      touchDirection.value === 2 &&
      isWasteRecyclable.value === false
    ) {
      popup.value = {
        title: "Ka Pai!",
        icon: "fa-thumbs-up",
        text: "Keep on being a responsible kiwi!",
      };
    } else {
      popup.value = {
        title: "Aw Shoot",
        icon: "fa-thumbs-down",
        text: "Thats the wrong bin, sorry.",
      };
    }
  }
}

function registerTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0].screenX;
}

function registerTouchMove(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0].screenX;
  calculateTouchDirection();
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

  const recyclables = ["aluminium", "glass", "plastic", "cardboard", "iron"];
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
        popup.value = {
          title:
            "That looks like a plastic bottle. But which bin does it go in?",
          icon: "fa-info",
          text: "Remember that only some types of plastic are recyclable. Check with your local council for more.",
        };
      } else {
        popup.value = {
          title:
            "That looks like a plastic bottle. But which bin does it go in?",
          icon: "fa-info",
          text: "Glass is the ultimate recyclable material.",
        };
      }
    }
    isWasteRecyclable.value = true;
  } else {
    popup.value = {
      title: "That looks like general waste. But what bin does it go in?",
      icon: "fa-info",
      text: "Rubbish comes in many forms.",
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
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 1rem;
  box-sizing: border-box;
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
  background-color: blue;
}

.popup {
  position: absolute;
  bottom: -100px;
  background-color: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  width: 100%;
  padding: 10px;
  padding-bottom: 45px;
  box-sizing: border-box;
  opacity: 0;
  transition: all 0.3s ease;

  &.active {
    transition: all 0.3s ease;
    opacity: 1;
    bottom: 65px;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  &__title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    & svg {
      font-size: 1.5rem;
      margin-left: 1rem;
    }
  }
}

.loading-spinner {
  animation: rotating 1s infinite linear;
}

.play-button {
  padding:10px 20px;
  border-radius:20px;
  border:none;
  outline:none;
  background-color: #27ae60;
  color:white;
  position:absolute;
  top:30px;
  right:30px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight:bold;
  font-weight: 1.25rem;
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
