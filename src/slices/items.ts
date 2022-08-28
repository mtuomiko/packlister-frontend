import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Item } from '../types';

interface ItemsState {
  [id: string]: Item
}

const initialState: ItemsState = {};

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  // automagically wrapped with immer so redux state modification is ok
  // note: do not return AND modify state in same function
  reducers: {
    set: (state, action: PayloadAction<Item>) => {
      state[action.payload.id] = action.payload;
    },
    remove: (state, action: PayloadAction<string>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state[action.payload];
    },
  }
});

export const { set, remove } = itemsSlice.actions;

export const itemsSelector = (state: RootState) => state.items;

export default itemsSlice.reducer;
