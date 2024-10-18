import { useMemo } from 'react';
import { useWindowScroll } from 'react-use';
import clsx from 'clsx';

import st from './styles.module.scss';

export const Header = ({ children }: any) => {
  const { y } = useWindowScroll();
  const isScrolled = useMemo(() => y > 0, [y]);

  return (
    <header id="header" className={clsx(st.root, isScrolled && st.scrolled)}>
      {children}
    </header>
  );
};
