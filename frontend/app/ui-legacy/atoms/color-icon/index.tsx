import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Brightness1 } from '@material-ui/icons/';

const useStyles = makeStyles(() => ({
  iconWrapper: {
    marginRight: 16,
    border: '1px solid',
    borderRadius: '50%',
    opacity: 0.3,
  },
}));

interface IColor {
  color: string;
}

export const ColorIcon = ({ color }: IColor) => {
  const classes = useStyles();

  return (
    <Box
      className={classes.iconWrapper}
      p={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Brightness1 style={{ color }}/>
    </Box>
  );
};
