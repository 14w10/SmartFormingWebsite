import { FC } from 'react';

import { Typography } from '@smar/ui';

import st from './styles.module.scss';

type KeywordsType = {
  data: string[];
};

export const Keywords: FC<KeywordsType> = ({ data }) => {
  return (
    <>
      {data.map((item, i) => (
        <Typography key={i} className={st.keyword} variant="text110" color="primaryBlue910">
          {item}
        </Typography>
      ))}
    </>
  );
};
