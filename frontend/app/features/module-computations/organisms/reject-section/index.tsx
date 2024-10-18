import { FC } from 'react';

import { Card, Typography } from '@smar/ui';

type ComputationsInformationProps = {
  declineReason: Computation['declineReason'];
};

export const RejectSection: FC<ComputationsInformationProps> = ({ declineReason }) => {
  return (
    <div className="className">
      <Typography as="h2" variant="text110" mb={1} color="secondaryDarkBlue900">
        REASON
      </Typography>
      <Card variant="sm" className="bg-secondaryDarkBlue910">
        <Typography color="white" variant="p130">
          {declineReason}
        </Typography>
      </Card>
    </div>
  );
};
