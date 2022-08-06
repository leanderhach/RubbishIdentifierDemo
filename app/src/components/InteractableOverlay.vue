<template>
    <main @touchstart="registerTouchStart" @touchmove="registerTouchMove">
        <div class="organics-marker"></div>
        <div class="side-marker recycling-marker"></div>
        <div class="side-marker rubbish-marker"></div>
        <div class="menu">
            <button class="shutter" @click="toggleHasTakenPhoto">
                <p v-if="hasTakenPhoto">
                    Reset
                </p>
                <p v-else>Take</p>
            </button>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

let touchStartX = ref(0);
let touchEndX = ref(0);

let touchStartY = ref(0);
let touchEndY = ref(0);

let touchDirection = ref(0);

let hasTakenPhoto = ref(false);

const toggleHasTakenPhoto = () => {
    hasTakenPhoto.value = !hasTakenPhoto.value;
}

function calculateTouchDirection () {

    // detect movement left
    if(touchEndX.value < touchStartX.value) touchDirection.value = 1;

    // detect movement right
    if(touchEndX.value > touchStartX.value) touchDirection.value = 2;

    // detect movement on the vertical up TODO
}

function registerTouchStart (e: TouchEvent) {
    console.log("started")
    touchStartX.value = e.changedTouches[0].screenX;
}

function registerTouchMove (e: TouchEvent) {
    console.log("moving")
    touchEndX.value = e.changedTouches[0].screenX;
    calculateTouchDirection();
}

</script>

<script lang="ts">
    export default {
        name: 'InteractableOverlay'
    }
</script>

<style lang="scss" scoped>
main {
    height:100%;
    width:100%;
    position: absolute;
    top:0;
    left:0;
}

.side-marker {
    height: calc(100% - 70px);
    top:5px;
    position:absolute;
    width:5px;
}

.organics-marker {
    top:0;
    left:0;
    width:100%;
    height:5px;
    background-color: green;
}

.recycling-marker {
    left:0;
    background-color:yellow;
}

.rubbish-marker {
    right: 0;
    background-color: red;
    box-shadow: -11px 5px 15px 5px #FF0000;
}

.menu {
    position: absolute;
    bottom:0;
    height:65px;
    width:100%;
    background-color: grey;
    display:flex;
    flex-direction: row;
    justify-content: center;
}

.shutter {
    padding: 5px 20px;
    border-radius:50%;
    border:10px solid white;
    box-shadow:none;
    margin-top:-32.5px;
    margin-bottom:32.5px;
}
</style>