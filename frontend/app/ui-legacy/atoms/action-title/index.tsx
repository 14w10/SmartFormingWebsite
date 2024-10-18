import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    marginRight: '8px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}));

interface IActionTitle {
  title: string;
}

export const ActionTitle = ({ title }: IActionTitle) => {
  const classes = useStyles();

  return (
    <Typography variant="subtitle2" component="span" className={classes.root}>
      {title}
    </Typography>
  );
};
