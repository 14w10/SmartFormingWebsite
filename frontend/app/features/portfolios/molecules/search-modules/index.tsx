import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { useDebounce, useIntersection } from 'react-use';
import { useVirtual } from 'react-virtual';
import { useRouter } from 'next/router';
import styled from 'astroturf/react';

import { ScrollWrapper, Search, Spinner } from '@smar/ui';

import { getComputationModulesQueryKey } from 'features/store';

import { SearchItem } from './search-item';

const Wrapper = styled(ScrollWrapper)`
  & > div {
    @apply border-b border-secondaryDarkBlue930;
  }
`;

const SearchItems = ({
  data,
  searchValue,
}: {
  searchValue: string;
  data: InfiniteData<ComputationModulesDTO>;
}) => {
  const formattedData = useMemo(() => {
    const items: Module[] = [];

    data?.pages.forEach(page => {
      page.payload.forEach(item => {
        items.push(item);
      });
    });

    return { size: items.length, items };
  }, [data]);

  const parentRef = useRef(null);
  const rowVirtualizer = useVirtual({
    size: formattedData.size,
    parentRef,
  });
  return (
    <ScrollWrapper ref={parentRef} className="h-25 pr-3">
      {rowVirtualizer.virtualItems.length > 0 ? (
        <Wrapper className="relative" style={{ height: rowVirtualizer.totalSize }}>
          {rowVirtualizer.virtualItems.map(virtualRow => (
            <div
              key={virtualRow.index}
              ref={virtualRow.measureRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <SearchItem data={formattedData.items[virtualRow.index]} />
            </div>
          ))}
        </Wrapper>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="v-text130 text-secondaryDarkBlue920">
            No matches with{' '}
            <span className="text-secondaryDarkBlue900 font-bold">{searchValue}</span>
          </p>
        </div>
      )}
    </ScrollWrapper>
  );
};

export const SearchModules = () => {
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '20px',
    threshold: 1,
  });
  const { query, push, pathname, asPath } = useRouter();

  const { data, fetchNextPage, isLoading } = useInfiniteQuery<ComputationModulesDTO>(
    getComputationModulesQueryKey(query),
    {
      getNextPageParam: (data, pages) => ({ page: pages.length + 1 }),
    },
  );
  useEffect(() => {
    if (
      intersection?.isIntersecting &&
      data?.pages?.[0]?.meta?.totalPages &&
      data?.pages?.[0]?.meta?.totalPages >= data?.pageParams?.length
    ) {
      fetchNextPage();
    }
  }, [data?.pageParams?.length, data?.pages, fetchNextPage, intersection]);

  const [searchValue, setSearchValue] = useState(query.search as string);

  const handleChangeSearch = useCallback(() => {
    const asPathname = asPath.split('?')[0];
    const newQuery = {
      ...query,
      search: searchValue,
    };

    push(
      { pathname, query: newQuery },
      {
        pathname: asPathname,
        query: newQuery,
      },
      { scroll: false },
    );
  }, [asPath, query, searchValue, push, pathname]);

  useDebounce(handleChangeSearch, 400, [searchValue]);

  return (
    <div>
      <p className="v-h150">Search modules</p>
      <div className="border-secondaryDarkBlue930 rounded-large mt-1 p-2 border-2">
        <p className="v-h150 mb-1">Search</p>
        <Search
          value={searchValue}
          onChange={setSearchValue}
          className="mb-2 w-full"
          variant="default"
        />
        <div className="h-25">
          {isLoading ? (
            <div className="flex items-center justify-center pb-2 h-full border-none">
              <Spinner size="md" />
            </div>
          ) : (
            <>
              {data?.pages && <SearchItems data={data} searchValue={query.search as string} />}
              <div ref={intersectionRef} className="border-none" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
