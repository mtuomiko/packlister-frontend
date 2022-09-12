export interface UserItem {
  id: string
  name?: string
  description?: string
  weight?: number
  publicVisibility: boolean
};

export interface Packlist {
  id: string
  name?: string
  description?: string
  categories: Category[]
};

export interface Category {
  id: string
  name?: string
  items: CategoryItem[]
};

export interface CategoryItem {
  id: string
  quantity: number
};

export interface RegistrationInfo {
  username: string
  email: string
  password: string
};

export interface UserResponse {
  id: string
  username: string
  email: string
};

export type Credentials = Omit<RegistrationInfo, 'email'>;

export interface TokenResponse {
  token: string
  username: string
  email: string
};
