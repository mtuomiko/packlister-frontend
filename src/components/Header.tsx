import React from 'react';
import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AuthState, logout } from 'slices/authSlice';
import { useAppDispatch } from 'hooks/reduxHooks';

const Header = ({ auth }: { auth: AuthState }) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    void dispatch(logout());
  };

  const loggedIn = () => {
    return (
      <>
        <Button onClick={handleLogout}>Logout</Button>
      </>
    );
  };

  const notLoggedIn = () => {
    return (
      <>
        <Link to="/login"><Button>Login</Button></Link>
        <Button>Signup</Button>
      </>
    );
  };

  return (
    <Flex>
      <Box>
        <Stack>
          {auth !== null ? loggedIn() : notLoggedIn()}
        </Stack>
      </Box>
    </Flex>
  );
};

export default Header;
