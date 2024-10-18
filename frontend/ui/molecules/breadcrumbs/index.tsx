import Link from 'next/link';

import { Icon } from '../../atoms/icon';
import { Typography } from '../../atoms/typography';

const Breadcrumb = ({ isLast, label, href = '' }: BreadcrumbProps & { isLast: boolean }) => {
  const componentName = isLast || !href ? 'span' : 'a';
  const color = isLast ? 'primaryBlue900' : href ? 'secondaryDarkBlue920' : 'secondaryDarkBlue921';

  return (
    <>
      {isLast ? (
        <Typography
          as={componentName}
          color={color}
          variant="text110"
          className="inline-flex items-center uppercase"
        >
          {label}
          {!isLast && <Icon name="chevron-right" size={24} mx="4px" />}
        </Typography>
      ) : (
        <>
          {!href ? (
            <Typography
              as={componentName}
              color={color}
              variant="text110"
              className="inline-flex items-center uppercase"
            >
              {label}
              {!isLast && <Icon name="chevron-right" size={24} mx="4px" />}
            </Typography>
          ) : (
            <Link href={href} passHref={componentName === 'a'}>
              <Typography
                as={componentName}
                color={color}
                variant="text110"
                className="inline-flex items-center uppercase"
              >
                {label}
                {!isLast && <Icon name="chevron-right" size={24} mx="4px" />}
              </Typography>
            </Link>
          )}
        </>
      )}
    </>
  );
};

export type BreadcrumbProps = {
  label: string;
  href?: string;
};

export const Breadcrumbs = ({ items }: { items: BreadcrumbProps[] }) => {
  return (
    <div className="flex">
      {items.map((item, i) => (
        <Breadcrumb key={i} label={item.label} href={item.href} isLast={i === items.length - 1} />
      ))}
    </div>
  );
};
