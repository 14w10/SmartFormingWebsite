import React, { CSSProperties, useCallback } from 'react';

import { Icon, Input, InputProps } from '@smar/ui';

export type SearchProps = {
  value?: string;
  onChange?: (value: string) => void;
  variant?: InputProps['variant'];
  className?: string;
  style?: CSSProperties;
} & Record<string, any>;

export const Search = ({
  value,
  onChange,
  variant = 'secondary',
  className,
  placeholder = 'Search by module title, ID or keyword',
  ...rest
}: SearchProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value),
    [onChange],
  );

  return (
    <div
      className={`focus-within:text-secondaryDarkBlue910 text-secondaryDarkBlue921 relative max-w-full ${
        className || ''
      }`}
      {...rest}
    >
      <Input
        id="search"
        className="pl-6 w-full"
        variant={variant}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange && handleChange}
      />
      <label
        htmlFor="search"
        className="left-12px top-12px absolute leading-none cursor-pointer transition duration-200"
      >
        <Icon name="search" size={24} />
      </label>
    </div>
  );
};
