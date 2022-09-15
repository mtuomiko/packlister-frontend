import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Packlist, UUID } from '../types';

export interface PacklistsState {
  [id: UUID]: Packlist
}

export interface CategoryIdWithPacklistId {
  packlistId: UUID
  categoryId: UUID
}

const initialState: PacklistsState = {};

export const packlistsSlice = createSlice({
  name: 'packlists',
  initialState,
  // automagically wrapped with immer so redux state modification is ok
  // note: do not return AND modify state in same function
  reducers: {
    setPacklist: (state, action: PayloadAction<Packlist>) => {
      state[action.payload.id] = action.payload;
    },
    removePacklist: (state, action: PayloadAction<UUID>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state[action.payload];
    },
    addCategoryToPacklist: (state, action: PayloadAction<CategoryIdWithPacklistId>) => {
      state[action.payload.packlistId].categoryIds.push(action.payload.categoryId);
    },
    removeCategoryFromPacklist: (state, action: PayloadAction<CategoryIdWithPacklistId>) => {
      const index = state[action.payload.packlistId].categoryIds.indexOf(action.payload.categoryId);
      state[action.payload.packlistId].categoryIds.splice(index, 1);
    },
  }
});

export const { setPacklist, removePacklist, addCategoryToPacklist, removeCategoryFromPacklist } = packlistsSlice.actions;

export const selectPacklists = (state: RootState) => state.packlists;

export const selectPacklistById = (state: RootState, id: UUID) => state.packlists[id];

export default packlistsSlice.reducer;
