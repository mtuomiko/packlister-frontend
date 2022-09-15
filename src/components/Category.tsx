import React, { ChangeEvent } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import { Category as CategoryType, CategoryItem as CategoryItemType } from '../types';
import CategoryItem from './CategoryItem';

interface DragUserItem {
  type: string
  id: string
}

const Category = ({ category, modifyCategory }: {
  category: CategoryType
  modifyCategory: (category: CategoryType) => void
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.USER_ITEM,
    drop: (item: DragUserItem) => {
      const newCategoryItem: CategoryItemType = {
        id: item.id,
        quantity: 1
      };
      const newItems = [...category.items, newCategoryItem];
      const modifiedCategory = { ...category, items: newItems };
      modifyCategory(modifiedCategory);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  }), [category]);

  const modifyByValue = (event: ChangeEvent<HTMLInputElement>) => {
    const modifiedCategory = { ...category, name: event.target.value };
    modifyCategory(modifiedCategory);
  };

  return (
    <div ref={drop}>
      <input
        name="name"
        type="text"
        value={category.name ?? ''}
        placeholder="Category"
        onChange={modifyByValue}
      />
      {category.items.map(categoryItem => (
        <CategoryItem key={categoryItem.id} categoryItem={categoryItem} />
      ))}
      {category.items.length === 0 && <div>Drag here</div>}
      {isOver && (
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.3,
            backgroundColor: 'green',
          }}
        />
      )}
    </div>
  );
};

export default Category;
