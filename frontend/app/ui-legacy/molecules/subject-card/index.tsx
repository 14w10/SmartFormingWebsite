import { Box, Chip, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { formatDate } from 'libs/format-date';

import { ColorIcon } from 'ui-legacy/atoms/color-icon';

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
}));

export const SubjectCard = ({
  name,
  createdAt, 
  color
}: ISubjectCard) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Box display="flex" alignItems="center" p={2}>
        {color && <ColorIcon color={color} />}
        <Box className={classes.textWrapper}>
          {createdAt && (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" className={`${classes.date} ${classes.text}`}>
                {formatDate(createdAt)}
              </Typography>
            </Box>
          )}
          <Typography variant="body1" className={`${classes.title} ${classes.text}`}>
            {name}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
