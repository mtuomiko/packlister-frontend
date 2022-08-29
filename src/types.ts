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
