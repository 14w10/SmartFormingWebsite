import { ChangeEvent, HTMLAttributes, useCallback } from 'react';

import { Input, InputProps } from '../../atoms';

const truncateString = (string: string, maxLength: number) => `${string.slice(0, maxLength)}`;

export const TextAreaLimit = ({
  limit = 150,
  onChange,
  value,
  ...props
}: {
  variant?: InputProps['variant'];
  error?: boolean;
  limit?: number;
  value?: string;
  onChange?: (e: string) => void;
} & Record<string, any> &
  Omit<HTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(truncateString(e.target.value, limit));
    },
    [limit, onChange],
  );

  return (
    <div className="relative">
      <Input {...props} onChange={handleChange} value={value} />
      <p className="v-p130 text-secondaryDarkBlue920 right-12px bottom-12px absolute">
        {value?.length || 0}/{limit}
      </p>
    </div>
  );
};
