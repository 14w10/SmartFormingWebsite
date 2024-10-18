import { Box, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  reason: {
    background: '#7B859F',
  },
  title: {
    fontWeight: 700,
  },
  text: {
    color: '#fff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export const ReasonCard = ({ rejectReason }: { rejectReason: string }) => {
  const classes = useStyles();

  return (
    <Box mb={2}>
      <Paper className={classes.reason} elevation={0}>
        <Box p={2}>
          <Typography className={`${classes.text} ${classes.title}`}>Reason:</Typography>
          <Typography className={classes.text}>{rejectReason}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
