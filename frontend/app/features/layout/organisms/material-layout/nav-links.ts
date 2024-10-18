interface INavLink {
  [key: string]: ILink[];
}

interface ILink {
  scope?: string;
  title: string;
  url: string;
}

export const navLinks: INavLink = {
  user: [
    {
      scope: 'Store',
      title: 'Functional Modules',
      url: '/store/modules',
    },
    {
      title: 'Portfolios',
      url: '/store/portfolios',
    },
    {
      scope: 'Orders',
      title: 'Functional Modules',
      url: '/orders/modules',
    },
    {
      title: 'Portfolio Requests',
      url: '/orders/portfolios',
    },
    {
      scope: 'My Account',
      title: 'My Functional Modules',
      url: '/my/modules',
    },
    {
      title: 'My Portfolios',
      url: '/my/portfolios',
    },
  ],
  admin: [
    {
      title: 'Signup Requests',
      url: '/signups',
    },
    {
      title: 'Users',
      url: '/users',
    },
    {
      title: 'Admins',
      url: '/admins',
    },
    {
      title: 'Editors',
      url: '/editors',
    },
    {
      title: 'Module Submissions',
      url: '/modules',
    },
    {
      title: 'Portfolio Submissions',
      url: '/portfolios',
    },
    {
      title: 'Computations',
      url: '/computations',
    },
    {
      title: 'Portfolio Requests',
      url: '/portfolio-requests',
    },
  ],
  editor: [
    {
      title: 'Signup Requests',
      url: '/signups',
    },
    {
      title: 'Users',
      url: '/users',
    },
    {
      title: 'Admins',
      url: '/admins',
    },
    {
      title: 'Editors',
      url: '/editors',
    },
    {
      title: 'Module Submissions',
      url: '/modules',
    },
    {
      title: 'Portfolio Submissions',
      url: '/portfolios',
    },
    {
      title: 'Computations',
      url: '/computations',
    },
    {
      title: 'Portfolio Requests',
      url: '/portfolio-requests',
    },
  ],
};
