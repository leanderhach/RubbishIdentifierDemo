<template>
    <div class="game-play">

    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from '../../store';

const store = useStore();

const rubbishItem = {
    name: "Plastic Bag",
    image: "@/images/rubbish/plastic_bag.jpeg",
    type: "plastic",
    recycling: true,
    generalWaste: false,
    organics: false,
    flavorText: "The vaunted plastic bag. This little bugger is found in almost every home, but he's so dangerous he's been banned all over the world.",
}
</script>

<script>
export default {
    name: "gamePlay"
}
</script>


<style lang="scss">
.game-play {

}
</style>