import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PacklistList from './components/PacklistList';
import Profile from './components/Profile';
import UserItemList from './components/UserItemList';
import { useAppDispatch, useAppSelector } from './hooks';
import { getAuth } from './slices/authSlice';
import { getAll } from './slices/userItemsSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(getAuth);

  useEffect(() => {
    const getData = async () => {
      if (auth === null) { return; }
      await dispatch(getAll());
    };

    void getData();
  }, [auth]);

  return (
    <div className="rootContainer">
      {auth !== null
        ? <Profile auth={auth} />
        : <LoginForm />
      }
      <UserItemList />
      <PacklistList />
      <Outlet />
    </div>
  );
};

export default App;
