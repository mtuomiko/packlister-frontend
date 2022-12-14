import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack } from '@chakra-ui/react';
import React, { FormEventHandler, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { useField } from 'hooks/useField';
import { login, selectAuth } from 'slices/authSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const auth = useAppSelector(selectAuth);

  useEffect(() => {
    if (auth !== null) {
      navigate('/', { replace: true });
    }
  }, [auth]);

  const dispatch = useAppDispatch();
  const username = useField('text');
  const password = useField('password');

  const handleLogin: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (username.value === '' || password.value === '') { return; }
    void dispatch(login({ username: username.value, password: password.value }));
    // username.reset();
    // password.reset();
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
    >
      <Heading>Login</Heading>
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input placeholder="Username" name="username" {...username.inputVars} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input placeholder="Password" name="password" {...password.inputVars} />
          </FormControl>
          <Button colorScheme={'teal'} type="submit" width="full">
            Login
          </Button>
        </Stack>
      </form>
    </Flex>
  );
};

export default LoginForm;
