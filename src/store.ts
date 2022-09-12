import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './slices/userItems';
import packlistsReducer from './slices/packlists';
import authReducer from './slices/auth';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

const savedState = loadState();

const store = configureStore({
  reducer: {
    items: itemsReducer,
    packlists: packlistsReducer,
    auth: authReducer
  },
  preloadedState: savedState
});

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 3000));

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
