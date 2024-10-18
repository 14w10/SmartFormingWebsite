import { Box, Chip, Paper, Typography } from '@material-ui/core';
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
    fontWeight: 800,
    fontSize: '16px',
  },
  date: {
    opacity: 0.7,
  },
  description: {
    fontSize: '14px',
    whiteSpace: 'nowrap',
    fontFamily: 'Encode Sans',
    fontWeight: 400,
  },
}));

export const ModuleCard = ({
  title,
  status,
  description,
  createdAt,
  computationFormId,
  storeCard,
  isUser,
}: IModuleCard) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Box display="flex" alignItems="center" p={2}>
        {!storeCard && status && <StatusIcon status={status} />}
        <Box className={classes.textWrapper}>
          {!storeCard && createdAt && (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" className={`${classes.date} ${classes.text}`}>
                {formatDate(createdAt)}
              </Typography>
              {!isUser &&
                (status === 'approved' || status === 'under_review') &&
                computationFormId && (
                  <Chip size="small" label="With Computation Form" style={{ marginLeft: 8 }} />
                )}
              {!isUser && status === 'under_review' && (
                <Chip size="small" label="Incomplete submission" style={{ marginLeft: 8 }} />
              )}
            </Box>
          )}
          <Typography variant="body1" className={`${classes.title} ${classes.text}`}>
            {title}
          </Typography>
          {storeCard && description && (
            <Typography
              component="p"
              variant="caption"
              color="secondary"
              className={`${classes.text} ${classes.description}`}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
