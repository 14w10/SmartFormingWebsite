import { FC } from 'react';
import Link from 'next/link';

import { Card, Icon, Typography } from '@smar/ui';

import st from './styles.module.scss';

type ModuleCardProps = {
  item: Module;
};

export const ModuleCard: FC<ModuleCardProps> = ({ item }) => {
  return (
    <Link href="/store/modules/[moduleId]" as={`/store/modules/${item.id}`} passHref>
      <Card as="a" className={st.root} boxshadow="shadow1">
        <div className={st.wrapper}>
          <div className={st.imgWrapper}>
            <img
              className={st.img}
              src={item?.cover?.croppedUrl || '/default-module.png'}
              alt=""
              loading="lazy"
            />
          </div>
          <div className={st.contentWrapper}>
            <div className={st.textWrapper}>
              <Typography as="h3" variant="h170">
                {item.title}
              </Typography>
              <Typography variant="p130" color="secondaryDarkBlue900" mb={1}>
                <Typography as="span" variant="p130" color="secondaryDarkBlue920">
                  by
                </Typography>{' '}
                {item.author.firstName} {item.author.lastName}
              </Typography>
              {item.uid && (
                <Typography variant="p130" color="secondaryDarkBlue900" mb={1}>
                  <Typography as="span" variant="p130" color="secondaryDarkBlue920">
                    Id
                  </Typography>{' '}
                  {item.uid}
                </Typography>
              )}
              <Typography variant="p130">{item.shortDescription}</Typography>
            </div>
            <Typography
              as="div"
              className={st.counters}
              variant="p130"
              color="secondaryDarkBlue900"
            >
              <div className={st.counter}>
                <Icon
                  className={st.counterIcon}
                  name="eye"
                  size={24}
                  iconFill="secondaryDarkBlue921"
                />
                2.2K
              </div>
              <div className={st.counter}>
                <Icon
                  className={st.counterIcon}
                  name="star-border"
                  size={24}
                  iconFill="secondaryDarkBlue921"
                />
                4.8
              </div>
            </Typography>
          </div>
        </div>
      </Card>
    </Link>
  );
};
