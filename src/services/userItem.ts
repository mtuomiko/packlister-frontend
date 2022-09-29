import axios from './axiosConfig';
import { UserItem, UserItemsResponse } from '../types';

const itemEndpoint = '/items';

const getAll = async () => {
  const response = await axios.get<UserItemsResponse>(itemEndpoint);
  return response.data;
};

const batchUpsert = async (userItems: UserItem[]) => {
  const body = { userItems };
  const response = await axios.put<UserItemsResponse>(`${itemEndpoint}/batch`, body);
  return response.data;
};

const batchDelete = async (userItemIds: string[]) => {
  const body = { userItemIds };
  await axios.post(`${itemEndpoint}/batchDelete`, body);
};

export default { getAll, batchUpsert, batchDelete };
