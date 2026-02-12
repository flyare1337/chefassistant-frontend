import { store } from "./utils/store";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: typeof store;
  }
}
