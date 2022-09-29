import { PacklistDto, PacklistsResponse, UUID } from '../types';
import axios from './axiosConfig';

const packlistEndpoint = '/packlists';

const getAll = async () => {
  const response = await axios.get<PacklistsResponse>(packlistEndpoint);
  return response.data;
};

const getOneById = async (id: UUID) => {
  const response = await axios.get<PacklistDto>(`${packlistEndpoint}/${id}`);
  return response.data;
};

const postPacklist = async (packlist: PacklistDto) => {
  const response = await axios.post<PacklistDto>(`${packlistEndpoint}/${packlist.id}`, packlist);
  return response.data;
};

const putPacklist = async (packlist: PacklistDto) => {
  const response = await axios.put<PacklistDto>(`${packlistEndpoint}/${packlist.id}`, packlist);
  return response.data;
};

export default { getAll, getOneById, postPacklist, putPacklist };
