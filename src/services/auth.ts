import axios from 'axios';
import { Credentials, RegistrationInfo, TokenResponse, UserResponse } from '../types';

const baseUrl = 'http://localhost:8080/api/auth';

const register = async (registrationInfo: RegistrationInfo) => {
  const response = await axios.post<UserResponse>(`${baseUrl}/register`, registrationInfo);
  return response.data;
};

const token = async (credentials: Credentials) => {
  const response = await axios.post<TokenResponse>(`${baseUrl}/token`, credentials);
  return response.data;
};

export default { register, token };
