import axios from 'axios';
import { StoreType } from '../store';

const instance = axios.create({
  baseURL: API_BASE_URL
});

let store: StoreType | undefined;

/**
 * Store injection to avoid circular dependencies. Call preferrably at an early point in the application.
 */
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
