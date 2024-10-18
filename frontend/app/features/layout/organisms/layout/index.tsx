import { FC, ReactNode } from 'react';
import Link from 'next/link';

import { BreadcrumbProps, Breadcrumbs, Button, Header, Menu } from '@smar/ui';

import { useLogout } from 'features/auth';
import { useCurrentUser } from 'features/user';

import { HeadRoot } from '../head';
import { Footer } from './footer';
import { Sidebar } from './sidebar';

import st from './styles.module.scss';

export const LayoutDefault: FC<{ className?: string; children: ReactNode }> = ({ children, className }) => (
  <>
    <HeadRoot />
    <main className={className}>{children}</main>
  </>
);

export const LayoutWithSidebar: FC<{ breadcrumbs: BreadcrumbProps[]; children: ReactNode }> = ({
  children,
  breadcrumbs,
}) => {
  const { currentUser } = useCurrentUser();
  const userName = `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`;
  const { mutate: logout } = useLogout();

  return (
    <div className={st.withSidebar}>
      <Sidebar />
      <div className={st.content}>
        <Header>
          <Breadcrumbs items={breadcrumbs} />
          {currentUser ? (
            <Menu userName={userName} logout={logout} />
          ) : (
            <div>
              <Link href="/sign-in" passHref>
                <Button as="a">Login</Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button as="a" className="ml-2" variant="outlined">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </Header>
        <main className={st.container}>{children}</main>
        <Footer />
      </div>
    </div>
  );
};
