import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PublicIcon from '@material-ui/icons/Public';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import TimelabseIcon from '@material-ui/icons/Timelapse';

const useStyles = makeStyles(() => ({
  iconWrapper: {
    marginRight: 16,
    border: '1px solid',
    borderRadius: '50%',
    opacity: 0.3,
  },
}));

interface IStatus {
  status: string;
}

interface IStatusIcons {
  [key: string]: JSX.Element;
}

const statusIcons: IStatusIcons = {
  new: <StarRoundedIcon />,
  // eslint-disable-next-line @typescript-eslint/camelcase
  under_review: <TimelabseIcon />,
  processing: <TimelabseIcon />,
  approved: <CheckCircleIcon />,
  finished: <CheckCircleIcon />,
  published: <PublicIcon />,
  rejected: <CancelIcon />,
  declined: <CancelIcon />,
};

export const StatusIcon = ({ status }: IStatus) => {
  const classes = useStyles();

  return (
    <Box
      className={classes.iconWrapper}
      p={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {statusIcons[status]}
    </Box>
  );
};
