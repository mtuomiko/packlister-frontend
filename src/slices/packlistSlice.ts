import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Packlist, PacklistComplete, PacklistDto, UUID } from '../types';
import packlistService from '../services/packlist';
import { selectCategories } from './categorySlice';

export interface PacklistsState {
  [id: UUID]: Packlist
}

export interface CategoryIdWithPacklistId {
  packlistId: UUID
  categoryId: UUID
}

const initialState: PacklistsState = {};

export const getAllPacklists = createAsyncThunk('packlists/getAll', async () =>
  await packlistService.getAll()
);

export const getPacklistComplete = createAsyncThunk('packlists/getOne', async (id: UUID) =>
  await packlistService.getOneById(id)
);

/**
 * Populates the packlist (category ids to actual categories) from global state.
 */
export const upsertPacklist = createAsyncThunk<
  PacklistDto,
  PacklistComplete,
  { state: RootState }
>('packlists/upsertOne', async (packlist: PacklistComplete, { getState }) => {
  const allCategories = selectCategories(getState());
  const categories = packlist.categoryIds.map(id => allCategories[id]);
  const { type: _type, categoryIds: _categoryIds, ...strippedPacklist } = packlist;
  const populatedPacklist: PacklistDto = { ...strippedPacklist, categories };
  return await packlistService.putPacklist(populatedPacklist);
});

export const packlistSlice = createSlice({
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
      const packlist = state[action.payload.packlistId] as PacklistComplete;
      packlist.categoryIds.push(action.payload.categoryId);
    },
    removeCategoryFromPacklist: (state, action: PayloadAction<CategoryIdWithPacklistId>) => {
      const packlist = state[action.payload.packlistId] as PacklistComplete;
      const index = packlist.categoryIds.indexOf(action.payload.categoryId);
      packlist.categoryIds.splice(index, 1);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllPacklists.fulfilled, (state, action) => {
        const allPacklists: PacklistsState = action.payload.packlists.reduce(
          (memo, packlist) => ({ ...memo, [packlist.id]: { ...packlist, type: 'limited' } }),
          {}
        );
        return allPacklists;
      })
      .addCase(getPacklistComplete.fulfilled, (state, action) => {
        const categoryIds = action.payload.categories.map(category => category.id);
        const { categories: _categories, ...strippedPacklist } = action.payload;
        const depopulatedPacklist = { ...strippedPacklist, categoryIds };
        state[action.payload.id] = { ...depopulatedPacklist, type: 'complete' };
      })
      .addCase(upsertPacklist.fulfilled, (state, action) => {
        const categoryIds = action.payload.categories.map(category => category.id);
        const { categories: _categories, ...strippedPacklist } = action.payload;
        const depopulatedPacklist = { ...strippedPacklist, categoryIds };
        state[action.payload.id] = { ...depopulatedPacklist, type: 'complete' };
      });
  }
});

export const { setPacklist, removePacklist, addCategoryToPacklist, removeCategoryFromPacklist } = packlistSlice.actions;

export const selectPacklists = (state: RootState) => state.packlists;

export const selectPacklistById = (state: RootState, id: UUID) => state.packlists[id];

export default packlistSlice.reducer;
