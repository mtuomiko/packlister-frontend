import React, { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { set, remove, itemsSelector } from '../slices/items';
import { Item } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ItemList = () => {
  const items = useAppSelector(itemsSelector);
  const dispatch = useAppDispatch();

  const addNew = () => {
    const newItem: Item = {
      id: uuidv4(),
      publicVisibility: false,
    };

    dispatch(set(newItem));
  };

  const modifyByValue = (event: ChangeEvent<HTMLInputElement>, item: Item, key: keyof Item) => {
    const modifiedItem = { ...item, [key]: event.target.value };
    dispatch(set(modifiedItem));
  };

  const modifyByChecked = (event: ChangeEvent<HTMLInputElement>, item: Item, key: keyof Item) => {
    const modifiedItem = { ...item, [key]: event.target.checked };
    dispatch(set(modifiedItem));
  };

  return (
    <div>
      {Object.entries(items).map(([id, item]) => (
        <div key={id}>
          <input name="name" type="text" value={item.name} onChange={(e) => modifyByValue(e, item, 'name')} />
          <input name="description" type="text" value={item.description} onChange={(e) => modifyByValue(e, item, 'description')} />
          <input name="weight" type="number" value={item.weight} onChange={(e) => modifyByValue(e, item, 'weight')} />
          <input name="publicVisibility" type="checkbox" checked={item.publicVisibility} onChange={(e) => modifyByChecked(e, item, 'publicVisibility')} />
          <button onClick={() => dispatch(remove(id))}>X</button>
        </div>
      ))}
      <div>
        <button onClick={() => addNew()}>Add new</button>
      </div>
    </div>
  );
};

export default ItemList;
