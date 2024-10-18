import styled from 'astroturf/react';

export const ScrollWrapper = styled.div`
  @apply overflow-auto;

  &::-webkit-scrollbar {
    @apply bg-secondaryDarkBlue930 border;
    width: 7px;
    border-radius: 21px;
  }
  &::-webkit-scrollbar-track {
    @apply bg-secondaryDarkBlue930;
    border-radius: 21px;
  }
  &::-webkit-scrollbar-thumb {
    @apply bg-white border-secondaryDarkBlue930 border-solid border;
    border-radius: 21px;
  }
`;
