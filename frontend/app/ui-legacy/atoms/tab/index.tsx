import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Link as MuiLink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  link: {
    padding: '4px 8px',
    margin: '8px 0 8px 8px',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '1.25',
    color: '#272727',
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: '#e6eaee',
    },
  },
  linkActive: {
    backgroundColor: '#e6eaee',
  },
}));

interface ITabLink {
  active?: boolean;
  href: string;
  className?: string | null;
  children?: ReactNode;
}

export const TabLink: FC<ITabLink> = ({ href, className, active, children }) => {
  const classes = useStyles();

  return (
    <Link href={href} shallow>
      <MuiLink
        href={href}
        className={className || `${classes.link} ${active ? classes.linkActive : ''}`}
      >
        {children}
      </MuiLink>
    </Link>
  );
};
