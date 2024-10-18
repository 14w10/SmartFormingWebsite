import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useDebounce, useIntersection } from 'react-use';
import clsx from 'clsx';
import { useCombobox } from 'downshift';

import { Spinner } from '@smar/ui';

import { getComputationModulesQueryKey } from 'features/store';

import { CheckboxField } from './checkbox';
import { SearchInput } from './search-input';

export const SelectModules = ({
  onChange,
  value = [],
  categoryId,
}: {
  onChange?: (changes?: any) => void;
  value?: any[];
  categoryId: string;
}) => {
  const intersectionRef = useRef(null);
  const rootRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: rootRef.current,
    rootMargin: '600px',
    threshold: 1,
  });
  const [searchValue, setSearchValue] = useState<string>();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  useDebounce(() => setDebouncedSearchValue(searchValue), 400, [searchValue]);

  const { data, fetchNextPage, isLoading, isFetching } = useInfiniteQuery<ComputationModulesDTO>(
    getComputationModulesQueryKey({ per: 20, search: debouncedSearchValue, categoryId }),
    {
      getNextPageParam: (data, pages) => ({ page: pages.length + 1 }),
    },
  );

  useEffect(() => {
    if (
      !isLoading &&
      intersection?.isIntersecting &&
      data?.pages?.[0]?.meta?.totalPages &&
      data?.pages?.[0]?.meta?.totalPages > data?.pageParams?.length
    ) {
      fetchNextPage();
    }
  }, [data?.pageParams?.length, data?.pages, fetchNextPage, intersection, isLoading]);

  const options = useMemo(
    () =>
      (data?.pages.reduce<Module[]>((acc, item) => [...acc, ...item.payload], []) || []).map(
        item => ({
          label: item.title,
          value: { id: item.id.toString(), onMainPage: item.onMainPage },
        }),
      ) || [],
    [data?.pages],
  );

  const { getMenuProps, getInputProps, getItemProps, /*getComboboxProps*/ } = useCombobox({
    onInputValueChange({ inputValue }) {
      setSearchValue(inputValue);
    },
    items: options,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return;
      }
      const index = value.findIndex(item => item.value.id === selectedItem.value.id);
      if (index > 0) {
        onChange?.([...value.slice(0, index), ...value.slice(index + 1)]);
      } else if (index === 0) {
        onChange?.([...value.slice(1)]);
      } else {
        onChange?.([
          ...value,
          {
            ...selectedItem,
            value: { ...selectedItem.value, onMainPage: !selectedItem.value.onMainPage },
          },
        ]);
      }
    },
    selectedItem: null,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep menu open after selection.
            highlightedIndex: state.highlightedIndex,
            inputValue: '', // don't add the item string as input value at selection.
          };
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            inputValue: '', // don't add the item string as input value at selection.
          };
        default:
          return changes;
      }
    },
  });
  return (
    <div /*{...getComboboxProps()}*/>
      <div className="flex flex-col">
        <SearchInput placeholder="Search modules" {...getInputProps()} />
      </div>
      <ul
        {...getMenuProps({ ref: rootRef })}
        className="h-34 border-secondaryDarkBlue940 border border-t-0 overflow-y-auto"
      >
        {isLoading ? (
          <div className="flex items-center justify-center pb-2 h-full border-none">
            <Spinner size="md" />
          </div>
        ) : (
          <>
            {options.length > 0 ? (
              options.map((item, index) => {
                const isSelectedItem = value.find(selected => item.value.id === selected.value.id);
                return (
                  <li
                    className={clsx(
                      'border-secondaryDarkBlue940 px-2 py-1',
                      options.length - 1 !== index && 'border-b',
                    )}
                    key={`${item.value.id}${index}`}
                  >
                    <CheckboxField
                      text={item.label}
                      {...getItemProps({
                        item,
                        index,
                        checked: isSelectedItem
                          ? isSelectedItem.value.onMainPage
                          : item.value.onMainPage,
                      })}
                    />
                  </li>
                );
              })
            ) : (
              <li className={clsx('border-secondaryDarkBlue940 v-p130 px-2 py-1')}>Not found</li>
            )}
            {isFetching && (
              <li className={clsx('border-secondaryDarkBlue940 v-p130 px-2 py-1')}>Loading...</li>
            )}
          </>
        )}
        <div ref={intersectionRef} className="border-none" />
      </ul>
    </div>
  );
};
