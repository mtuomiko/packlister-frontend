import React, { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { set, remove, selectUserItems } from '../slices/userItems';
import { UserItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const UserItemList = () => {
  const items = useAppSelector(selectUserItems);
  const dispatch = useAppDispatch();

  const addNew = () => {
    const newItem: UserItem = {
      id: uuidv4(),
      publicVisibility: false,
    };

    dispatch(set(newItem));
  };

  const modifyByValue = (event: ChangeEvent<HTMLInputElement>, item: UserItem, key: keyof UserItem) => {
    const value = parseValue(event);
    const modifiedItem = { ...item, [key]: value };
    dispatch(set(modifiedItem));
  };

  const parseValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'number') {
      const parsedInt = parseInt(event.target.value);
      return isNaN(parsedInt) ? '' : parsedInt;
    }
    return event.target.value;
  };

  const modifyByChecked = (event: ChangeEvent<HTMLInputElement>, item: UserItem, key: keyof UserItem) => {
    const modifiedItem = { ...item, [key]: event.target.checked };
    dispatch(set(modifiedItem));
  };

  return (
    <div>
      <h3>Items</h3>
      {Object.entries(items).map(([id, item]) => (
        <div key={id}>
          <input
            name="name"
            type="text"
            value={item.name ?? ''}
            onChange={(e) => modifyByValue(e, item, 'name')}
          />
          <input
            name="description"
            type="text"
            value={item.description ?? ''}
            onChange={(e) => modifyByValue(e, item, 'description')}
          />
          <input
            name="weight"
            type="number"
            value={item.weight ?? ''}
            onChange={(e) => modifyByValue(e, item, 'weight')}
          />
          <input
            name="publicVisibility"
            type="checkbox"
            checked={item.publicVisibility}
            onChange={(e) => modifyByChecked(e, item, 'publicVisibility')}
          />
          <button onClick={() => dispatch(remove(id))}>X</button>
        </div>
      ))}
      <div>
        <button onClick={() => addNew()}>Add new item</button>
      </div>
    </div>
  );
};

export default UserItemList;
