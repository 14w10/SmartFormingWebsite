import { Typography } from '@material-ui/core';

interface ITag {
  text: string;
  className?: string | undefined;
}

export const Tag = ({ text, className }: ITag) => {
  return (
    <Typography variant="subtitle2" display="inline" component="span" className={className}>
      {text}
    </Typography>
  );
};
