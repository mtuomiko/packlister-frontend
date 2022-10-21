import axios from 'axios';

/**
 * withCredentials since HttpOnly cookie used for refresh token handling
 */
const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default instance;
