import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounce } from 'react-use';
import { useRouter } from 'next/router';

import { Pagination, Search, Typography } from '@smar/ui';

import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';

import { getStorePortfoliosQueryKey } from '../api';
import { PortfolioCard } from '../molecules/portfolio/portfolio-card';

import st from './styles.module.scss';

const StorePortfolios = () => {
  const { query, push, pathname } = useRouter();

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
  const { data, isLoading } = useQuery<APIListResponse<Portfolio>>(
    getStorePortfoliosQueryKey(query),
  );

  const noResults = useMemo(() => !data?.payload?.length, [data]);
  return (
    <LayoutWithSidebar breadcrumbs={[{ label: 'MARKETPLACE' }, { label: 'Portfolios' }]}>
      <Head title="Portfolios" />
      <h1 className="v-h300 mb-2">Portfolios</h1>

      <div className={st.searchWrap}>
        <Search value={searchValue} onChange={setSearchValue} style={{ width: 370 }} />
      </div>

      {!noResults && data && (
        <div className={st.listPaginationWrapper}>
          <div className="grid gap-4 grid-cols-2">
            {data?.payload?.map(item => (
              <PortfolioCard key={item.id} data={item} />
            ))}
          </div>

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

export const StorePortfoliosPage = withPageAuth([{ roles: ['user'] }, { pageType: 'publicOnly' }])(
  StorePortfolios,
);
