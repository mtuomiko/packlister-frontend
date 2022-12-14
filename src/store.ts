import { AnyAction, combineReducers, configureStore, isFulfilled, isRejected } from '@reduxjs/toolkit';
import throttle from 'lodash/throttle';
import authReducer, { initialAuthState, logout } from 'slices/authSlice';
import itemReducer, { initialUserItemState } from 'slices/userItemSlice';
import packlistReducer, { initialPacklistsState } from 'slices/packlistSlice';
import categoryReducer, { initialCategoriesState } from 'slices/categorySlice';
import { loadState, saveState } from 'utils/localStorage';

const savedState = loadState();

const appReducer = combineReducers({
  auth: authReducer,
  items: itemReducer,
  packlists: packlistReducer,
  categories: categoryReducer,
});

export type RootState = ReturnType<typeof appReducer>;

export interface ThunkApi {
  state: RootState
};

const isRejectedLogout = isRejected(logout);
const isFulfilledLogout = isFulfilled(logout);

const rootReducer = (state: RootState, action: AnyAction) => {
  // after logout action (regardless of success), reset state
  if (isFulfilledLogout(action) || isRejectedLogout(action) || action.type === 'auth/clear') {
    state = {
      auth: initialAuthState,
      items: initialUserItemState,
      packlists: initialPacklistsState,
      categories: initialCategoriesState,
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
}, 3000));

export { store };
export type StoreType = typeof store;
export type AppDispatch = typeof store.dispatch;
