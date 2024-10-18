import { forwardRef, HTMLAttributes } from 'react';
import styled from 'astroturf/react';

type InputProps = {
  text?: string;
} & Record<string, any> &
  HTMLAttributes<HTMLInputElement>;

const Label = styled.label`
  input {
    display: none;
  }

  div {
    width: 16px;
    height: 16px;
    display: inline-flex;
    flex-shrink: 0;
    border: 2px solid;
    border-radius: 6px;
    border-color: hsla(219, 16%, 83%, 1);
  }

  input:checked + div {
    @apply bg-primaryBlue900 border-primaryBlue900;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4 4L3 3C2.44771 2.44771 1.55228 2.44772 1 3C0.447715 3.55228 0.447715 4.44772 1 5L2.58579 6.58579C3.36684 7.36684 4.63316 7.36684 5.41421 6.58579L9 3C9.55228 2.44772 9.55229 1.55228 9 1C8.44771 0.447715 7.55228 0.447715 7 1L4 4Z' fill='white'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: center;
  }

  input:indeterminate + div {
    @apply bg-primaryBlue900 border-primaryBlue900;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='3' viewBox='0 0 10 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5C10 2.32843 9.32843 3 8.5 3H1.5C0.671573 3 0 2.32843 0 1.5Z' fill='white'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const CheckboxField = forwardRef(({ text, ...props }: InputProps, ref) => {
  return (
    <Label className="flex items-center">
      <input type="checkbox" ref={ref as any} {...props} />
      <div />
      {text && <span className="v-h150 ml-12px text-secondaryDarkBlue900">{text}</span>}
    </Label>
  );
});
