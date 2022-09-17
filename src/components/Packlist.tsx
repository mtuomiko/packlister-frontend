import React, { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setPacklist, addCategoryToPacklist, selectPacklistById, getPacklistComplete } from '../slices/packlistSlice';
import { useParams } from 'react-router-dom';
import { Category as CategoryType, Packlist as PacklistType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import Category from './Category';
import { setCategory } from '../slices/categorySlice';
import { selectAuth } from '../slices/authSlice';

const Packlist = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const packlistId = params.packlistId;
  if (packlistId === undefined) {
    return null;
  }

  const auth = useAppSelector(selectAuth);
  const packlist = useAppSelector(state => {
    return selectPacklistById(state, packlistId) as PacklistType | undefined; // state cannot guarantee existence
  });

  useEffect(() => {
    const getPacklist = async () => {
      if (auth === null) { return; }
      await dispatch(getPacklistComplete(packlistId));
    };

    if (packlist === undefined || packlist.type === 'limited') {
      void getPacklist();
    }
  }, [auth, packlist]);

  // only operate on complete packlists
  if (packlist === undefined || packlist.type === 'limited') {
    return null;
  }

  const modifyByValue = (event: ChangeEvent<HTMLInputElement>) => {
    const modifiedPacklist = { ...packlist, [event.target.name]: event.target.value };
    dispatch(setPacklist(modifiedPacklist));
  };

  const addNewCategory = () => {
    const newCategory: CategoryType = {
      id: uuidv4(),
      items: []
    };
    dispatch(setCategory(newCategory));
    dispatch(addCategoryToPacklist({ packlistId: packlist.id, categoryId: newCategory.id }));
  };

  return (
    <div>
      <div>
        <label>Name</label>
        <input
          name="name"
          type="text"
          value={packlist.name ?? ''}
          onChange={(e) => modifyByValue(e)}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          name="description"
          type="text"
          value={packlist.description ?? ''}
          onChange={(e) => modifyByValue(e)}
        />
      </div>
      {packlist.categoryIds.map(categoryId =>
        <Category key={categoryId} categoryId={categoryId} />
      )}
      <div>
        <button onClick={addNewCategory}>Add new category</button>
      </div>
    </div>
  );
};

export default Packlist;
