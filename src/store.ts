import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemReducer from './slices/userItemSlice';
import packlistReducer from './slices/packlistSlice';
import categoryReducer from './slices/categorySlice';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';

const savedState = loadState();

const appReducer = combineReducers({
  auth: authReducer,
  items: itemReducer,
  packlists: packlistReducer,
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
