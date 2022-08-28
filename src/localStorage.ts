import { RootState } from './store';
import { Item } from './types';

interface ItemsStoreState {
  [id: string]: Item
}

export const loadState = (): { items: ItemsStoreState } | undefined => {
  try {
    console.log('reading from localStorage');
    const serializedState = window.localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);
    console.log(parsedState);
    return parsedState as { items: ItemsStoreState };
  } catch (error) {
    return undefined;
  }
};

export const saveState = (state: RootState) => {
  try {
    console.log(`writing to localStorage at ${new Date().toLocaleTimeString()}`);
    console.log(state);
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (error) {
    console.error(error);
  }
};
