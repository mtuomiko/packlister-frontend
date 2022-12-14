import React, { ChangeEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { setPacklist, addCategoryToPacklist, selectPacklistById, getPacklistComplete, updatePacklist } from 'slices/packlistSlice';
import { Category as CategoryType, Packlist as PacklistType } from 'types';
import { setCategory } from 'slices/categorySlice';
import { selectAuth } from 'slices/authSlice';
import Category from 'components/Category';
import PacklistSummary from 'components/PacklistSummary';

const Packlist = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const packlistId = params.packlistId;
  if (packlistId === undefined) {
    return null;
  }

  const auth = useAppSelector(selectAuth);
  const packlist = useAppSelector(state => {
    // state cannot guarantee existence for any id param
    return selectPacklistById(state, packlistId) as PacklistType | undefined;
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

  const savePacklist = () => {
    void dispatch(updatePacklist(packlist));
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
        <Input
          name="name"
          type="text"
          value={packlist.name ?? ''}
          onChange={(e) => modifyByValue(e)}
          size="lg"
          placeholder='My packlist'
        />
      </div>
      <div>
        <label>Description</label>
        <Input
          name="description"
          type="text"
          value={packlist.description ?? ''}
          onChange={(e) => modifyByValue(e)}
        />
      </div>
      <div>
        <button onClick={savePacklist}>Save</button>
      </div>
      <PacklistSummary categoryIds={packlist.categoryIds} />
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
