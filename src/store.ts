import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './slices/items';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

const savedState = loadState();

const store = configureStore({
  reducer: {
    items: itemsReducer
  },
  preloadedState: savedState
});

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 3000));

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
