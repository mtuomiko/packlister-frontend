import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwt_decode, { JwtPayload } from 'jwt-decode';
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
      // handled at rootReducer
    },
    check: (state) => {
      if (state === null) { return null; }
      const decodedToken = jwt_decode<JwtPayload>(state.token);
      const expiration = decodedToken.exp;
      if (expiration !== undefined && expiration <= Math.floor(Date.now() / 1000)) {
        return null;
      }
      return state;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(register.fulfilled, (_state, _action) => {
        return null;
      })
      .addCase(register.rejected, (_state, action) => {
        console.error(action.error);
        console.error(action.payload);
        return null;
      })
      .addCase(login.fulfilled, (_state, action) => {
        return action.payload;
      })
      .addCase(login.rejected, (_state, action) => {
        console.error(action.error);
        console.error(action.payload);
        return null;
      });
  }
});

export const { set, clear, check } = authSlice.actions;

export const getAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
