import React, { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectPacklists, set } from '../slices/packlists';
import { useParams } from 'react-router-dom';
import { selectUserItems } from '../slices/userItems';
import { Packlist as PacklistType } from '../types';

const Packlist = () => {
  const params = useParams();
  const packlistId = params.packlistId;
  const packlists = useAppSelector(selectPacklists);
  const userItems = useAppSelector(selectUserItems);
  const dispatch = useAppDispatch();

  if (packlistId === undefined) {
    return (<div>no packlist</div>);
  }

  const packlist = packlists[params.packlistId as string];

  if (packlist === undefined) {
    return (<div>no packlist</div>);
  }

  const modifyByValue = (event: ChangeEvent<HTMLInputElement>, key: keyof PacklistType) => {
    const modifiedItem = { ...packlist, [key]: event.target.value };
    dispatch(set(modifiedItem));
  };

  return (
    <div>
      <input
        name="name"
        type="text"
        value={packlist.name ?? ''}
        onChange={(e) => modifyByValue(e, 'name')}
      />
      <input
        name="description"
        type="text"
        value={packlist.description ?? ''}
        onChange={(e) => modifyByValue(e, 'description')}
      />
      {Object.entries(packlist.categories).map(([id, category]) => (
        <div key={id}>
          <input
            name="name"
            type="text"
            value={category.name ?? ''}
          />
          {category.items.map(categoryItem => (
            <div key={categoryItem.id}>
              <input
                name="name"
                type="text"
                value={userItems[categoryItem.id].name ?? ''}
              />
              <input
                name="description"
                type="text"
                value={userItems[categoryItem.id].description ?? ''}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Packlist;
