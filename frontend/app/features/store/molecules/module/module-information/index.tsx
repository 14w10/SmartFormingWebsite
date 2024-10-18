import { FC } from 'react';

import { Card, Icon, Typography } from '@smar/ui';

import st from './styles.module.scss';

type ModuleInformationProps = {
  className?: string;
  computationModule: Module;
};

export const ModuleInformation: FC<ModuleInformationProps> = ({ className, computationModule }) => {
  return (
    <div className={className}>
      <div>
        <Typography as="h2" variant="text110" mb={1} color="secondaryDarkBlue900">
          Information
        </Typography>
        <div className={st.infoWrapper}>
          <Card className={st.info} variant="sm">
            <div className={st.infoInnerWrapper}>
              <div className={st.imgWrapper}>
                <img
                  className="w-full h-full object-cover"
                  src={computationModule?.cover?.croppedUrl || '/default-module.png'}
                  alt=""
                />
              </div>
              <div className={st.infoText}>
                <Typography variant="h170" color="secondaryDarkBlue900">
                  {computationModule?.title}
                </Typography>
                <Typography variant="p130" color="secondaryDarkBlue900">
                  <Typography as="span" variant="p130" color="secondaryDarkBlue920">
                    by
                  </Typography>{' '}
                  {`${computationModule?.author.firstName} ${computationModule?.author.lastName}`}
                </Typography>
              </div>
            </div>
          </Card>
          <Card className={st.stats} variant="sm">
            <div className={st.statsWrapper}>
              <div className={st.statsItem}>
                <Typography
                  className={st.statsIconText}
                  variant="h160"
                  color="secondaryDarkBlue920"
                  mb={1}
                >
                  <Icon name="eye" size={24} iconFill="secondaryDarkBlue920" mr={1} />
                  Views
                </Typography>
                <Typography variant="h200" color="secondaryDarkBlue900">
                  2,164
                </Typography>
              </div>
              <div className={st.statsItem}>
                <Typography
                  className={st.statsIconText}
                  variant="h160"
                  color="secondaryDarkBlue920"
                  mb={1}
                >
                  <Icon name="rate-review" size={24} iconFill="secondaryDarkBlue920" mr={1} />
                  Reviews
                </Typography>
                <Typography variant="h200" color="secondaryDarkBlue900">
                  144
                </Typography>
              </div>
              <div className={st.statsItem}>
                <Typography
                  className={st.statsIconText}
                  variant="h160"
                  color="secondaryDarkBlue920"
                  mb={1}
                >
                  <Icon name="star-border" size={24} iconFill="secondaryDarkBlue920" mr={1} />
                  Rating
                </Typography>
                <Typography variant="h200" color="secondaryDarkBlue900">
                  4.8
                </Typography>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
