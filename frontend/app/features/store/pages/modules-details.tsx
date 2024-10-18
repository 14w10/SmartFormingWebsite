import { useQuery } from 'react-query';
import { NextPage } from 'next';
import Link from 'next/link';

import { Button, Card, Typography } from '@smar/ui';

import { createQueryPrefetcher } from 'libs/react-query';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';
import { useCurrentUser } from 'features/user';

import { getComputationModuleQueryKey } from '../api';
import { ModuleDescription } from '../molecules/module/module-description';
import { ModuleInformation } from '../molecules/module/module-information';
import { ModulesReviewList } from '../organisms/modules-review-list';
import { PortfolioSidebarList } from '../organisms/portfolio-sidebar-list';

import st from './styles.module.scss';

interface ModulesDetailsProps {
  moduleId: string;
}

const reviewsData = [
  {
    title: 'Pellentesque habitant morbi',
    date: 'May 8, 2020',
    rating: 5,
    position: 'YDF Unit Manager',
    location: 'Youngstown, OH',
    name: 'John Smith',
    reviewText:
      'Fusce neque mi, dapibus et nisl convallis, ornare scelerisque tortor. Nunc sit amet justo id nisi hendrerit sagittis. Etiam eget turpis pulvinar, iaculis arcu ac, molestie sem.',
  },
  {
    title: 'Morbi tempus porttitor dui',
    date: 'April 11, 2020',
    rating: 3.5,
    position: 'Quality Inspector',
    location: 'Chennai',
    name: 'Tamil Nadu',
    reviewText:
      'Fusce neque mi, dapibus et nisl convallis, ornare scelerisque tortor. Nunc sit amet justo id nisi hendrerit sagittis.',
  },
  {
    title: 'Nunc tellus quam, dapibus sit amet dapibus',
    date: 'March 21, 2020',
    rating: 3,
    position: 'Quality Inspector',
    location: 'Chennai',
    name: 'Tamil Nadu',
    reviewText:
      'Quisque fringilla, risus faucibus pretium sagittis, tellus diam interdum nisl, ut tincidunt sapien nisl consectetur leo. In hac habitasse platea dictumst. Suspendisse elit nulla, vulputate sit amet ex porttitor, aliquet pellentesque nulla. Mauris id ullamcorper lorem, eget interdum dolor. Aenean semper, elit id condimentum finibus, dolor orci suscipit mi, at vehicula enim mauris eu nisl. Sed bibendum purus vel eleifend feugiat. Quisque est lectus, suscipit lobortis semper quis, finibus in augue. Quisque at eros fringilla, venenatis ex vitae, eleifend neque. Integer non semper nibh. Pellentesque tempus, ligula at tincidunt aliquet, eros neque tempus risus, ut pretium nisi libero nec ligula. Donec pellentesque semper odio sed lobortis.',
  },
  {
    title: 'Pellentesque habitant morbi',
    date: 'May 8, 2020',
    rating: 5,
    position: 'YDF Unit Manager',
    location: 'Youngstown, OH',
    name: 'Ann Perkins',
    reviewText:
      'Fusce neque mi, dapibus et nisl convallis, ornare scelerisque tortor. Nunc sit amet justo id nisi hendrerit sagittis. Etiam eget turpis pulvinar, iaculis arcu ac, molestie sem.',
  },
  {
    title: 'Morbi tempus porttitor dui',
    date: 'April 11, 2020',
    rating: 3.5,
    position: 'Quality Inspector',
    location: 'Chennai',
    name: 'Tamil Nadu',
    reviewText:
      'Fusce neque mi, dapibus et nisl convallis, ornare scelerisque tortor. Nunc sit amet justo id nisi hendrerit sagittis.',
  },
];

// TODO: add loading - ideally skeleton
const ModulesDetails: NextPage<ModulesDetailsProps> = ({ moduleId }) => {
  const { currentUser } = useCurrentUser();
  const { data } = useQuery<ComputationModuleDTO>(getComputationModuleQueryKey({ moduleId }));
  const computationModule = data?.payload;

  return (
    <LayoutWithSidebar
      breadcrumbs={[
        { label: 'Marketplace' },
        { label: 'Functional modules', href: '/store/modules' },
        { label: computationModule?.title as string },
      ]}
    >
      <Head title={`${computationModule?.title} - Functional Modules`} />
      <h1 className="v-h300 text-secondaryDarkBlue900 mb-1">Module Details</h1>
      {computationModule && (
        <div className={st.layout}>
          <div className={st.wideColumn}>
            <ModuleInformation
              computationModule={computationModule}
              className={st.moduleInformation}
            />
            <ModuleDescription
              computationModule={computationModule}
              className={st.moduleDescription}
            />
            {/* <ModulesReviewList className={st.modulesReview} reviews={reviewsData} /> */}
          </div>
          <div className={st.narrowColumn}>
            {computationModule.moduleContentType === 'functional_module' ? (
              <Card variant="sm" className={st.computationCard}>
                <Typography variant="h170" color="secondaryDarkBlue910" mb={1} textAlign="center">
                  Computation Parameters
                </Typography>
                <Typography variant="p130" color="secondaryDarkBlue920" mb={2} textAlign="center">
                  The price of the computation will depend on the data and settings you provide.
                  Make sure the information you enter is correct.
                </Typography>
                <Link
                  href={
                    currentUser
                      ? `/store/modules/${moduleId}/computation-form/${computationModule.computationFormId}`
                      : '/sign-in'
                  }
                  passHref
                >
                  <Button as="a" className={st.computationButton}>
                    request computation
                  </Button>
                </Link>
              </Card>
            ) : (
              <Card variant="sm" className={st.computationCard}>
                <Typography variant="h170" color="secondaryDarkBlue910" mb={1} textAlign="center">
                  Download Notice
                </Typography>
                <Typography variant="p130" color="secondaryDarkBlue920" mb={2} textAlign="center">
                  The price of the downloading will depend on the dataset amounts you choose
                </Typography>
                <Link
                  href={
                    currentUser
                      ? `/store/modules/${computationModule.id}/download-form`
                      : '/sign-in'
                  }
                  passHref
                >
                  <Button as="a" className={st.computationButton}>
                    request download
                  </Button>
                </Link>
              </Card>
            )}
            <PortfolioSidebarList />
          </div>
        </div>
      )}
    </LayoutWithSidebar>
  );
};

ModulesDetails.getInitialProps = async ctx => {
  const moduleId = ctx.query.moduleId?.toString() || '';

  if (!ctx.req) return { moduleId };

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await queryCache.fetchQuery(getComputationModuleQueryKey({ moduleId }), fetcher);

  return { ...getDehydratedProps(), moduleId };
};

export const ModulesDetailsPage = withPageAuth([{ roles: ['user'] }, { pageType: 'publicOnly' }])(
  ModulesDetails,
);
