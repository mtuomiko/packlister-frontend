import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Category, Packlist } from '../types';

export interface PacklistsState {
  [id: string]: Packlist
}

export interface CategoryWithPacklist {
  packlistId: string
  category: Category
}

const initialState: PacklistsState = {};

export const packlistsSlice = createSlice({
  name: 'packlists',
  initialState,
  // automagically wrapped with immer so redux state modification is ok
  // note: do not return AND modify state in same function
  reducers: {
    set: (state, action: PayloadAction<Packlist>) => {
      state[action.payload.id] = action.payload;
    },
    remove: (state, action: PayloadAction<string>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state[action.payload];
    },
    addCategory: (state, action: PayloadAction<CategoryWithPacklist>) => {
      state[action.payload.packlistId].categories.push(action.payload.category);
    },
    setCategory: (state, action: PayloadAction<CategoryWithPacklist>) => {
      const index = state[action.payload.packlistId].categories
        .findIndex((category) => category.id === action.payload.category.id);
      state[action.payload.packlistId].categories[index] = action.payload.category;
    },
  }
});

export const { set, remove, addCategory, setCategory } = packlistsSlice.actions;

export const selectPacklists = (state: RootState) => state.packlists;

export const selectPacklistById = (state: RootState, id: string) => state.packlists[id];

export default packlistsSlice.reducer;
