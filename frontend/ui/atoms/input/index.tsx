import { FC, forwardRef, HTMLAttributes } from 'react';
import styled from 'astroturf/react';

// TODO: finish off component and it's styles
export type InputProps = {
  variant?: 'default' | 'secondary';
  error?: boolean;
} & Record<string, any> &
  HTMLAttributes<HTMLInputElement>;

const InputComp = styled.input<{ variant?: InputProps['variant']; error?: boolean }>`
  @apply font-secondary;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.6;
  letter-spacing: 0.05em;
  min-height: 48px;
  align-items: center;
  appearance: none;
  background: transparent;
  border-radius: 24px;
  border: none;
  display: inline-flex;
  justify-content: center;
  padding: 12px 16px;
  transition: 0.2s ease-in;
  border: 1px solid transparent;
  resize: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
  &.variant {
    &-default {
      color: var(--secondaryDarkBlue920);
      background: var(--secondaryDarkBlue940);

      &:hover {
        background: var(--primaryBlue930);
      }

      &:focus {
        color: var(--secondaryDarkBlue900);
        border: 1px solid var(--primaryBlue910);
      }

      &:disabled {
        color: rgba(155, 169, 183, 0.5);
      }
    }
    &-secondary {
      @apply text-secondaryDarkBlue900 bg-white shadow-shadow4;

      &:hover {
        border: 1px solid var(--secondaryDarkBlue930);
      }

      &:focus {
        color: var(--secondaryDarkBlue900);
        border: 1px solid var(--secondaryDarkBlue920);
      }

      &:disabled {
        color: rgba(155, 169, 183, 0.5);
      }
    }
  }
  &.error {
    @apply border-auxiliaryRed900 bg-auxiliaryRed940;
  }
`;

export const Input: FC<InputProps> = forwardRef(
  ({ variant = 'default', type = 'text', className, error, ...props }, ref) => {
    return (
      <InputComp
        variant={variant}
        error={error}
        className={className}
        type={type}
        ref={ref as any}
        {...props}
      />
    );
  },
);
