import { useCallback } from 'react';
import clsx from 'clsx';

import { Button, Card, Icon, ParallaxItem, Typography } from '@smar/ui';

import { scrollToScreen } from '../util';

import styles from '../styles.module.scss';
import st from './styles.module.scss';

export const HowItWorks = () => {
  const scrollNext = useCallback(() => {
    scrollToScreen(3);
  }, []);

  return (
    <>
      <ParallaxItem
        yOffsetTo={-500}
        yOffsetFrom={200}
        speedBoost={1.2}
        as="img"
        alt=""
        className={st.platform}
        loading="lazy"
        role="presentation"
        src={require('../assets/platform.svg')}
        x
      />
      <img alt="" className={styles.dots} role="presentation" src={require('../assets/dots.svg')} />

      <div className={clsx(styles.screen, st.wrapper)}>
        <div className={clsx(st.content, 'container')}>
          <div>
            <Typography as="h2" variant="h600" className={st.title}>
              Unlock your potential
            </Typography>
            <Typography as="h3" variant="sub200">
              Choose and combine products with specialised advance functions to maximise the
              potential of your technology
            </Typography>
          </div>

          <Card className={st.card}>
            <div>
              <Typography variant="h170">The journey starts here</Typography>
              <Typography variant="p130">
                Take a quick tour across the SF knowledge platform.
              </Typography>
            </div>
            <Button className={st.btn} onClick={scrollNext}>
              <Icon name="chevron-right" size={24} />
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};
