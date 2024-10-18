import { FC, ReactNode } from 'react';
import { Box, ListItem as MUIListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '100%',
  },
  wrapper: {
    maxWidth: '100%',
  },
  label: {
    textTransform: 'uppercase',
    fontWeight: 600,
    opacity: 0.5,
  },
}));

interface IListItemProps {
  label: string;
  body?: string | number;
  className?: string;
  children?: ReactNode;
}

export const ListItem: FC<IListItemProps> = ({ label, body, className, children }) => {
  const classes = useStyles();

  return (
    <MUIListItem className={classes.root}>
      <Box display="flex" flexDirection="column" className={classes.wrapper}>
        <Box>
          <Typography variant="caption" component="span" className={classes.label}>
            {label}:
          </Typography>
        </Box>
        {body ? (
          <Box>
            <Typography variant="body1" component="p" className={className}>
              {body}
            </Typography>
          </Box>
        ) : null}

        {children}
      </Box>
    </MUIListItem>
  );
};
