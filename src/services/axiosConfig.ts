import axios from 'axios';
import { StoreType } from '../store';

const instance = axios.create();

let store: StoreType | undefined;

export const injectStore = (injectStore: StoreType) => {
  store = injectStore;
};

instance.interceptors.request.use(config => {
  if (store === undefined) { return config; }
  const token = store.getState().auth?.token;
  if (token === undefined) { return config; }

  if (config.headers === undefined) {
    config.headers = {};
  }
  config.headers.Authorization = `bearer ${token}`;
  return config;
});

export default instance;
