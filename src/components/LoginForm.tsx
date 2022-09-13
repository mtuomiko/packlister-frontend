import React, { FormEventHandler } from 'react';
import { useAppDispatch } from '../hooks';
import { useField } from '../hooks/useField';
import { login } from '../slices/authSlice';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const username = useField('text');
  const password = useField('password');

  // dispatching async logic on the handler
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (username.value === '' || password.value === '') { return; }
    await dispatch(login({ username: username.value, password: password.value }));
    // username.reset();
    // password.reset();
  };

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input name='username' {...username.inputVars} />
        <label>Password</label>
        <input name='password' {...password.inputVars} />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginForm;
