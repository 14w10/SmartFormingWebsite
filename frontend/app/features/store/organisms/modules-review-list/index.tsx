import { FC } from 'react';

import { Pagination, Typography } from '@smar/ui';

import { ModuleReview } from '../../molecules/module/module-review';

export type ReviewType = {
  title: string;
  date: string;
  rating: number;
  position: string;
  location: string;
  name: string;
  reviewText: string;
};

type ModulesReviewListType = {
  reviews: ReviewType[];
  className?: string;
};

export const ModulesReviewList: FC<ModulesReviewListType> = ({ reviews, className }) => {
  return (
    <div className={className}>
      <Typography as="h2" variant="text110" color="secondaryDarkBlue900" mb={1}>
        Reviews
      </Typography>
      <div>
        {reviews.map((review, i) => (
          <ModuleReview key={i} review={review} />
        ))}
      </div>
      {/* <Pagination currentPage={1} totalPages={100} /> */}
    </div>
  );
};
