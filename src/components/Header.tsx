import React from 'react';
import { Box, Button, Flex, HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { logout, selectAuth } from 'slices/authSlice';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';

const Header = ({ isSidebarOpen, onToggleSidebar }: { isSidebarOpen: boolean, onToggleSidebar: () => void }) => {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    void dispatch(logout());
  };

  const loggedIn = () => <>
    <Button size='sm' colorScheme='teal' onClick={handleLogout}>Logout</Button>
  </>;

  const notLoggedIn = () => <>
    <Link to="/login"><Button size='sm' colorScheme='teal'>Login</Button></Link>
    <Button size='sm' colorScheme='teal'>Signup</Button>
  </>;

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} p={2}>
      <Flex align={'center'} justify={'space-between'}>
        <IconButton
          size={'md'}
          icon={isSidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open sidebar'}
          onClick={onToggleSidebar}
        />
        <HStack spacing={4}>
          {auth !== null ? loggedIn() : notLoggedIn()}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
