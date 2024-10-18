import React, { CSSProperties } from 'react';

import { Icon, Input, InputProps } from '@smar/ui';

export type SearchProps = {
  value?: string;
  onChange?: (value: string) => void;
  variant?: InputProps['variant'];
  className?: string;
  style?: CSSProperties;
} & Record<string, any>;

export const SearchInput = ({ variant = 'secondary', className, ...rest }: SearchProps) => {
  return (
    <div
      className={`focus-within:text-secondaryDarkBlue910 text-secondaryDarkBlue921 relative max-w-full ${
        className || ''
      }`}
    >
      <Input
        id="search"
        className="border-secondaryDarkBlue940 pl-6 w-full border rounded-b shadow-none"
        variant={variant}
        type="text"
        {...(rest as any)}
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
