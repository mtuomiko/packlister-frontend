import React from 'react';
import { useAppSelector } from '../hooks';
import { selectUserItemById } from '../slices/userItemSlice';
import { CategoryItem as CategoryItemType } from '../types';

const CategoryItem = ({ categoryItem }: { categoryItem: CategoryItemType }) => {
  const userItem = useAppSelector(state => selectUserItemById(state, categoryItem.userItemId));

  return (
    <div key={categoryItem.userItemId}>
      <input
        name="name"
        type="text"
        value={userItem.name ?? ''}
        readOnly
      />
      <input
        name="description"
        type="text"
        value={userItem.description ?? ''}
        readOnly
      />
      <input
        name="weight"
        type="number"
        value={userItem.weight ?? ''}
        readOnly
      />
      <input
        name="quantity"
        type="number"
        value={categoryItem.quantity ?? ''}
        readOnly
      />
      <input
        name="totalWeight"
        type="number"
        value={userItem.weight ?? 0 * categoryItem.quantity}
        readOnly
      />
    </div>
  );
};

export default CategoryItem;
