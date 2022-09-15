import React, { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setPacklist, addCategoryToPacklist, selectPacklistById } from '../slices/packlistsSlice';
import { useParams } from 'react-router-dom';
import { Category as CategoryType, Packlist as PacklistType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import Category from './Category';
import { setCategory } from '../slices/categorySlice';

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
    dispatch(setPacklist(modifiedItem));
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
