import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { selectAuth } from 'slices/authSlice';
import { batchDelete, batchUpsert, getAllUserItems, selectDeletedIds, selectDirtyIds } from 'slices/userItemSlice';
import DragDisplay from 'components/DragDisplay';
import Header from 'components/Header';

const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const dirtyIds = useAppSelector(selectDirtyIds);
  const deletedIds = useAppSelector(selectDeletedIds);

  // get initial data if logged in
  useEffect(() => {
    const getData = async () => {
      if (auth === null) { return; }
      await dispatch(getAllUserItems());
    };

    void getData();
  }, [auth]);

  useEffect(() => {
    if (auth === null) { return; }
    // wait 10sec after change and then update
    const timeoutUpdate = () => {
      if (dirtyIds.length !== 0) {
        void dispatch(batchUpsert(dirtyIds)); // just run, don't care about async result here
      }
      if (deletedIds.length !== 0) {
        void dispatch(batchDelete(deletedIds));
      }
    };

    const id = window.setTimeout(timeoutUpdate, 10000);

    return () => window.clearTimeout(id);
  }, [auth, dirtyIds, deletedIds]);

  return (
    <div className="rootContainer">
      <Header auth={auth} />
      <DragDisplay />
      <Outlet />
    </div>
  );
};

export default App;
