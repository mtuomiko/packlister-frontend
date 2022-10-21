export type UUID = string;

export interface UserItem {
  id: UUID
  name?: string
  description?: string
  weight?: number
  publicVisibility: boolean
};

export interface PacklistBase {
  id: UUID
  name?: string
};

export interface PacklistLimited extends PacklistBase {
  type: 'limited'
}

export interface PacklistComplete extends PacklistBase {
  type: 'complete'
  description?: string
  categoryIds: string[]
}

export interface PacklistDto {
  id: UUID
  name?: string
  description?: string
  categories: Category[]
}

export type Packlist = PacklistLimited | PacklistComplete;

export interface Category {
  id: UUID
  name?: string
  items: CategoryItem[]
};

export interface CategoryItem {
  userItemId: UUID
  quantity: number
};

export interface RegistrationInfo {
  username: string
  email: string
  password: string
};

export interface User {
  id: string
  username: string
  email: string
};

export type Credentials = Omit<RegistrationInfo, 'email'>;

export interface TokenResponse {
  accessToken: string
  user: User
};

export interface UserItemsResponse {
  userItems: UserItem[]
};

export interface PacklistsResponse {
  packlists: PacklistBase[]
};

export const enum Status {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Succeeded = 'SUCCEEDED',
  Failed = 'FAILED'
}
