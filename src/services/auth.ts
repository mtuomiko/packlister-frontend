import axios from './axiosConfig';
import { Credentials, RegistrationInfo, TokenResponse, UserResponse } from '../types';

const rootEndpoint = '/auth';

const register = async (registrationInfo: RegistrationInfo) => {
  const response = await axios.post<UserResponse>(`${rootEndpoint}/register`, registrationInfo);
  return response.data;
};

const token = async (credentials: Credentials) => {
  const response = await axios.post<TokenResponse>(`${rootEndpoint}/token`, credentials);
  return response.data;
};

export default { register, token };
