import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Credentials, RegistrationInfo, TokenResponse } from '../types';
import authService from '../services/auth';

export type AuthState = TokenResponse | null;

const initialState = null as AuthState;

export const register = createAsyncThunk('auth/register', async (registrationInfo: RegistrationInfo) => {
  const response = await authService.register(registrationInfo);
  return response;
});

export const login = createAsyncThunk('auth/login', async (credentials: Credentials) => {
  const response = await authService.token(credentials);
  return response;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    set: (_state, action: PayloadAction<TokenResponse>) => {
      return action.payload;
    },
    clear: (_state) => {
      return undefined;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(register.fulfilled, (_state, _action) => {
        return undefined;
      })
      .addCase(register.rejected, (_state, action) => {
        console.error(action.error);
        console.error(action.payload);
        return undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(login.rejected, (_state, action) => {
        console.error(action.error);
        console.error(action.payload);
        return undefined;
      });
  }
});

export const { set, clear } = authSlice.actions;

export const getUser = (state: RootState) => state.auth;

export default authSlice.reducer;
