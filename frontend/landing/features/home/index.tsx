import { FullPageHorizontal, FullPageHorizontalItem } from '@smar/ui';

import { ContactUs } from 'features/contact-us';
import { Header } from 'features/layout/header';

import { Discover } from './discover';
import { HowItWorks } from './how-it-works';
import { WorkflowScreen1, WorkflowScreen2 } from './workflow';

export const HomePage = () => {
  return (
    <>
      <Header />

      <FullPageHorizontal>
        <FullPageHorizontalItem>
          <Discover />
        </FullPageHorizontalItem>
        <FullPageHorizontalItem>
          <HowItWorks />
        </FullPageHorizontalItem>
        <FullPageHorizontalItem>
          <WorkflowScreen1 />
        </FullPageHorizontalItem>
        <FullPageHorizontalItem>
          <WorkflowScreen2 />
        </FullPageHorizontalItem>
        <FullPageHorizontalItem>
          <ContactUs />
        </FullPageHorizontalItem>
      </FullPageHorizontal>
    </>
  );
};
