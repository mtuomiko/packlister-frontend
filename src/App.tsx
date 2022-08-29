import React from 'react';
import { Outlet } from 'react-router-dom';
import PacklistList from './components/PacklistList';
import UserItemList from './components/UserItemList';

const App = () => {
  return (
    <div className="rootContainer">
      <UserItemList />
      <PacklistList />
      <Outlet />
    </div>
  );
};

export default App;
