import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useWindowScroll, useWindowSize } from 'react-use';

import { getScrollBarWidth } from '../../util';

import styles from './styles.module.scss';

export const FullPageHorizontal: FC<{ children: ReactNode }> = ({ children }) => {
  const [style, styleSet] = useState({ minHeight: '200vh' });

  const count = useMemo(() => React.Children.count(children), [children]);
  const { y } = useWindowScroll();
  const { width, height } = useWindowSize(0);
  const isEnabled = width >= 1024;

  useEffect(() => {
    if (!isEnabled) return;

    styleSet({ minHeight: `${(count - 1) * (width - getScrollBarWidth()) + height}px` });
  }, [isEnabled, width, height, count]);

  return (
    <div className={styles.root} style={style}>
      <div className={styles.scroller}>
        <div
          className={styles.container}
          style={{ transform: `translate3d(calc(-${isEnabled && y ? y : 0}px), 0, 0)` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const FullPageHorizontalItem: FC = p => <section className={styles.item} {...p} />;
