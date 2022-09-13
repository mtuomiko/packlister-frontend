import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PacklistList from './components/PacklistList';
import Profile from './components/Profile';
import UserItemList from './components/UserItemList';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectAuth } from './slices/authSlice';
import { batchUpsert, getAll, selectDirtyIds, selectUserItems } from './slices/userItemsSlice';
import pickBy from 'lodash/pickBy';

const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const userItems = useAppSelector(selectUserItems);
  const dirtyIds = useAppSelector(selectDirtyIds);

  useEffect(() => {
    const getData = async () => {
      if (auth === null) { return; }
      await dispatch(getAll());
    };

    void getData();
  }, [auth]);

  useEffect(() => {
    const periodicUpsert = async () => {
      console.log('running periodic upsert');
      if (dirtyIds.length === 0) { return; }
      console.log(dirtyIds);
      const itemsToUpsert = Object.values(
        pickBy(userItems, (_value, key) => dirtyIds.includes(key))
      );
      await dispatch(batchUpsert(itemsToUpsert));
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const intervalId = window.setTimeout(periodicUpsert, 10000);

    // void periodicUpsert();
    return () => window.clearTimeout(intervalId);
  }, [dirtyIds]);

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
