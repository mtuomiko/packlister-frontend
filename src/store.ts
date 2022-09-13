import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import itemsReducer from './slices/userItemsSlice';
import packlistsReducer from './slices/packlistsSlice';
import authReducer from './slices/authSlice';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

const savedState = loadState();

const appReducer = combineReducers({
  items: itemsReducer,
  packlists: packlistsReducer,
  auth: authReducer
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'auth/clear') {
    state = { items: {}, packlists: {}, auth: null };
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: savedState
});

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 5000));

export { store };
export type StoreType = typeof store;
export type AppDispatch = typeof store.dispatch;
