import React, { ChangeEvent } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from 'globalConstants';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { removeUserItem, selectUserItemById, setUserItem } from 'slices/userItemSlice';
import { UserItem as UserItemType, UUID } from 'types';
import { parseEventToValue } from 'utils/inputUtils';

const UserItem = ({ userItemId }: { userItemId: UUID }) => {
  const userItem = useAppSelector(state => selectUserItemById(state, userItemId));
  const dispatch = useAppDispatch();

  if (userItem === undefined) return null;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.USER_ITEM,
    item: { id: userItem.id }, // we only need the id in the drop
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const modifyItem = (event: ChangeEvent<HTMLInputElement>, item: UserItemType, key?: keyof UserItemType) => {
    const value = parseEventToValue(event);
    const modifiedItem = { ...item, [key ?? event.target.name]: value };
    dispatch(setUserItem(modifiedItem));
  };

  const { id, name, description, weight, publicVisibility } = userItem;
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <input
        name="name"
        type="text"
        value={name ?? ''}
        onChange={(e) => modifyItem(e, userItem)}
      />
      <input
        name="description"
        type="text"
        value={description ?? ''}
        onChange={(e) => modifyItem(e, userItem)}
      />
      <input
        name="weight"
        type="number"
        value={weight ?? ''}
        onChange={(e) => modifyItem(e, userItem)}
      />
      <input
        name="publicVisibility"
        type="checkbox"
        checked={publicVisibility}
        onChange={(e) => modifyItem(e, userItem)}
      />
      <button onClick={() => dispatch(removeUserItem(id))}>X</button>
    </div>
  );
};

export default UserItem;
