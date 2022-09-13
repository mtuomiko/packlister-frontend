import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Packlist } from '../types';

export interface PacklistsState {
  [id: string]: Packlist
}

const initialState: PacklistsState = {};

export const packlistsSlice = createSlice({
  name: 'packlists',
  initialState,
  // automagically wrapped with immer so redux state modification is ok
  // note: do not return AND modify state in same function
  reducers: {
    // initialize: (_state, action: PayloadAction<PacklistsState>) => {
    //   return action.payload;
    // },
    set: (state, action: PayloadAction<Packlist>) => {
      state[action.payload.id] = action.payload;
    },
    remove: (state, action: PayloadAction<string>) => {
      // should be fine, not using Map() instead of object due to possible issues with Redux
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state[action.payload];
    },
  }
});

export const { set, remove } = packlistsSlice.actions;

export const selectPacklists = (state: RootState) => state.packlists;

export default packlistsSlice.reducer;
