import { HTMLAttributes, memo } from 'react';
import styled from 'astroturf/react';

type InputProps = {
  text: string;
} & Record<string, any> &
  HTMLAttributes<HTMLInputElement>;

const Label = styled.label`
  input {
    display: none;
  }

  div {
    @apply border border-secondaryDarkBlue921;
    width: 16px;
    height: 16px;
    display: inline-flex;
    flex-shrink: 0;
    border-radius: 6px;
  }

  input:checked + div {
    @apply bg-primaryBlue900;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4 4L3 3C2.44771 2.44771 1.55228 2.44772 1 3C0.447715 3.55228 0.447715 4.44772 1 5L2.58579 6.58579C3.36684 7.36684 4.63316 7.36684 5.41421 6.58579L9 3C9.55228 2.44772 9.55229 1.55228 9 1C8.44771 0.447715 7.55228 0.447715 7 1L4 4Z' fill='white'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const CheckboxField = memo(({ text, ...props }: InputProps) => {
  return (
    <Label className="flex items-center justify-between">
      <span className="v-p130 mr-12px text-primaryBlue900">{text}</span>
      <input type="checkbox" {...props} />
      <div />
    </Label>
  );
});
