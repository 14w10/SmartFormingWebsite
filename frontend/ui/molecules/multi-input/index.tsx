import { KeyboardEvent, useCallback } from 'react';
import styled from 'astroturf/react';

import { Icon, Input, InputProps } from '../../atoms';

const Label = styled.div`
  @apply v-label110 text-primaryBlue910 border-primaryBlue910 rounded-full border inline-flex;
`;

type MultiInputProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  withHelperText?: boolean;
  placeholder?: string;
  className?: string;
  variant?: InputProps['variant'];
  width?: number | string;
};

export const MultiInput = ({
  value,
  onChange,
  withHelperText,
  placeholder,
  variant = 'secondary',
  className,
  width = 232,
}: MultiInputProps) => {
  const addKeyWord = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const inputValue = (e.target as any).value;
      if (inputValue === '') return;

      if (e.key === 'Enter') {
        const fieldValue = value || [];
        onChange?.([...fieldValue, (inputValue as string).toLowerCase()]);
        (e.target as any).value = '';
      }
    },
    [onChange, value],
  );

  const removeItem = useCallback(
    (key: number) => {
      const labels = value;
      labels?.splice(key, 1);
      labels && onChange?.([...labels]);
    },
    [onChange, value],
  );

  return (
    <div className={`w-full ${className || ''}`}>
      <div className="flex items-center w-full">
        <Input
          variant={variant}
          onKeyUp={addKeyWord}
          placeholder={placeholder}
          style={{ width: withHelperText ? width : '100%' }}
        />
        {withHelperText && <p className="v-p130 ml-2">Add keywords by click on 'Enter'</p>}
      </div>
      <div className="mt-3">
        {value?.map((item, i) => (
          <Label key={`${item}-${i}`} className="mr-1 px-1">
            <span className="leading-none" style={{ paddingTop: 7 }}>
              {item}
            </span>
            <div onClick={() => removeItem(i)}>
              <Icon name="close" size={16} />
            </div>
          </Label>
        ))}
      </div>
    </div>
  );
};
