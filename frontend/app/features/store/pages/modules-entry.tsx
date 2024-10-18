import { NextPage } from 'next';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';

import { getComputationModulesQueryKey } from '../api';
import { CategoriesModulesList } from '../organisms/category-modules-list';
import { MonthModulesList } from '../organisms/category-modules-list/month-popular-moduels';
import { ModulesBanner } from '../organisms/modules-banner';
import { SubscribeForm } from '../organisms/subcribe-form';
import { useModules } from '../use-modules';

const breadcrumbs = [{ label: 'Marketplace' }, { label: 'Functional modules' }];

const ModuleEntry: NextPage = () => {
  const { popularModules, allCategories } = useModules();

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <Head title="Functional Modules" />
      <ModulesBanner />
      <MonthModulesList
        items={popularModules.data?.payload}
        title="This Month Popular"
        buttonText="View all modules"
        showButton
      />
      {allCategories.data?.payload.map(item => (
        <CategoriesModulesList key={item.id} buttonText="View more" category={item} />
      ))}

      <SubscribeForm />
    </LayoutWithSidebar>
  );
};

ModuleEntry.getInitialProps = async ctx => {
  // skip prefetch on client
  if (!ctx.req) return {};

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getComputationModulesQueryKey(ctx.query), fetcher);

  return getDehydratedProps();
};

export const ModuleEntryPage = withPageAuth([{ roles: ['user'] }, { pageType: 'publicOnly' }])(
  ModuleEntry,
);
