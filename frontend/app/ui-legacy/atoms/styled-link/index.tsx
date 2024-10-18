import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Link as MuiLink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  link: {
    display: 'inline-block',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

interface ILink {
  href: string;
  text?: string;
  as?: string;
  prefetch?: boolean;
  className?: string | null;
  children?: ReactNode;
}

export const StyledLink: FC<ILink> = ({ href, text, as, className, prefetch, children }) => {
  const classes = useStyles();

  return (
    <Link href={href} as={as} passHref prefetch={prefetch}>
      <MuiLink href={href} className={`${className} ${classes.link}`}>
        {text}
        {children}
      </MuiLink>
    </Link>
  );
};
