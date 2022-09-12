import { ChangeEvent, useState } from 'react';

const useField = (type: string) => {
  const [value, setValue] = useState('');

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue('');
  };

  const inputVars = {
    type,
    value,
    onChange,
  };

  return {
    type,
    value,
    onChange,
    reset,
    inputVars,
  };
};

export { useField };
