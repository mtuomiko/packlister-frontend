import axios from './axiosConfig';
import { UserItem, UserItemsResponse } from '../types';

const baseUrl = 'http://localhost:8080/api/items';

const getAll = async () => {
  const response = await axios.get<UserItemsResponse>(baseUrl);
  return response.data;
};

const batchUpsert = async (userItems: UserItem[]) => {
  const body = { userItems };
  const response = await axios.put<UserItemsResponse>(`${baseUrl}/batch`, body);
  return response.data;
};

const batchDelete = async (userItemIds: string[]) => {
  const body = { userItemIds };
  await axios.post(`${baseUrl}/batchDelete`, body);
};

export default { getAll, batchUpsert, batchDelete };
