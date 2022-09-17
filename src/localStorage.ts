import { AuthState } from './slices/authSlice';
import { PacklistsState } from './slices/packlistSlice';
import { UserItemsState } from './slices/userItemSlice';
import { RootState } from './store';

interface StorageState {
  items?: UserItemsState
  packlists?: PacklistsState
  auth?: AuthState
};

const ITEM_KEY = 'state';

export const loadState = (): StorageState | undefined => {
  try {
    console.log('reading from localStorage');
    const serializedState = window.localStorage.getItem(ITEM_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);
    return parsedState as StorageState;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveState = (state: RootState) => {
  try {
    console.log(`writing to localStorage at ${new Date().toLocaleTimeString()}`);
    // when logged in, store only auth to local storage
    const stateToWrite = state.auth !== null
      ? { auth: state.auth }
      : state;
    const serializedState = JSON.stringify(stateToWrite);
    localStorage.setItem(ITEM_KEY, serializedState);
  } catch (error) {
    console.error(error);
  }
};
