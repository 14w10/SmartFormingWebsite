import { FC, ReactNode } from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette, spacing }) => ({
  status: {
    marginRight: spacing(2),
    textTransform: 'capitalize',
  },
  boxHead: {
    borderBottom: `2px solid ${palette.grey[100]}`,
  },
  textHelp: {
    fontWeight: 700,
  },
  title: {
    '&::first-letter': {
      textTransform: 'uppercase',
    },
  },
  description: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: 800,
  },
}));

export const DetailsCard: FC<{ title: string; className?: string; customTitleStyle?: string; children: ReactNode }> = ({
  children,
  title,
  className,
  customTitleStyle,
}) => {
  const classes = useStyles();

  return (
    <Box mb={2}>
      <Paper elevation={0}>
        <Box p={2} className={className ? className : ''}>
          <Typography
            className={`${classes.textHelp} ${className} ${classes.title} ${customTitleStyle}`}
          >
            {title}:
          </Typography>
          {children}
        </Box>
      </Paper>
    </Box>
  );
};
