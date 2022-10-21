import { Credentials, RegistrationInfo, TokenResponse } from '../types';
import axios from './axiosPublicConfig';

/**
 * Make requests using public axios instance (has no configuration for access tokens) since providing the possible
 * access token doesn't make sense here. All the endpoints are meant to be used either without authentication or
 * authenticating by using the HttpOnly refresh token cookie, which is not visible on JS.
 */

const authEndpoint = '/auth';

const register = async (registrationInfo: RegistrationInfo) => {
  const response = await axios.post<TokenResponse>(`${authEndpoint}/register`, registrationInfo);
  return response.data;
};

const login = async (credentials: Credentials) => {
  const response = await axios.post<TokenResponse>(`${authEndpoint}/token`, credentials);
  return response.data;
};

const refresh = async () => {
  const response = await axios.post<TokenResponse>(`${authEndpoint}/token`);
  return response.data;
};

const logout = async () => {
  await axios.post(`${authEndpoint}/logout`);
};

export default { register, login, refresh, logout };
