// store.ts
import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  gameState: string;
  currentHighScore: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    gameState: "",
    currentHighScore: 0,
  },
  mutations: {
    setGameState(state: State, payload: string) {
      state.gameState = payload;
    },
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
