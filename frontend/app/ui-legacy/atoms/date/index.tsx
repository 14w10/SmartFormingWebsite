import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    top: '16px',
    right: '16px',
  },
}));

interface IDate {
  date: string;
}

export const Date = ({ date }: IDate) => {
  const classes = useStyles();

  return (
    <Typography className={classes.root} variant="body2" display="inline" component="span">
      {date}
    </Typography>
  );
};
