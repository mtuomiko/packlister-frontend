import React, { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { set, remove, selectUserItems } from '../slices/userItemsSlice';
import { UserItem as UserItemType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import UserItem from './UserItem';

const UserItemList = () => {
  const items = useAppSelector(selectUserItems);
  const dispatch = useAppDispatch();

  const addNew = () => {
    const newItem: UserItemType = {
      id: uuidv4(),
      publicVisibility: false,
    };

    dispatch(set(newItem));
  };

  return (
    <div>
      <h3>Items</h3>
      {Object.entries(items).map(([id, item]) =>
        <UserItem key={id} userItem={item} />
      )}
      <div>
        <button onClick={() => addNew()}>Add new item</button>
      </div>
    </div>
  );
};

export default UserItemList;
