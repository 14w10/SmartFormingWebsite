import Link from 'next/link';

import { Icon, IconsType, Typography } from '@smar/ui';

import st from './styles.module.scss';

type SidebarDataType = {
  group: string;
  icon: IconsType;
  items: {
    label: string;
    link: string;
    active: boolean;
  }[];
}[];

const sidebarData: SidebarDataType = [
  {
    group: 'Marketplace',
    icon: 'store',
    items: [
      {
        label: 'Functional Modules',
        link: '/store/modules',
        active: true,
      },
      {
        label: 'Portfolios',
        link: '/store/portfolios',
        active: false,
      },
    ],
  },
  {
    group: 'Orders',
    icon: 'order-list',
    items: [
      {
        label: 'Functional Modules',
        link: '/orders/modules',
        active: false,
      },
      {
        label: 'Portfolios',
        link: '/orders/portfolios',
        active: false,
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
        active: false,
      },
      {
        label: 'My Portfolios',
        link: '/my/portfolios',
        active: false,
      },
    ],
  },
];

export const Sidebar = () => {
  return (
    <aside className={st.root}>
      <div className={st.contentWrapper}>
        <div className={st.logo}>
          <Link href="/store/modules">
            <a>
              <img
                src="/app-assets/logo.svg"
                width="184"
                height="24"
                alt="SmartForming logo"
                className="mx-auto"
              />
            </a>
          </Link>
        </div>
        <div className={st.content}>
          {sidebarData.map((item, i) => (
            <div key={i} className={st.group}>
              <div className={st.title}>
                <Icon name={item.icon} mr={2} size={24} />
                <Typography variant="h160" color="secondaryDarkBlue900">
                  {item.group}
                </Typography>
              </div>
              {item.items.map((item, i) => (
                <Link key={i} href={item.link} passHref>
                  <Typography
                    as="a"
                    className={`${st.subTitle} ${item.active && st.subTitleActive}`}
                    variant="text150"
                    color={item.active ? 'primaryBlue900' : 'secondaryDarkBlue920'}
                  >
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
