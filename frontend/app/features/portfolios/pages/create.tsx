import { withPageAuth } from 'features/auth';
import { AuthorsProvider } from 'features/author/hook/use-authors';
import { Head, LayoutWithSidebar } from 'features/layout';

import { PickModuleProvider } from '../hooks/use-pick-module';
import { CreateModuleForm } from '../organisms/create-portfolio-form';
const CreatePortfolio = () => (
  <LayoutWithSidebar
    breadcrumbs={[
      { label: 'SUBMISSIONS' },
      {
        href: '/portfolios',
        label: 'Portfolios',
      },
      { label: 'Upload Portfolio' },
    ]}
  >
    <h1 className="v-h300 mb-2">Upload Portfolio</h1>
    <Head title="Upload Portfolio" />
    <div className="grid grid-cols-4">
      <div className="col-span-3">
        <PickModuleProvider>
          <AuthorsProvider>
            <CreateModuleForm />
          </AuthorsProvider>
        </PickModuleProvider>
      </div>
    </div>
  </LayoutWithSidebar>
);

export const CreatePortfolioPage = withPageAuth({ roles: ['admin'] })(CreatePortfolio);
