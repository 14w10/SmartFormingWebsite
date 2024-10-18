import Link from 'next/link';
import { useRouter } from 'next/router';

import { Icon, IconsType, Typography } from '@smar/ui';

import { useCurrentUser } from 'features/user';

import st from './styles.module.scss';

type SidebarDataType = {
  group?: string;
  icon?: IconsType;
  items: {
    label: string;
    link: string;
  }[];
}[];

const sidebarData: Record<UserRole | 'guest', SidebarDataType> = {
  guest: [
    {
      group: 'Marketplace',
      icon: 'store',
      items: [
        {
          label: 'Functional Modules',
          link: '/store/modules',
        },
        {
          label: 'Portfolios',
          link: '/store/portfolios',
        },
      ],
    },
  ],
  user: [
    {
      group: 'Marketplace',
      icon: 'store',
      items: [
        {
          label: 'Functional Modules',
          link: '/store/modules',
        },
        {
          label: 'Portfolios',
          link: '/store/portfolios',
        },
      ],
    },
    {
      group: 'Orders',
      icon: 'order-list',
      items: [
        {
          label: 'Functional Module Computations',
          link: '/orders/modules',
        },
        {
          label: 'Portfolio Computations',
          link: '/orders/portfolios',
        },
      ],
    },
    {
      group: 'My Account',
      icon: 'my-account',
      items: [
        {
          label: 'My Functional Modules',
          link: '/my/modules',
        },
        {
          label: 'My Chronicle', 
          link: '/my/chronicles'
        },
      ],
    },
  ],
  admin: [
    {
      group: 'User List',
      icon: '24px-my-account',
      items: [
        {
          label: 'Signup Requests',
          link: '/signups',
        },
        {
          label: 'Users',
          link: '/users',
        },
        {
          label: 'Admins',
          link: '/admins',
        },
        {
          label: 'Editors',
          link: '/editors',
        },
      ],
    },
    {
      group: 'Submissions',
      icon: '24px-order-list',
      items: [
        {
          label: 'Module Submissions',
          link: '/modules',
        },
        {
          label: 'Portfolio Submissions',
          link: '/portfolios',
        },
        {
          label: 'Computations modules',
          link: '/computations',
        },
        {
          label: 'Portfolio Computations',
          link: '/portfolio-requests',
        },
        {
          label: 'Chronicles', 
          link: '/chronicles-upload',
        },
      ],
    },
    {
      group: 'Settings',
      icon: 'settings',
      items: [
        {
          label: 'Categories',
          link: '/categories',
        },
      ],
    },
  ],
  editor: [
    {
      group: 'User List',
      icon: '24px-my-account',
      items: [
        {
          label: 'Signup Requests',
          link: '/signups',
        },
        {
          label: 'Users',
          link: '/users',
        },
        {
          label: 'Admins',
          link: '/admins',
        },
        {
          label: 'Editors',
          link: '/editors',
        },
      ],
    },
    {
      group: 'Submissions',
      icon: '24px-order-list',
      items: [
        {
          label: 'Module Submissions',
          link: '/modules',
        },
        {
          label: 'Portfolio Submissions',
          link: '/portfolios',
        },
        {
          label: 'Computations',
          link: '/computations',
        },
        {
          label: 'Portfolio Requests',
          link: '/portfolio-requests',
        },
      ],
    },
  ],
};

export const Sidebar = () => {
  const { currentUser } = useCurrentUser();
  const { asPath } = useRouter();

  const sidebarLinks = currentUser ? sidebarData[currentUser.role] : sidebarData['guest'];

  return (
    <aside className={st.root}>
      <div className={st.contentWrapper}>
        <div className={st.logo}>
          <a href={process.env.NEXT_PUBLIC_LANDING_URL}>
            <img
              src="/logo.svg"
              width="184"
              height="24"
              alt="SmartForming logo"
              className="mx-auto"
            />
          </a>
        </div>
        <div className={st.content}>
          {sidebarLinks.map((item, i) => (
            <div key={i} className={st.group}>
              {item.group && item.icon && (
                <div className={st.title}>
                  <Icon name={item.icon} mr={2} size={24} />
                  <Typography variant="h160" color="secondaryDarkBlue900">
                    {item.group}
                  </Typography>
                </div>
              )}
              {item.items.map((item, i) => {
                const active = asPath.match(item.link);
                return (
                  <Link key={i} href={item.link} passHref>
                    <Typography
                      as="a"
                      className={`${st.subTitle} ${active && st.subTitleActive}`}
                      variant="text150"
                      color={active ? 'primaryBlue900' : 'secondaryDarkBlue920'}
                      href={item.link}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
