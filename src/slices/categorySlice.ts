import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Category, UUID } from '../types';
import { getPacklistComplete, updatePacklist } from './packlistSlice';
import { removeUserItem } from './userItemSlice';

export interface CategoriesState {
  [id: UUID]: Category
}

const initialState: CategoriesState = {};

interface HasId {
  id: UUID
}

/**
 * Reduces the list argument into the initial object resulting in a new object with ids as keys and the objects as
 * values. Objects with same id will be overwritten in the initial object.
 *
 * @param initial Object used as the initial state for reducing
 * @param objectsWithId List of objects with id property
 * @returns A new modified list containing the initial objects and objects from list.
 */
const reduceToByIdObject = <T extends HasId>(
  initial: { [id: UUID]: T },
  objectsWithId: T[]
) => {
  return objectsWithId.reduce(
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
      })
      .addCase(removeUserItem, (state, action) => {
        // user item removal, remove any usage of the item in categories
        const removedUserItemId = action.payload;
        Object.values(state).forEach(category => {
          const newCategoryItems = category.items.filter(categoryItem => categoryItem.userItemId !== removedUserItemId);
          category.items = newCategoryItems;
        });
      });
  }
});

export const { setCategory, removeCategory } = categoriesSlice.actions;

export const selectCategories = (state: RootState) => state.categories;

export const selectCategoryById = (state: RootState, id: UUID) => state.categories[id];

export default categoriesSlice.reducer;
