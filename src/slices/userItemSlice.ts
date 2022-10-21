import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import pickBy from 'lodash/pickBy';
import { RootState, ThunkApi } from '../store';
import { Status, UserItem, UserItemsResponse, UUID } from '../types';
import userItemsService from '../services/userItem';

export interface UserItemsState {
  userItems: {
    byId: { [id: UUID]: UserItem }
    allIds: UUID[]
  }
  dirtyIds: UUID[] // modified and not yet sent to server
  deletedIds: UUID[] // deleted but not deleted on server
  status: Status
}

export const initialUserItemState: UserItemsState = {
  userItems: {
    byId: {},
    allIds: []
  },
  dirtyIds: [],
  deletedIds: [],
  status: Status.Idle
};

const userItemSliceName = 'items';

export const getAllUserItems = createAsyncThunk<
  // createAsyncThunk needs an void argument if no actual arguments used
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  UserItemsResponse, void, ThunkApi
>(
  `${userItemSliceName}/getAll`,
  async (_) => {
    const response = await userItemsService.getAll();
    return response;
  },
  {
    condition: (_, { getState }) => {
      const status = getState().items.status;
      if (status === Status.Succeeded || status === Status.Loading) {
        return false;
      }
    }
  }
);

/**
 * Gets a list of dirty user item ids that need to be upserted to backend. Not expecting the actual user items due to
 * causing a dependency to the user items (instead of just the dirty user item ids) in the source point. Accesses global
 * state to then get the actual user item data.
 */
export const batchUpsert = createAsyncThunk<
  UserItemsResponse, UUID[], ThunkApi
>(
  `${userItemSliceName}/batchUpsert`,
  async (userItemIds: UUID[], { getState }) => {
    const userItems = selectUserItems(getState());
    const itemsToUpsert = Object.values(
      pickBy(userItems, (_value, key) => userItemIds.includes(key))
    );
    const response = await userItemsService.batchUpsert(itemsToUpsert);
    return response;
  }
);

export const batchDelete = createAsyncThunk(
  `${userItemSliceName}/batchDelete`,
  async (userItemIds: UUID[]) => {
    await userItemsService.batchDelete(userItemIds);
    // return deleted ids for handling in action
    return userItemIds;
  }
);

export const userItemSlice = createSlice({
  name: userItemSliceName,
  initialState: initialUserItemState,
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
      const removedId = action.payload;
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.userItems.byId[removedId];
      const index = state.userItems.allIds.indexOf(removedId);
      state.userItems.allIds.splice(index, 1);
      if (!state.deletedIds.includes(removedId)) {
        state.deletedIds.push(removedId);
      }
      // removed item can no longer be dirty (it doesn't exist)
      const dirtyIndex = state.dirtyIds.indexOf(removedId);
      if (dirtyIndex !== -1) {
        state.dirtyIds.splice(dirtyIndex, 1);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllUserItems.pending, (state, _action) => {
        state.status = Status.Loading;
      })
      .addCase(getAllUserItems.fulfilled, (state, action) => {
        // possible items coming from "offline use" use should be retained
        const allItems = action.payload.userItems.reduce(
          (memo, item) => ({ ...memo, [item.id]: item }),
          state.userItems.byId
        );
        const allIds = Object.keys(allItems);
        state.userItems.byId = allItems;
        state.userItems.allIds = allIds;
        state.status = Status.Succeeded;
      })
      .addCase(getAllUserItems.rejected, (state, action) => {
        console.error(action.error);
        console.error(action.payload);
        state.status = Status.Failed;
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
// Make consumers check that the UserItem exists
export const selectUserItemById = (state: RootState, id: UUID): UserItem | undefined => {
  return selectUserItems(state)[id];
};
export const selectDirtyIds = (state: RootState) => state.items.dirtyIds;
export const selectDeletedIds = (state: RootState) => state.items.deletedIds;

export default userItemSlice.reducer;
