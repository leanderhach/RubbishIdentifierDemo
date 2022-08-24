// store.ts
import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export type action = {
  name: string;
  healthEffect: number;
  text: string;
  validImages: Array<number>;
};

export type rubbish = {
  name: string;
  baseImage: number;
  images: Array<string>;
  actionsCount: number;
  type: string;
  bin: string;
  score: number;
  flavorText: string;
  health: number;
  actions: Array<action>;
  location: string | Array<number>;
};

export type rubbishBoss = {
  name: string;
  segments: Array<rubbish>;
};

export interface State {
  gameState: string;
  currentHighScore: number;
  allTimeHighScore: number;
  rubbishItems: Array<rubbish>;
  rubbishBosses: Array<rubbishBoss>;
  isPlaying: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    gameState: "",
    currentHighScore: 0,
    allTimeHighScore: 0,
    rubbishItems: Array<rubbish>(),
    rubbishBosses: Array<rubbishBoss>(),
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
    setCurrentHighScore(state: State, score: number) {
      state.currentHighScore = score;
    },
    removeFirstRubbishItem(state: State) {
      const item: rubbish = state.rubbishItems[0];

      console.log(item);

      // add to the player's score
      state.currentHighScore += item.score;

      // remove the first item in the array
      state.rubbishItems.splice(0, 1);

      // check if all the items from the array have been removed. If yes, end the game
      if (state.rubbishItems.length <= 0) {
        // check if there are any bosses
        if (state.rubbishBosses.length > 0) {
          state.gameState = "bossBattle";
        } else {
          state.gameState = "finished";

          state.allTimeHighScore =
            state.currentHighScore > state.allTimeHighScore
              ? state.currentHighScore
              : state.allTimeHighScore;
        }
      }
    },
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
