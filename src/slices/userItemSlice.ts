import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserItem, UserItemsResponse, UUID } from '../types';
import userItemsService from '../services/userItem';
import pickBy from 'lodash/pickBy';

export interface UserItemsState {
  userItems: {
    byId: { [id: UUID]: UserItem }
    allIds: UUID[]
  }
  dirtyIds: UUID[]
  deletedIds: UUID[]
}

const initialState: UserItemsState = {
  userItems: {
    byId: {},
    allIds: []
  },
  dirtyIds: [],
  deletedIds: []
};

export const getAllUserItems = createAsyncThunk('items/getAll', async () => {
  const response = await userItemsService.getAll();
  return response;
});

/**
 * Gets a list of dirty user item ids that need to be upserted to backend. Not expecting the actual user items due to
 * causing a dependency to the user items (instead of just the dirty user item ids) in the source point. Accesses global
 * state to then get the actual user item data.
 */
export const batchUpsert = createAsyncThunk<
  UserItemsResponse,
  UUID[],
  { state: RootState }
>('items/batchUpsert', async (userItemIds: UUID[], { getState }) => {
  const userItems = selectUserItems(getState());
  const itemsToUpsert = Object.values(
    pickBy(userItems, (_value, key) => userItemIds.includes(key))
  );
  const response = await userItemsService.batchUpsert(itemsToUpsert);
  return response;
});

export const batchDelete = createAsyncThunk('items/batchDelete', async (userItemIds: UUID[]) => {
  await userItemsService.batchDelete(userItemIds);
  return userItemIds;
});

export const userItemSlice = createSlice({
  name: 'items',
  initialState,
  // automagically wrapped with immer so redux state modification is ok
  // note: do not return AND modify state in same function
  reducers: {
    setUserItem: (state, action: PayloadAction<UserItem>) => {
      const id = action.payload.id;
      state.userItems.byId[id] = action.payload;
      if (!state.userItems.allIds.includes(id)) { state.userItems.allIds.push(id); }
      if (!state.dirtyIds.includes(id)) {
        state.dirtyIds.push(id);
      }
    },
    removeUserItem: (state, action: PayloadAction<UUID>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.userItems.byId[action.payload];
      const index = state.userItems.allIds.indexOf(action.payload);
      state.userItems.allIds.splice(index, 1);
      if (!state.deletedIds.includes(action.payload)) {
        state.deletedIds.push(action.payload);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllUserItems.fulfilled, (state, action) => {
        const allItems = action.payload.userItems.reduce(
          (memo, item) => ({ ...memo, [item.id]: item }),
          state.userItems.byId
        );
        const allIds = Object.keys(allItems);
        // possible items coming from "offline use" use should be retained
        state.userItems.byId = allItems;
        state.userItems.allIds = allIds;
      })
      .addCase(getAllUserItems.rejected, (_state, action) => {
        console.error(action.error);
        console.error(action.payload);
      })
      .addCase(batchUpsert.fulfilled, (state, action) => {
        const upsertedIds = action.payload.userItems.map(item => item.id);
        // if state has new items that weren't upserted, keep them in dirty
        const remaining = state.dirtyIds.filter(id => !upsertedIds.includes(id));
        state.dirtyIds = remaining;
        // don't do anything with the actual returned items, currently expecting that nothing changes
      })
      .addCase(batchDelete.fulfilled, (state, action) => {
        const deletedIds = action.payload;
        const remaining = state.deletedIds.filter(id => !deletedIds.includes(id));
        state.deletedIds = remaining;
      });
  }
});

export const { setUserItem, removeUserItem } = userItemSlice.actions;

export const selectUserItems = (state: RootState) => state.items.userItems.byId;
export const selectUserItemIds = (state: RootState) => state.items.userItems.allIds;
export const selectUserItemById = (state: RootState, id: UUID) => selectUserItems(state)[id];
export const selectDirtyIds = (state: RootState) => state.items.dirtyIds;
export const selectDeletedIds = (state: RootState) => state.items.deletedIds;

export default userItemSlice.reducer;
