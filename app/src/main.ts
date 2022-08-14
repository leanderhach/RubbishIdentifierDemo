import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { store, key } from "./store";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faArrowLeft,
  faArrowRight,
  faCamera,
  faInfo,
  faRotateLeft,
  faSadTear,
  faSpinner,
  faThumbsDown,
  faThumbsUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faCamera);
library.add(faRotateLeft);
library.add(faArrowRight);
library.add(faArrowLeft);
library.add(faTimes);
library.add(faSadTear);
library.add(faThumbsUp);
library.add(faInfo);
library.add(faThumbsDown);
library.add(faSpinner);

/* add font awesome icon component */

createApp(App)
  .use(store, key)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
