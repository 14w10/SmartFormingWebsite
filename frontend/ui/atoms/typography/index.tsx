import { FC } from 'react';
import cn from 'clsx';
import styled from 'styled-components';
import { color, compose, space, typography } from 'styled-system';

import { ColorsType } from '@smar/ui/theme/theme-colors';

import styles from './styles.module.scss';

type TypographyProps = {
  as?: string;
  className?: string;
  style?: Record<string, any>;
  color?: ColorsType;
  variant?:
    | 'h800'
    | 'h600'
    | 'h400'
    | 'h300'
    | 'h200'
    | 'h170'
    | 'h160'
    | 'h150'
    | 'sub300'
    | 'sub200'
    | 'text110'
    | 'text130'
    | 'text150'
    | 'label120'
    | 'label140'
    | 'p130'
    | 'button120'
    | 'button160';
} & Record<string, any>;

export const composedHelpers = compose(typography, color, space);

const TypographyStyled: any = styled.p`
  ${composedHelpers}
`;

export const Typography: FC<TypographyProps> = ({ variant = 'sub300', className, ...props }) => {
  return <TypographyStyled className={cn(styles[variant], className)} {...props} />;
};
