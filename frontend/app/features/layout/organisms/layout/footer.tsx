import Link from 'next/link';

import { Icon } from '@smar/ui';

const menuItems = [
  {
    label: 'Marketplace',
    items: [
      {
        label: 'Functional Modules',
        href: '/store/modules',
      },
      {
        label: 'Portfolio',
        href: '/store/portfolios',
      },
    ],
  },
  {
    label: 'Functional Modules',
    items: [
      {
        label: 'All Modules',
        href: '/store/modules/all',
      },
      {
        label: 'Hybrid Tech',
        href: '/store/modules/all',
      },
      {
        label: 'Energy',
        href: '/store/modules/all',
      },
      {
        label: 'Medicine',
        href: '/store/modules/all',
      },
      {
        label: 'Manufacturing',
        href: '/store/modules/all',
      },
    ],
  },
];

export const Footer = () => {
  return (
    <div className="bg-secondaryDarkBlue900 grid grid-cols-12 py-4">
      <div className="col-span-3 col-start-2">
        <a href={process.env.NEXT_PUBLIC_LANDING_URL}>
          <img src="/logo-white.svg" width="184" height="24" alt="SmartForming logo" />
        </a>
        <div className="flex gap-2 mt-3 text-white">
          <a href="/" target="_blank">
            <Icon name="40px-fb" />
          </a>
          <a href="/" target="_blank">
            <Icon name="40px-instagram" />
          </a>
          <a href="/" target="_blank">
            <Icon name="40px-twitter" />
          </a>
        </div>
      </div>
      <div className="flex col-span-7 justify-around">
        {menuItems.map(item => (
          <div key={item.label}>
            <p className="v-h150 text-white">{item.label}</p>
            <div className="flex flex-col gap-1 mt-1">
              {item.items.map(item => (
                <Link href={item.href} passHref key={item.label}>
                  <a className="v-label140">{item.label}</a>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
