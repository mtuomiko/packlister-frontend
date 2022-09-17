import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Category, UUID } from '../types';

export interface CategoriesState {
  [id: UUID]: Category
}

export interface CategoryWithPacklist {
  packlistId: UUID
  category: Category
}

const initialState: CategoriesState = {};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<Category>) => {
      state[action.payload.id] = action.payload;
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state[action.payload];
    },
  }
  // TODO: Add listener reducer for getOnePacklist in order to add categories to state. Packlist reducer only sets the
  // category ids for the packlist but the actual categories are currently not used.
});

export const { setCategory, removeCategory } = categoriesSlice.actions;

export const selectCategories = (state: RootState) => state.categories;

export const selectCategoryById = (state: RootState, id: UUID) => state.categories[id];

export default categoriesSlice.reducer;
