import React, { ChangeEvent } from 'react';
import { useDrag } from 'react-dnd';
import { Checkbox, IconButton, Input } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
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
      <Input
        name="name"
        type="text"
        placeholder='Name'
        value={name ?? ''}
        size='sm'
        onChange={(e) => modifyItem(e, userItem)}
      />
      <Input
        name="description"
        type="text"
        placeholder='Description'
        value={description ?? ''}
        size='sm'
        onChange={(e) => modifyItem(e, userItem)}
      />
      <Input
        name="weight"
        type="number"
        value={weight ?? ''}
        size='sm'
        onChange={(e) => modifyItem(e, userItem)}
      /> g
      <Checkbox
        name="publicVisibility"
        type="checkbox"
        checked={publicVisibility}
        onChange={(e) => modifyItem(e, userItem)}
      />
      <IconButton
        onClick={() => dispatch(removeUserItem(id))}
        icon={<DeleteIcon />}
        aria-label={'delete user item'}
        size='xs'
      />
    </div>
  );
};

export default UserItem;
