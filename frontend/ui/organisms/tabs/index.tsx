import { HTMLAttributes } from 'react';
import styled from 'astroturf/react';
import cn from 'clsx';

export const TabsWrapper = styled.div`
  @apply bg-secondaryDarkBlue930 inline-flex mb-4 rounded-full;
`;

export const TabItem = ({
  title,
  description,
  active,
  ...rest
}: {
  active: boolean;
  title: string;
  description?: string;
} & HTMLAttributes<HTMLInputElement>) => {
  return (
    <div
      className={cn(
        'flex relative flex-col px-5 text-center text-secondaryDarkBlue900  py-1 cursor-pointer rounded-full',
        active ? 'bg-white shadow-shadow4' : '',
      )}
      {...rest}
    >
      <p className="v-label141">{title}</p>
      {description && <p className="v-text110 text-secondaryDarkBlue920">{description}</p>}
    </div>
  );
};
