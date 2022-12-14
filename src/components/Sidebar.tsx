import React from 'react';
import { Flex } from '@chakra-ui/react';
import PacklistList from 'components/PacklistList';
import UserItemList from 'components/UserItemList';

const Sidebar = () => {
  return (
    <Flex direction={'column'} width={360}>
      <PacklistList />
      <UserItemList />
    </Flex>
  );
};

export default Sidebar;
