/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Store } from 'vuex';
import { StoreElements } from '../store';
import { App } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

let api: AxiosInstance;
export default boot(
  ({ app, store }: { app: App; store: Store<StoreElements> }) => {
    api = axios.create({
      timeout: store.getters.getHttpNoAuthOptions.timeout as number,
      baseURL: store.getters.getHttpNoAuthOptions.baseURL as string,
    });
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axiosNoAuth = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$httpNoAuth = api;
    app.config.globalProperties.$apiNoAuth = api;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
  }
);

export { axios, api };