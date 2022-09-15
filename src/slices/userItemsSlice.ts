import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserItem } from '../types';
import userItemsService from '../services/userItems';

export interface UserItemsState {
  userItems: { [id: string]: UserItem }
  dirtyIds: string[]
  deletedIds: string[]
}

const initialState: UserItemsState = { userItems: {}, dirtyIds: [], deletedIds: [] };

export const getAll = createAsyncThunk('items/getAll', async () => {
  const response = await userItemsService.getAll();
  return response;
});

export const batchUpsert = createAsyncThunk('items/batchUpsert', async (userItems: UserItem[]) => {
  const response = await userItemsService.batchUpsert(userItems);
  return response;
});

export const batchDelete = createAsyncThunk('items/batchDelete', async (userItemIds: string[]) => {
  await userItemsService.batchDelete(userItemIds);
  return userItemIds;
});

export const userItemsSlice = createSlice({
  name: 'items',
  initialState,
  // automagically wrapped with immer so redux state modification is ok
  // note: do not return AND modify state in same function
  reducers: {
    set: (state, action: PayloadAction<UserItem>) => {
      state.userItems[action.payload.id] = action.payload;
      if (!state.dirtyIds.includes(action.payload.id)) {
        state.dirtyIds.push(action.payload.id);
      }
    },
    remove: (state, action: PayloadAction<string>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.userItems[action.payload];
      if (!state.deletedIds.includes(action.payload)) {
        state.deletedIds.push(action.payload);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        const receivedItems = action.payload.userItems.reduce(
          (memo, item) => ({ ...memo, [item.id]: item }),
          {}
        );
        // possible items coming from "offline" use should be retained
        const allItems = { ...state.userItems, ...receivedItems };
        state.userItems = allItems;
      })
      .addCase(getAll.rejected, (_state, action) => {
        console.error(action.error);
        console.error(action.payload);
      })
      .addCase(batchUpsert.fulfilled, (state, action) => {
        const upsertedIds = action.payload.userItems.map(item => item.id);
        // if state has new items that weren't upserted, keep them in dirty
        const remaining = state.dirtyIds.filter(id => !upsertedIds.includes(id));
        state.dirtyIds = remaining;
      })
      .addCase(batchDelete.fulfilled, (state, action) => {
        const deletedIds = action.payload;
        const remaining = state.deletedIds.filter(id => !deletedIds.includes(id));
        state.deletedIds = remaining;
      });
  }
});

export const { set, remove } = userItemsSlice.actions;

export const selectUserItems = (state: RootState) => state.items.userItems;
export const selectUserItemById = (state: RootState, id: string) => state.items.userItems[id];
export const selectDirtyIds = (state: RootState) => state.items.dirtyIds;
export const selectDeletedIds = (state: RootState) => state.items.deletedIds;

export default userItemsSlice.reducer;
