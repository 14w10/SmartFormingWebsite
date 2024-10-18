import React, { FC } from 'react';
import cn from 'clsx';

import styles from './styles.module.scss';

export type ButtonProps = {
  as?: React.ElementType;
  type?: 'submit' | 'button' | any;
  className?: string;
  variant?: 'solid' | 'solidRed' | 'outlined' | 'underlined' | 'link' | 'icon' | 'linkRed';
  size?: 'sm' | 'md' | 'xs' | 'xsm';
  disabled?: boolean;
} & Record<string, any>;

export const Button: FC<ButtonProps> = ({
  as = 'button',
  variant = 'solid',
  size = 'sm',
  className,
  type = 'button',
  ...props
}) => {
  const Comp = as;

  return <Comp className={cn(styles[variant], styles[size], className)} type={type} {...props} />;
};
