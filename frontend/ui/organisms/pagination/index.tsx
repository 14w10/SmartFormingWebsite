import { FC, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DropdownSelect, Icon, Typography } from '@smar/ui';

import st from './styles.module.scss';

type PaginationType = {
  per: number;
  totalPages?: number;
  totalCount?: number;
};

type ChevronLeftProps = {
  page: number;
  query: any;
  pathname: string;
  asPathName: string;
};

const ChevronLeft = ({ page, query, pathname, asPathName }: ChevronLeftProps) => {
  if (page === 1) {
    return (
      <Icon name="chevron-left" size={24} className={`${st.arrowIcon} ${st.arrowIconDisabled}`} />
    );
  }

  return (
    <Link
      href={{ pathname, query: { ...query, page: page - 1 } }}
      as={{ pathname: asPathName, query: { ...query, page: page - 1 } }}
      passHref
    >
      <Icon name="chevron-left" size={24} className={st.arrowIcon} />
    </Link>
  );
};

type ChevronRightProps = {
  page: number;
  totalPages: number;
  query: any;
  pathname: string;
  asPathName: string;
};

const ChevronRight = ({ page, totalPages, query, pathname, asPathName }: ChevronRightProps) => {
  if (page >= totalPages) {
    return (
      <Icon name="chevron-right" size={24} className={`${st.arrowIcon} ${st.arrowIconDisabled}`} />
    );
  }

  return (
    <Link
      href={{ pathname, query: { ...query, page: page + 1 } }}
      as={{ pathname: asPathName, query: { ...query, page: page + 1 } }}
      passHref
    >
      <Icon name="chevron-right" size={24} className={st.arrowIcon} />
    </Link>
  );
};

// TODO: Add DropDown, finish off Pagination component
export const Pagination: FC<PaginationType> = ({ per, totalPages = 1, totalCount = 0 }) => {
  const { query, pathname, asPath } = useRouter();
  const page = Number(query.page as string) || 1;
  const asPathName = useMemo(() => asPath.split('?')[0], [asPath]);

  const showing = useMemo(() => {
    if (page > totalPages) return `0-0 of ${totalCount}`;
    if (totalPages === 1) return `1-${totalCount} of ${totalCount}`;
    const onPage = page * per;
    return `${onPage - per + 1}-${onPage > totalCount ? totalCount : onPage} of ${totalCount}`;
  }, [page, per, totalCount, totalPages]);

  const pagesItems = useMemo(() => {
    const range = 5;
    let start = 1;
    const paging: number[] = [];

    if (range > totalPages) {
      return Array(totalPages || 1)
        .fill(null)
        .map((_, i) => i + 1);
    }

    // Don't use negative values, force start at 1
    if (page < range / 2 + 1) {
      start = 1;

      // Don't go beyond the last page
    } else if (page >= totalPages - range / 2) {
      start = Math.floor(totalPages - range + 1);
    } else {
      start = page - Math.floor(range / 2);
    }

    for (let i = start; i <= start + range - 1; i++) {
      paging.push(i);
    }
    return paging;
  }, [page, totalPages]);

  const items = [{ option: 16, value: 16 }];
  return (
    <div className={st.root}>
      <DropdownSelect
        items={items}
        direction="up"
        width="auto"
        defaultValue={{ option: 16, value: 16 }}
      />
      <div className={st.pagination}>
        <ChevronLeft page={page} query={query} pathname={pathname} asPathName={asPathName} />
        {pagesItems.length > 1 &&
          pagesItems.map(item => {
            let className = `${st.pageNumber}`;

            if (item === page) {
              className = className + ` ${st.pageNumberActive}`;
            }
            return (
              <Link
                key={item}
                href={{ pathname, query: { ...query, page: item } }}
                as={{ pathname: asPathName, query: { ...query, page: item } }}
                passHref
              >
                <Typography as="a" variant="button160" className={className}>
                  {item}
                </Typography>
              </Link>
            );
          })}
        {pagesItems[pagesItems.length - 1] !== (totalPages || 1) && (
          <>
            <Typography variant="button160" className={`${st.pageNumber} ${st.pageNumberDisabled}`}>
              ...
            </Typography>
            <Link
              href={{ pathname, query: { ...query, page: totalPages } }}
              as={{ pathname: asPathName, query: { ...query, page: totalPages } }}
              passHref
            >
              <Typography as="a" variant="button160" className={st.pageNumber}>
                {totalPages}
              </Typography>
            </Link>
          </>
        )}
        <ChevronRight
          page={page}
          totalPages={totalPages}
          query={query}
          pathname={pathname}
          asPathName={asPathName}
        />
      </div>
      <Typography variant="text110" color="secondaryDarkBlue">
        Showing: {showing}
      </Typography>
    </div>
  );
};
