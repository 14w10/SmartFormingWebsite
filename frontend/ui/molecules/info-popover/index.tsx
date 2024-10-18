import { FC, ReactNode } from 'react';
import styled from 'astroturf/react';

import { Icon } from '../../atoms';

const InfoWrapper = styled.div`
  @apply relative flex items-center;

  div {
    display: none;
  }

  svg:hover ~ div {
    display: block;
  }
`;

export const InfoPopover: FC<{children: ReactNode}> = ({ children }) => {
  return (
    <InfoWrapper className="text-secondaryDarkBlue910 ml-1">
      <Icon name="24px-info" size={24} />
      <div
        className="bg-secondaryDarkBlue910 absolute z-10 left-4 p-1 rounded-lg"
        style={{ width: 300 }}
      >
        <p className="v-p130 text-white">{children}</p>
      </div>
    </InfoWrapper>
  );
};
