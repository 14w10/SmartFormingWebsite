import { Box, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { formatDate } from 'libs/format-date';

import { StatusIcon } from '../../atoms';

const useStyles = makeStyles(() => ({
  paper: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: 8,
    '&:hover': {
      '& $title': {
        textDecoration: 'underline',
      },
    },
  },
  textWrapper: {
    overflow: 'hidden',
  },
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  title: {
    fontWeight: 600,
  },
  date: {
    opacity: 0.7,
  },
  description: {
    whiteSpace: 'nowrap',
  },
}));

export const CardWithIcon = ({
  status,
  createdAt,
  computationModuleTitle,
  title,
}: IComputationRequestCard) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={0}>
      <Box display="flex" alignItems="center" p={2}>
        {status && <StatusIcon status={status} />}
        <Box className={classes.textWrapper}>
          {createdAt && (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" className={`${classes.date} ${classes.text}`}>
                {formatDate(createdAt)}
              </Typography>
            </Box>
          )}
          <Typography variant="body1" className={`${classes.title} ${classes.text}`}>
            {computationModuleTitle || title}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
