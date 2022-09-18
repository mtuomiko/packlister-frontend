import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setPacklist, removePacklist, selectPacklists, getAllPacklists, createPacklist } from '../slices/packlistSlice';
import { PacklistComplete } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { selectAuth } from '../slices/authSlice';

const PacklistList = () => {
  const auth = useAppSelector(selectAuth);
  const packlists = useAppSelector(selectPacklists);
  const dispatch = useAppDispatch();

  // get initial data if logged in
  useEffect(() => {
    const getData = async () => {
      if (auth === null) { return; }
      await dispatch(getAllPacklists());
    };

    void getData();
  }, [auth]);

  const addNew = () => {
    const newPacklist: PacklistComplete = {
      type: 'complete',
      id: uuidv4(),
      categoryIds: [],
    };

    if (auth !== null) {
      void dispatch(createPacklist(newPacklist));
    } else {
      dispatch(setPacklist(newPacklist));
    }
  };

  return (
    <div>
      <h3>Lists</h3>
      {Object.entries(packlists).map(([id, packlist]) => (
        <div key={id}>
          <Link to={`/packlists/${id}`}>{packlist.name ?? 'New list'}</Link>
          <button onClick={() => dispatch(removePacklist(id))}>X</button>
        </div>
      ))}
      <div>
        <button onClick={() => addNew()}>Add new list</button>
      </div>
    </div>
  );
};

export default PacklistList;
