import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Category, UUID } from '../types';
import { getPacklistComplete, updatePacklist } from './packlistSlice';

export interface CategoriesState {
  [id: UUID]: Category
}

export interface CategoryWithPacklist {
  packlistId: UUID
  category: Category
}

const initialState: CategoriesState = {};

interface HasId {
  id: UUID
}

const reduceToByIdObject = <T extends HasId>(
  initial: { [id: UUID]: T },
  list: T[]
) => {
  return list.reduce(
    (memo, element) => ({ ...memo, [element.id]: element }),
    initial
  );
};

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
  },
  extraReducers: builder => {
    builder
      .addCase(getPacklistComplete.fulfilled, (state, action) => {
        return reduceToByIdObject(state, action.payload.categories);
      })
      .addCase(updatePacklist.fulfilled, (state, action) => {
        return reduceToByIdObject(state, action.payload.categories);
      });
  }
});

export const { setCategory, removeCategory } = categoriesSlice.actions;

export const selectCategories = (state: RootState) => state.categories;

export const selectCategoryById = (state: RootState, id: UUID) => state.categories[id];

export default categoriesSlice.reducer;
