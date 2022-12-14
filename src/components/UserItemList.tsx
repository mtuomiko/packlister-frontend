import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Heading, VStack } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { setUserItem, selectUserItemIds } from 'slices/userItemSlice';
import { UserItem as UserItemType } from 'types';
import UserItem from 'components/UserItem';

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
    <Box p={1}>
      <Heading as='h3' size='sm'>Items</Heading>
      <VStack>
        {itemIds.map(id =>
          <UserItem key={id} userItemId={id} />
        )}
      </VStack>
      <div>
        <button onClick={() => addNew()}>Add new item</button>
      </div>
    </Box>
  );
};

export default UserItemList;
