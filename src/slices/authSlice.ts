import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { Credentials, RegistrationInfo, TokenResponse } from 'types';
import authService from 'services/auth';

export type AuthState = TokenResponse | null;

export const initialAuthState = null as AuthState;
export const authSliceName = 'auth';

export const register = createAsyncThunk(`${authSliceName}/register`, async (registrationInfo: RegistrationInfo) => {
  const response = await authService.register(registrationInfo);
  return response;
});

export const login = createAsyncThunk(`${authSliceName}/login`, async (credentials: Credentials) => {
  const response = await authService.login(credentials);
  return response;
});

export const refreshTokens = createAsyncThunk(`${authSliceName}/refreshTokens`, async () => {
  const response = await authService.refresh();
  return response;
});

/**
 * logout actions are handled at store rootReducer
 */
export const logout = createAsyncThunk(`${authSliceName}/logout`, async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: authSliceName,
  initialState: initialAuthState,
  reducers: {
    setAuth: (_state, action: PayloadAction<TokenResponse>) => {
      return action.payload;
    },
    clear: (_state) => {
      // handled at store rootReducer
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.fulfilled, (_state, action) => {
        return action.payload;
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
      })
      .addCase(refreshTokens.fulfilled, (_state, action) => {
        return action.payload;
      })
      .addCase(refreshTokens.rejected, (_state, action) => {
        console.error(action.error);
        console.error(action.payload);
        return null;
      });
  }
});

export const { setAuth, clear } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
