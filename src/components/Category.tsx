import React, { ChangeEvent } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { ItemTypes } from 'globalConstants';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { selectCategoryById, setCategory } from 'slices/categorySlice';
import { CategoryItem as CategoryItemType, UserItem, UUID } from 'types';
import { setUserItem } from 'slices/userItemSlice';
import CategoryItem from 'components/CategoryItem';

interface DragUserItem {
  type: string
  id: UUID
}

const Category = ({ categoryId }: { categoryId: UUID }) => {
  const dispatch = useAppDispatch();
  const category = useAppSelector(state => selectCategoryById(state, categoryId));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.USER_ITEM,
    drop: (item: DragUserItem) => {
      const existingItemIndex = category.items.findIndex(categoryItem => categoryItem.userItemId === item.id);
      if (existingItemIndex !== -1) { return; }

      const newCategoryItem: CategoryItemType = {
        userItemId: item.id,
        quantity: 1
      };
      const newItems = [...category.items, newCategoryItem];
      const modifiedCategory = { ...category, items: newItems };
      dispatch(setCategory(modifiedCategory));
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  }), [category]);

  const modifyByValue = (event: ChangeEvent<HTMLInputElement>) => {
    const modifiedCategory = { ...category, name: event.target.value };
    dispatch(setCategory(modifiedCategory));
  };

  const addNewItem = () => {
    const newItem: UserItem = {
      id: uuidv4(),
      publicVisibility: false,
    };
    const newCategoryItem: CategoryItemType = {
      userItemId: newItem.id,
      quantity: 1
    };
    const newItems = [...category.items, newCategoryItem];
    const modifiedCategory = { ...category, items: newItems };
    dispatch(setUserItem(newItem));
    dispatch(setCategory(modifiedCategory));
  };

  const modifyCategoryItem = (categoryItem: CategoryItemType) => {
    const modifiedItems = category.items.map(item => item.userItemId === categoryItem.userItemId
      ? categoryItem
      : item);
    const modifiedCategory = { ...category, items: modifiedItems };
    console.log(modifiedCategory);
    dispatch(setCategory(modifiedCategory));
  };

  return (
    <div ref={drop} style={{ position: 'relative' }}>
      <input
        name="name"
        type="text"
        value={category.name ?? ''}
        placeholder="Category"
        onChange={modifyByValue}
      />
      {category.items.map(categoryItem => (
        <CategoryItem key={categoryItem.userItemId} categoryItem={categoryItem} modifyCategoryItem={modifyCategoryItem} />
      ))}
      <div>
        <button onClick={addNewItem}>Add new item</button>
      </div>
      {category.items.length === 0 && <div>Drag here</div>}
      {isOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
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
