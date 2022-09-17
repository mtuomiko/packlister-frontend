import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setUserItem, selectUserItemIds } from '../slices/userItemSlice';
import { UserItem as UserItemType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import UserItem from './UserItem';

const UserItemList = () => {
  const itemIds = useAppSelector(selectUserItemIds);
  const dispatch = useAppDispatch();

  const addNew = () => {
    const newItem: UserItemType = {
      id: uuidv4(),
      publicVisibility: false,
    };

    dispatch(setUserItem(newItem));
  };

  return (
    <div>
      <h3>Items</h3>
      {itemIds.map(id =>
        <UserItem key={id} userItemId={id} />
      )}
      <div>
        <button onClick={() => addNew()}>Add new item</button>
      </div>
    </div>
  );
};

export default UserItemList;
