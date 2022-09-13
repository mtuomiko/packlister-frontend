import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { set, remove, selectPacklists } from '../slices/packlistsSlice';
import { Packlist } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

const PacklistList = () => {
  const packlists = useAppSelector(selectPacklists);
  const dispatch = useAppDispatch();

  const addNew = () => {
    const newPacklist: Packlist = {
      id: uuidv4(),
      categories: [],
    };

    dispatch(set(newPacklist));
  };

  return (
    <div>
      <h3>Lists</h3>
      {Object.entries(packlists).map(([id, packlist]) => (
        <div key={id}>
          <Link to={`/packlists/${id}`}>{packlist.name ?? 'New list'}</Link>
          <button onClick={() => dispatch(remove(id))}>X</button>
        </div>
      ))}
      <div>
        <button onClick={() => addNew()}>Add new list</button>
      </div>
    </div>
  );
};

export default PacklistList;
