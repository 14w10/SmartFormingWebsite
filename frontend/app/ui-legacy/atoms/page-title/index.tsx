import { FC, ReactNode } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    margin: '24px 0',
    fontWeight: 800,
    color: '#323F5A',
    fontFamily: 'TT Norms Pro',
  },
}));

interface IPageTitle {
  children?: ReactNode;
  title: string;
}

export const PageTitle: FC<IPageTitle> = ({ children, title }) => {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h3" component="h1" className={classes.root}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};
