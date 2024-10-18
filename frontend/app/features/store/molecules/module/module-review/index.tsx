import { FC } from 'react';

import { Card, Icon, Typography } from '@smar/ui';

import { ReviewType } from '../../../organisms/modules-review-list';

import st from './styles.module.scss';

type ModuleReviewType = {
  review: ReviewType;
};

const Rating = ({ rating }: { rating: number }) => {
  let ratingArr = [...Array(5).keys()];

  // TODO: Fix up rating stars
  let isHalf = false;
  ratingArr = ratingArr.map((_, i) => {
    if (Math.trunc(rating) > i) {
      return 1;
    } else if (!isHalf && rating % 1 >= 0.5) {
      isHalf = true;
      return 0.5;
    } else {
      return 0;
    }
  });

  return (
    <>
      {ratingArr.map((item, i) => (
        <Icon
          key={i}
          name={item === 1 ? 'star-solid' : item === 0.5 ? 'star-half' : 'star-border'}
          size={24}
          iconFill="auxiliaryYellow900"
          mr="4px"
        />
      ))}
    </>
  );
};

export const ModuleReview: FC<ModuleReviewType> = ({ review }) => {
  return (
    <Card className={st.root} variant="sm">
      <div className={st.header}>
        <Typography as="h3" variant="h150" color="secondaryDarkBlue910">
          {review.title}
        </Typography>
        <div className={st.reviewDateWrapper}>
          <Typography variant="text130" color="secondaryDarkBlue921">
            {review.date}
          </Typography>
          <Icon name="more" size={24} iconFill="secondaryDarkBlue920" ml={2} />
        </div>
      </div>
      <div className={st.ratingReviewerWrapper}>
        <Rating rating={review.rating} />
        <Typography as="span" variant="text130" color="secondaryDarkBlue920" ml={1}>
          {review.position} - {review.location}, {review.name}
        </Typography>
      </div>
      <Typography variant="p130" color="darkBlue910">
        {review.reviewText}
      </Typography>
    </Card>
  );
};
