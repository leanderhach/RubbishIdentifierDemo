// store.ts
import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export type action = {
  name: string;
  healthEffect: number;
  text: string;
};

export type rubbish = {
  name: string;
  image: string;
  type: string;
  bin: string;
  score: number;
  flavorText: string;
  health: number;
  actions: Array<action>;
};

export interface State {
  gameState: string;
  currentHighScore: number;
  rubbishItems: Array<rubbish>;
  isPlaying: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    gameState: "",
    currentHighScore: 0,
    rubbishItems: Array<rubbish>(),
    isPlaying: false,
  },
  mutations: {
    setGameState(state: State, payload: string) {
      state.gameState = payload;
    },
    setIsPlaying(state: State, payload: boolean) {
      state.isPlaying = payload;
    },
    createRubbishItem(state: State, payload: rubbish) {
      state.rubbishItems.push(payload);
    },
    removeFirstRubbishItem(state: State) {
      const item: rubbish = state.rubbishItems[0];

      console.log(item);

      // add to the player's score
      console.log("item is being removed");
      console.log(item.score);
      console.log(state.currentHighScore);
      state.currentHighScore += item.score;

      // remove the first item in the array
      state.rubbishItems.splice(0, 1);

      // check if all the items from the array have been removed. If yes, end the game
      if (state.rubbishItems.length <= 0) {
        state.gameState = "finished";
      }
    },
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
