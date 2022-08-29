import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserItem } from '../types';

export interface UserItemsState {
  [id: string]: UserItem
}

const initialState: UserItemsState = {};

export const userItemsSlice = createSlice({
  name: 'items',
  initialState,
  // automagically wrapped with immer so redux state modification is ok
  // note: do not return AND modify state in same function
  reducers: {
    // initialize: (_state, action: PayloadAction<ItemsState>) => {
    //   return action.payload;
    // },
    set: (state, action: PayloadAction<UserItem>) => {
      state[action.payload.id] = action.payload;
    },
    remove: (state, action: PayloadAction<string>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state[action.payload];
    },
  }
});

export const { set, remove } = userItemsSlice.actions;

export const selectUserItems = (state: RootState) => state.items;

export default userItemsSlice.reducer;
