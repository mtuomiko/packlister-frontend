import { ChangeEvent } from 'react';

export const parseEventToValue = (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target.type === 'number') {
    const parsedInt = parseInt(event.target.value);
    return isNaN(parsedInt) ? '' : parsedInt;
  }
  if (event.target.type === 'checkbox') {
    return event.target.checked;
  }
  return event.target.value;
};
