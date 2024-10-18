import { useQuery } from 'react-query';
import { NextPage } from 'next';
import clsx from 'clsx';

import { Card } from '@smar/ui';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';

import { getAdminCategoriesQueryKey } from '../api';
import { CreateCategory } from '../organisms/create-category';
import { RemoveCategory } from '../organisms/remove-category';
import { UpdateCategory } from '../organisms/update-category';

const breadcrumbs = [{ label: 'Settings' }, { label: 'Categories' }];

const CategoryList: NextPage = () => {
  const { data } = useQuery<APIListResponse<Category>>(getAdminCategoriesQueryKey());
  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <Head title="Categories" />
      <div className="flex items-center justify-between">
        <h1 className="v-h300 mb-2">Categories</h1>
        <CreateCategory />
      </div>
      <Card className="mt-3">
        {data?.payload?.map((item, i) => (
          <div
            key={item.id}
            className={clsx(
              'border-secondaryDarkBlue940 flex items-center justify-between py-2 h-9',
              data?.payload.length - 1 !== i && 'border-b',
            )}
          >
            <div className="flex gap-4 items-center">
              <div className="inline-flex items-center w-5 h-5">
                {item.icon && <img src={item.icon?.url} className="w-full" alt="" />}
              </div>
              <p className="text-secondaryDarkBlue900 v-h160" style={{ width: 211 }}>
                {item.name}
              </p>
              <p className="text-secondaryDarkBlue910 v-text130">
                {item.publishedComputationModulesCount} Modules
              </p>
            </div>
            <div className="flex gap-4">
              <UpdateCategory {...item} />
              <RemoveCategory categoryId={item.id} />
            </div>
          </div>
        ))}
      </Card>
    </LayoutWithSidebar>
  );
};

CategoryList.getInitialProps = async ctx => {
  if (!ctx.req) return {};

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getAdminCategoriesQueryKey(ctx.query), fetcher);

  return getDehydratedProps();
};

export const CategoryListPage = withPageAuth({ roles: ['admin', 'editor'] })(CategoryList);
