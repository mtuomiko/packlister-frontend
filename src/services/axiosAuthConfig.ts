import axios from 'axios';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { Mutex } from 'async-mutex';
import { clear, setAuth } from '../slices/authSlice';
import { StoreType } from '../store';
import config from '../utils/config';
import authService from './auth';

/**
 * Configures an axios instance to be used for requests requiring JWT bearer access token authorization header. Redux
 * store is the source for the access token. Interceptor is used to ask the store for the current token.
 */

const instance = axios.create({
  baseURL: config.apiBaseUrl
});

let store: StoreType | undefined;

/**
 * Store injection to avoid circular dependencies since store uses the axios instances. Call preferrably at an early
 * point in the application.
 */
export const injectStore = (injectStore: StoreType) => {
  store = injectStore;
};

/**
 * Check if JWT token (string format) is expired. Tokens without set expiration value are not expired.
 */
const jwtIsExpired = (token: string): boolean => {
  const decodedToken = jwt_decode<JwtPayload>(token);
  const expirationTime = decodedToken.exp;
  return expirationTime !== undefined && expirationTime <= Math.floor(Date.now() / 1000);
};

/**
 * Insert access token if available. If expired, tries to use refresh token to get new tokens. Refresh token is HttpOnly
 * so it's not visible here. Using async-mutex to avoid multiple requests hitting the refresh token endpoint at the same
 * time.
 */
const refreshMutex = new Mutex();
instance.interceptors.request.use(async (config) => {
  // if some other request is already refreshing tokens, wait for that to complete
  await refreshMutex.waitForUnlock();

  if (store === undefined) { return config; }
  let token = store.getState()?.auth?.accessToken;
  if (token === undefined) { return config; }

  if (jwtIsExpired(token)) {
    if (!refreshMutex.isLocked()) {
      const release = await refreshMutex.acquire();
      try {
        const refreshResponse = await authService.refresh();
        token = refreshResponse.accessToken;
        store.dispatch(setAuth(refreshResponse));
      } catch (error) {
        // If refresh fails, clear auth. In practice, reset will reset global state
        store.dispatch(clear());
        throw error;
      } finally {
        release();
      }
    } else {
      // if mutex was locked between the initial wait and the check, wait until it releases and get new auth from store
      await refreshMutex.waitForUnlock();
      token = store.getState()?.auth?.accessToken;
    }
  }

  if (token !== undefined) {
    if (config.headers === undefined) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
