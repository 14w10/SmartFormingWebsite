import styled from 'astroturf/react';

export const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg'; color?: 'white' | 'blue' }>`
  &.size {
    &-sm {
      &,
      &:after {
        border-radius: 50%;
        width: 20px;
        height: 20px;
      }
    }
    &-md {
      &,
      &:after {
        border-radius: 50%;
        width: 32px;
        height: 32px;
      }
    }
    &-lg {
      &,
      &:after {
        border-radius: 50%;
        width: 48px;
        height: 48px;
      }
    }
  }

  &.color {
    &-white {
      border-top: 2px solid rgba(255, 255, 255, 0.2);
      border-right: 2px solid rgba(255, 255, 255, 0.2);
      border-bottom: 2px solid #fff;
      border-left: 2px solid #fff;
    }
    &-blue {
      border-top: 2px solid rgba(255, 255, 255, 0.2);
      border-right: 2px solid rgba(255, 255, 255, 0.2);
      border-bottom: 2px solid #4781e8;
      border-left: 2px solid #4781e8;
    }
  }

  & {
    position: relative;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: spinner 1.1s infinite linear;
    animation: spinner 1.1s infinite linear;
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

Spinner.defaultProps = { size: 'sm', color: 'blue' };
