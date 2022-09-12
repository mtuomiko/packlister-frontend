import React from 'react';
import { Outlet } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PacklistList from './components/PacklistList';
import UserItemList from './components/UserItemList';

const App = () => {
  return (
    <div className="rootContainer">
      <LoginForm />
      <UserItemList />
      <PacklistList />
      <Outlet />
    </div>
  );
};

export default App;
