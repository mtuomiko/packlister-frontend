import React, { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { set, addCategory, CategoryWithPacklist, setCategory, selectPacklistById } from '../slices/packlistsSlice';
import { useParams } from 'react-router-dom';
import { Category as CategoryType, Packlist as PacklistType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import Category from './Category';

const Packlist = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const packlistId = params.packlistId;
  const packlist = useAppSelector(state => {
    if (packlistId !== undefined) { return selectPacklistById(state, packlistId); }
    return undefined;
  });

  if (packlist === undefined) {
    return (<div>no packlist</div>);
  }

  const modifyByValue = (event: ChangeEvent<HTMLInputElement>, key: keyof PacklistType) => {
    const modifiedItem = { ...packlist, [key]: event.target.value };
    dispatch(set(modifiedItem));
  };

  const addNewCategory = () => {
    const newCategory: CategoryWithPacklist = {
      packlistId: packlist.id,
      category: {
        id: uuidv4(),
        items: []
      }
    };

    dispatch(addCategory(newCategory));
  };

  const modifyCategory = (category: CategoryType) => {
    const payload: CategoryWithPacklist = {
      packlistId: packlist.id,
      category
    };
    dispatch(setCategory(payload));
  };

  return (
    <div>
      <div>
        <label>Name</label>
        <input
          name="name"
          type="text"
          value={packlist.name ?? ''}
          onChange={(e) => modifyByValue(e, 'name')}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          name="description"
          type="text"
          value={packlist.description ?? ''}
          onChange={(e) => modifyByValue(e, 'description')}
        />
      </div>
      {Object.entries(packlist.categories).map(([id, category]) =>
        <Category key={id} category={category} modifyCategory={modifyCategory} />
      )}
      <div>
        <button onClick={addNewCategory}>Add new category</button>
      </div>
    </div>
  );
};

export default Packlist;
