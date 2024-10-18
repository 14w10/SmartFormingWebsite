import React, { memo } from 'react';
import styled from 'styled-components';
import { size, space, compose, SizeProps, SpaceProps } from 'styled-system';

import { theme } from '../../theme';
import icons from './sprite.svg';
import { IconsType } from './types';

// Basic props for the icon, extending styled-system props
type BasicProps = {
  fill?: keyof typeof theme.colors;
  className?: string;
  [key: string]: any;
} & SizeProps & SpaceProps;

export type IconProps = {
  name?: IconsType;
  customName?: string;
} & BasicProps;

const composedHelpers = compose(size, space);

// A helper function to safely get the fill color from the theme
const getIconFill = (fill: keyof typeof theme.colors | undefined, theme: any) => {
  return fill ? theme.colors?.[fill] || 'currentColor' : 'currentColor';
};

const StyledSvg = styled.svg<IconProps>`
  display: inline-flex;
  flex-shrink: 0;
  fill: ${({ fill, theme }) => getIconFill(fill, theme)};
  ${composedHelpers};
`;

const IconImpl = ({ src = icons, name, customName, ...rest }: IconProps) => (
  <StyledSvg focusable="false" aria-hidden="true" role="presentation" {...rest}>
    <use xlinkHref={`${src}#${customName || name}`} />
  </StyledSvg>
);

// Set default props for the Icon component
IconImpl.defaultProps = {
  flexShrink: 0,
  fill: 'currentColor',
  size: 40,
};

// Memoize the IconImpl to avoid unnecessary re-renders
export const Icon = memo(IconImpl);
export type { IconsType };
