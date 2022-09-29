import axios from './axiosConfig';
import { UserItem, UserItemsResponse } from '../types';

const rootEndpoint = '/items';

const getAll = async () => {
  const response = await axios.get<UserItemsResponse>(rootEndpoint);
  return response.data;
};

const batchUpsert = async (userItems: UserItem[]) => {
  const body = { userItems };
  const response = await axios.put<UserItemsResponse>(`${rootEndpoint}/batch`, body);
  return response.data;
};

const batchDelete = async (userItemIds: string[]) => {
  const body = { userItemIds };
  await axios.post(`${rootEndpoint}/batchDelete`, body);
};

export default { getAll, batchUpsert, batchDelete };
