import axios from './axiosConfig';
import { UserItem, UserItemResponse } from '../types';

const baseUrl = 'http://localhost:8080/api/items';

const getAll = async () => {
  const response = await axios.get<UserItemResponse>(baseUrl);
  return response.data;
};

const batchUpsert = async (userItems: UserItem[]) => {
  const body = { userItems };
  const response = await axios.put<UserItemResponse>(`${baseUrl}/batch`, body);
  return response.data;
};

const batchDelete = async (userItemIds: string[]) => {
  const body = { userItemIds };
  await axios.post(`${baseUrl}/batch`, body);
};

export default { getAll, batchUpsert, batchDelete };
