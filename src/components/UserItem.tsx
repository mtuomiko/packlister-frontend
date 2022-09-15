import React, { ChangeEvent } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import { useAppDispatch } from '../hooks';
import { remove, set } from '../slices/userItemsSlice';
import { UserItem as UserItemType } from '../types';
import { parseValue } from '../utils/inputUtils';

const UserItem = ({ userItem }: { userItem: UserItemType }) => {
  const dispatch = useAppDispatch();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.USER_ITEM,
    item: { id: userItem.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const modifyByValue = (event: ChangeEvent<HTMLInputElement>, item: UserItemType, key: keyof UserItemType) => {
    const value = parseValue(event);
    const modifiedItem = { ...item, [key]: value };
    dispatch(set(modifiedItem));
  };

  const modifyByChecked = (event: ChangeEvent<HTMLInputElement>, item: UserItemType, key: keyof UserItemType) => {
    const modifiedItem = { ...item, [key]: event.target.checked };
    dispatch(set(modifiedItem));
  };

  const { id, name, description, weight, publicVisibility } = userItem;
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <input
        name="name"
        type="text"
        value={name ?? ''}
        onChange={(e) => modifyByValue(e, userItem, 'name')}
      />
      <input
        name="description"
        type="text"
        value={description ?? ''}
        onChange={(e) => modifyByValue(e, userItem, 'description')}
      />
      <input
        name="weight"
        type="number"
        value={weight ?? ''}
        onChange={(e) => modifyByValue(e, userItem, 'weight')}
      />
      <input
        name="publicVisibility"
        type="checkbox"
        checked={publicVisibility}
        onChange={(e) => modifyByChecked(e, userItem, 'publicVisibility')}
      />
      <button onClick={() => dispatch(remove(id))}>X</button>
    </div>
  );
};

export default UserItem;
