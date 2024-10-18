import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { Button } from '@smar/ui';

import { goToContactForm } from 'features/contact-us';

import styles from './styles.module.scss';

const scrollToStart = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const logo = (
  <picture onClick={scrollToStart}>
    <source media="(min-width: 1024px)" srcSet="/logo.svg" />
    <img src="/logo-small.svg" alt="SmartForming" height="32" className={styles.logo} />
  </picture>
);

export const Header: FC<{ variant?: 'fixed' | 'static' }> = ({ variant = 'fixed' }) => {
  const { pathname } = useRouter();

  return (
    <header className={clsx(styles.root, styles[variant])}>
      <nav className="container">
        {pathname === '/' ? (
          logo
        ) : (
          <Link href="/">
            <a>{logo}</a>
          </Link>
        )}

        <ul>
          <li>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/store/modules`} className={styles.link}>
              Marketplace
            </a>
          </li>
          <li>
            <Link href="/about" passHref>
              <a className={clsx(styles.link, pathname === '/about' && styles.linkActive)}>
                About us
              </a>
            </Link>
          </li>
          <li>
            <button className={styles.link} onClick={goToContactForm}>
              Contact us
            </button>
          </li>
        </ul>

        <ul className={styles.extraMenuItems}>
          <li>
            <Button as="a" href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-in`} variant="link">
              Log in
            </Button>
          </li>
          <li>
            <Button as="a" href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`}>
              Sign up
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
