import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { TablePagination } from '@material-ui/core';

interface IPagination {
  totalCount?: number;
}

export const Pagination = ({ totalCount }: IPagination) => {
  const { pathname, query, push } = useRouter();

  const page = useMemo(() => parseInt(query.page as string) || 1, [query.page]);

  const handleChangePage = useCallback(
    (_: any, page: number) => {
      const url = { pathname, query: { ...query, page: page + 1 } };
      push(url, url, { shallow: true });
    },
    [pathname, push, query],
  );

  return (
    <TablePagination
      rowsPerPageOptions={[25]}
      component="div"
      count={totalCount || 0}
      rowsPerPage={25}
      page={page - 1}
      backIconButtonProps={{
        'aria-label': 'previous page',
      }}
      nextIconButtonProps={{
        'aria-label': 'next page',
      }}
      onPageChange={handleChangePage}
    />
  );
};
