import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';

import { DropdownSelect } from '@smar/ui';

import { getCategoriesQueryKey } from 'features/store/api';

type OptionsProps = {
  option: string;
  value: 'show all' | string | number;
};

type CategoryFilterProps = {
  value?: OptionsProps;
  onSelect: (value?: string) => void;
};

export const CategoryFilter = ({ value, onSelect }: CategoryFilterProps) => {
  const { data: categoriesData } = useQuery<APIListResponse<Category>>(getCategoriesQueryKey());

  const options = useMemo(
    () => [
      { option: 'Show all', value: '' },
      ...(categoriesData?.payload || []).map(item => ({ value: item.id, option: item.name })),
    ],
    [categoriesData?.payload],
  );

  const handleSelect = useCallback(
    (optionValue: any, i?: number) => {
      if (i === 0) return onSelect();
      return onSelect(optionValue?.value as string);
    },
    [onSelect],
  );

  return (
    <DropdownSelect
      items={options}
      selectedValue={value}
      onSelect={handleSelect}
      defaultValue={value}
      variant="separate"
    />
  );
};
