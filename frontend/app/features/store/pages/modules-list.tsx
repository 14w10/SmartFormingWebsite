import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounce } from 'react-use';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Pagination, Search, Typography } from '@smar/ui';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';

import { getCategoriesQueryKey, getComputationModulesQueryKey } from '../api';
import { CategoryFilter } from '../molecules/module/category-filter';
import { ModulesList } from '../organisms/modules-list';

import st from './styles.module.scss';

const breadcrumbs = [
  { label: 'Marketplace' },
  { label: 'Functional modules', href: '/store/modules' },
  { label: 'All' },
];

// TODO: add loading - ideally skeleton
const ModuleList: NextPage = () => {
  const { query, push, pathname } = useRouter();

  const { data, isLoading } = useQuery<ComputationModulesDTO>(
    getComputationModulesQueryKey(query),
    { onError: () => null },
  );
  const { data: categoriesData } = useQuery<APIListResponse<Category>>(getCategoriesQueryKey());
  const [searchValue, setSearchValue] = useState(query.search as string);

  const handleChangeSearch = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page: _, search, ...q } = query;
    const newSearch = searchValue ? { search: searchValue } : {};
    const newQuery = {
      ...q,
      ...newSearch,
    };

    push({ pathname, query: newQuery });
  }, [query, searchValue, push, pathname]);

  useDebounce(handleChangeSearch, 400, [searchValue]);

  const changeFilter = useCallback(
    (value?: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { categoryId: _, ...q } = query;
      const newQuery = q;
      if (value) {
        newQuery.categoryId = value;
      }

      push({ pathname, query: newQuery });
    },
    [pathname, push, query],
  );

  const noResults = useMemo(() => !data?.payload?.length, [data]);

  const defaultValue = {
    option:
      (categoriesData?.payload || []).find(item => item.id == query.categoryId)?.name || 'Show all',
    value: parseFloat(query.categoryId as string) || '',
  };

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <Head title="Functional Modules" />

      <Typography as="h1" variant="h300" mb={2}>
        Functional Modules
      </Typography>

      <div className={st.searchWrap}>
        <Search value={searchValue} onChange={setSearchValue} style={{ width: 370 }} />
        <CategoryFilter value={defaultValue} onSelect={changeFilter} />
      </div>

      {!noResults && data && (
        <div className={st.listPaginationWrapper}>
          <ModulesList items={data.payload} />

          <Pagination
            per={16}
            totalCount={data?.meta?.totalCount}
            totalPages={data?.meta?.totalPages}
          />
        </div>
      )}

      {!isLoading && noResults && (
        <div className={st.searchResultsNotFound}>
          <Typography variant="h300" color="secondaryDarkBlue900">
            Nothing found
          </Typography>
          <Typography variant="text150" color="secondaryDarkBlue920">
            Please check spelling or try different keywords
          </Typography>
        </div>
      )}
    </LayoutWithSidebar>
  );
};

ModuleList.getInitialProps = async ctx => {
  // skip prefetch on client
  if (!ctx.req) return {};

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getComputationModulesQueryKey(ctx.query), fetcher);
  await queryCache.fetchQuery(getCategoriesQueryKey(), fetcher);

  return getDehydratedProps();
};

export const ModuleListPage = withPageAuth([{ roles: ['user'] }, { pageType: 'publicOnly' }])(
  ModuleList,
);
