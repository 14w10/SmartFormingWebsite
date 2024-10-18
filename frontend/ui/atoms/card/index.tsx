import { FC } from 'react';
import cn from 'clsx';

import styles from './styles.module.scss';

type CardProps = {
  as?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
} & Record<string, any>;

export const Card: FC<CardProps> = ({ as = 'div', size = 'sm', className, children, ...props }) => {
  const Comp = as as any;

  return (
    <Comp className={cn(styles.root, styles[size], className)} {...props}>
      {children}
    </Comp>
  );
};
