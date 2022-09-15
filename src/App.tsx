import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectAuth } from './slices/authSlice';
import { batchDelete, batchUpsert, getAll, selectDeletedIds, selectDirtyIds, selectUserItems } from './slices/userItemsSlice';
import pickBy from 'lodash/pickBy';
import DragDisplay from './components/DragDisplay';

const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const userItems = useAppSelector(selectUserItems);
  const dirtyIds = useAppSelector(selectDirtyIds);
  const deletedIds = useAppSelector(selectDeletedIds);

  // get initial data if logged in
  useEffect(() => {
    const getData = async () => {
      if (auth === null) { return; }
      await dispatch(getAll());
    };

    void getData();
  }, [auth]);

  useEffect(() => {
    if (auth === null) { return; }
    // wait 10sec after change and then update
    const timeoutUpdate = () => {
      if (dirtyIds.length !== 0) {
        const itemsToUpsert = Object.values(
          pickBy(userItems, (_value, key) => dirtyIds.includes(key))
        );
        void dispatch(batchUpsert(itemsToUpsert)); // just run, don't care about async result here
      }
      if (deletedIds.length !== 0) {
        void dispatch(batchDelete(deletedIds));
      }
    };

    const id = window.setTimeout(timeoutUpdate, 10000);

    return () => window.clearTimeout(id);
  }, [auth, userItems, dirtyIds, deletedIds]);

  return (
    <div className="rootContainer">
      {auth !== null
        ? <Profile auth={auth} />
        : <LoginForm />
      }
      <DragDisplay />
      <Outlet />
    </div>
  );
};

export default App;
