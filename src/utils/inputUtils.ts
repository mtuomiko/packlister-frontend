import { ChangeEvent } from 'react';

export const parseValue = (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target.type === 'number') {
    const parsedInt = parseInt(event.target.value);
    return isNaN(parsedInt) ? '' : parsedInt;
  }
  return event.target.value;
};
