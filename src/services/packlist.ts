import { PacklistDto, PacklistsResponse, UUID } from '../types';
import axios from './axiosConfig';

const rootEndpoint = '/packlists';

const getAll = async () => {
  const response = await axios.get<PacklistsResponse>(rootEndpoint);
  return response.data;
};

const getOneById = async (id: UUID) => {
  const response = await axios.get<PacklistDto>(`${rootEndpoint}/${id}`);
  return response.data;
};

const postPacklist = async (packlist: PacklistDto) => {
  const response = await axios.post<PacklistDto>(`${rootEndpoint}/${packlist.id}`, packlist);
  return response.data;
};

const putPacklist = async (packlist: PacklistDto) => {
  const response = await axios.put<PacklistDto>(`${rootEndpoint}/${packlist.id}`, packlist);
  return response.data;
};

export default { getAll, getOneById, postPacklist, putPacklist };
