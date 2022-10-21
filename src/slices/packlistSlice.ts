import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, ThunkApi } from '../store';
import { Packlist, PacklistComplete, PacklistDto, PacklistsResponse, Status, UUID } from '../types';
import packlistService from '../services/packlist';
import { selectCategories } from './categorySlice';
import { selectUserItemIds } from './userItemSlice';

export interface PacklistsState {
  packlists: {
    [id: UUID]: Packlist
  }
  status: Status
}

export interface CategoryIdWithPacklistId {
  packlistId: UUID
  categoryId: UUID
}

export const initialPacklistsState: PacklistsState = {
  packlists: {},
  status: Status.Idle
};

const packlistsSliceName = 'packlists';

export const getAllPacklists = createAsyncThunk<
  // createAsyncThunk needs an void argument if no actual arguments used
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  PacklistsResponse, void, ThunkApi
>(
  `${packlistsSliceName}/getAll`,
  async (_) => await packlistService.getAll(),
  {
    condition: (_, { getState }) => {
      const status = getState().packlists.status;
      if (status === Status.Succeeded || status === Status.Loading) {
        return false;
      }
    }
  }
);

export const getPacklistComplete = createAsyncThunk<
  PacklistDto,
  UUID,
  { state: RootState }
>(`${packlistsSliceName}/getOne`, async (id: UUID, { getState }) => {
  // remove any stale references in category items
  const packlist = await packlistService.getOneById(id);
  const allUserItemIds = selectUserItemIds(getState());
  const newCategories = packlist.categories.map(category => {
    const newItems = category.items.filter(item => allUserItemIds.includes(item.userItemId));
    return { ...category, items: newItems };
  });
  return { ...packlist, categories: newCategories };
});

/**
 * Populates the packlist category ids to actual categories. Uses global state, also removes type property that's
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
 * Unpacks packlist received from backend to front end model where actual categories are replaced by just categoryIds.
 * Categories are handled in category slice. Also adds type string in the model.
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
>(`${packlistsSliceName}/createOne`, async (packlist: PacklistComplete, { getState }) => {
  const populatedPacklist = packlistToDto(packlist, getState());
  return await packlistService.postPacklist(populatedPacklist);
});

export const updatePacklist = createAsyncThunk<
  PacklistDto,
  PacklistComplete,
  { state: RootState }
>(`${packlistsSliceName}/updateOne`, async (packlist: PacklistComplete, { getState }) => {
  const populatedPacklist = packlistToDto(packlist, getState());
  return await packlistService.putPacklist(populatedPacklist);
});

export const packlistSlice = createSlice({
  name: packlistsSliceName,
  initialState: initialPacklistsState,
  // automagically wrapped with immer so redux state modification is ok
  // note: do not return AND modify state in same function
  reducers: {
    setPacklist: (state, action: PayloadAction<Packlist>) => {
      state.packlists[action.payload.id] = action.payload;
    },
    removePacklist: (state, action: PayloadAction<UUID>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.packlists[action.payload];
    },
    addCategoryToPacklist: (state, action: PayloadAction<CategoryIdWithPacklistId>) => {
      const packlist = state.packlists[action.payload.packlistId] as PacklistComplete;
      packlist.categoryIds.push(action.payload.categoryId);
    },
    removeCategoryFromPacklist: (state, action: PayloadAction<CategoryIdWithPacklistId>) => {
      const packlist = state.packlists[action.payload.packlistId] as PacklistComplete;
      const index = packlist.categoryIds.indexOf(action.payload.categoryId);
      packlist.categoryIds.splice(index, 1);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllPacklists.pending, (state, _action) => {
        state.status = Status.Loading;
      })
      .addCase(getAllPacklists.fulfilled, (_state, action) => {
        const allPacklists = action.payload.packlists.reduce(
          (memo, packlist) => ({ ...memo, [packlist.id]: { ...packlist, type: 'limited' } }),
          {}
        );
        return { packlists: allPacklists, status: Status.Succeeded };
      })
      .addCase(getPacklistComplete.fulfilled, (state, action) => {
        state.packlists[action.payload.id] = depopulatePacklist(action.payload);
      })
      .addCase(createPacklist.fulfilled, (state, action) => {
        state.packlists[action.payload.id] = depopulatePacklist(action.payload);
      })
      .addCase(updatePacklist.fulfilled, (state, action) => {
        state.packlists[action.payload.id] = depopulatePacklist(action.payload);
      });
  }
});

export const { setPacklist, removePacklist, addCategoryToPacklist, removeCategoryFromPacklist } = packlistSlice.actions;

export const selectPacklists = (state: RootState) => state.packlists.packlists;

export const selectPacklistById = (state: RootState, id: UUID) => state.packlists.packlists[id];

export default packlistSlice.reducer;
