import { FC } from 'react';
import cn from 'clsx';

import styles from './styles.module.scss';

type FieldProps = {
  as?: string;
  className?: string;
} & Record<string, any>;

export const Field: FC<FieldProps> = ({ as = 'input', className, ...props }) => {
  const Comp = as as any;

  return <Comp className={cn(styles.root, className)} {...props} />;
};
