import React, { ChangeEvent } from 'react';
import { useAppSelector } from 'hooks/reduxHooks';
import { selectUserItemById } from 'slices/userItemSlice';
import { CategoryItem as CategoryItemType } from 'types';
import { parseEventToValue } from 'utils/inputUtils';

const CategoryItem = ({ categoryItem, modifyCategoryItem }: {
  categoryItem: CategoryItemType
  modifyCategoryItem: (categoryItem: CategoryItemType) => void
}) => {
  const userItem = useAppSelector(state => selectUserItemById(state, categoryItem.userItemId));
  if (userItem === undefined) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseEventToValue(event);
    const modifiedCategoryItem = { ...categoryItem, [event.target.name]: value };
    modifyCategoryItem(modifiedCategoryItem);
  };

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
        onChange={handleChange}
      />
      <input
        name="totalWeight"
        type="number"
        value={(userItem.weight ?? 0) * categoryItem.quantity}
        readOnly
      />
    </div>
  );
};

export default CategoryItem;
