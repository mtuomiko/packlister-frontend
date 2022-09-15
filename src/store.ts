import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemsReducer from './slices/userItemsSlice';
import packlistsReducer from './slices/packlistsSlice';
import categoryReducer from './slices/categorySlice';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

const savedState = loadState();

const appReducer = combineReducers({
  auth: authReducer,
  items: itemsReducer,
  packlists: packlistsReducer,
  categories: categoryReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'auth/clear') {
    state = {
      auth: null,
      items: {
        userItems: {
          byId: {},
          allIds: [],
        },
        dirtyIds: [],
        deletedIds: []
      },
      packlists: {},
      categories: {},
    };
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
