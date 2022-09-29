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
 * Populates the packlist (category ids to actual categories) from global state and removes type property that's
 * internal to frontend.
 */
const packlistToDto = (packlist: PacklistComplete, state: RootState): PacklistDto => {
  const allCategories = selectCategories(state);
  const categories = packlist.categoryIds.map(id => allCategories[id]);
  const { type: _type, categoryIds: _categoryIds, ...strippedPacklist } = packlist;
  const populatedPacklist: PacklistDto = { ...strippedPacklist, categories };
  return populatedPacklist;
};

/**
 * Unpacks packlist from backend to front end model where actual categories are replaced by just categoryIds. Also adds
 * type string in the model.
 */
const depopulatePacklist = (packlist: PacklistDto) => {
  const categoryIds: UUID[] = packlist.categories.map(category => category.id);
  const { categories: _categories, ...strippedPacklist } = packlist;
  const depopulatedPacklist: PacklistComplete = { ...strippedPacklist, categoryIds, type: 'complete' };
  return depopulatedPacklist;
};

export const createPacklist = createAsyncThunk<
  PacklistDto,
  PacklistComplete,
  { state: RootState }
>('packlists/createOne', async (packlist: PacklistComplete, { getState }) => {
  const populatedPacklist = packlistToDto(packlist, getState());
  return await packlistService.postPacklist(populatedPacklist);
});

export const updatePacklist = createAsyncThunk<
  PacklistDto,
  PacklistComplete,
  { state: RootState }
>('packlists/updateOne', async (packlist: PacklistComplete, { getState }) => {
  const populatedPacklist = packlistToDto(packlist, getState());
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
        state[action.payload.id] = depopulatePacklist(action.payload);
      })
      .addCase(createPacklist.fulfilled, (state, action) => {
        state[action.payload.id] = depopulatePacklist(action.payload);
      })
      .addCase(updatePacklist.fulfilled, (state, action) => {
        state[action.payload.id] = depopulatePacklist(action.payload);
      });
  }
});

export const { setPacklist, removePacklist, addCategoryToPacklist, removeCategoryFromPacklist } = packlistSlice.actions;

export const selectPacklists = (state: RootState) => state.packlists;

export const selectPacklistById = (state: RootState, id: UUID) => state.packlists[id];

export default packlistSlice.reducer;
