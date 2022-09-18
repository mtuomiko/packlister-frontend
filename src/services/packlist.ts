import { PacklistDto, PacklistsResponse, UUID } from '../types';
import axios from './axiosConfig';

const baseUrl = 'http://localhost:8080/api/packlists';

const getAll = async () => {
  const response = await axios.get<PacklistsResponse>(baseUrl);
  return response.data;
};

const getOneById = async (id: UUID) => {
  const response = await axios.get<PacklistDto>(`${baseUrl}/${id}`);
  return response.data;
};

const postPacklist = async (packlist: PacklistDto) => {
  const response = await axios.post<PacklistDto>(`${baseUrl}/${packlist.id}`, packlist);
  return response.data;
};

const putPacklist = async (packlist: PacklistDto) => {
  const response = await axios.put<PacklistDto>(`${baseUrl}/${packlist.id}`, packlist);
  return response.data;
};

export default { getAll, getOneById, postPacklist, putPacklist };
