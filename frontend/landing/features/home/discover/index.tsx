/* eslint-disable @typescript-eslint/no-var-requires */

import { useCallback } from 'react';
import { useWindowScroll } from 'react-use';
import clsx from 'clsx';

import { Icon, ParallaxItem, Typography } from '@smar/ui';

import { scrollToScreen } from '../util';

import styles from '../styles.module.scss';
import st from './styles.module.scss';

const clouds1 = require('../assets/clouds-1.jpg?min=768&max=2200&steps=7');
const clouds2 = require('../assets/clouds-2.png?min=768&max=2644&steps=7');
const clouds3 = require('../assets/clouds-3.png?min=768&max=1920&steps=7');

const ScrollToExplore = () => {
  const scrollNext = useCallback(() => {
    scrollToScreen(2);
  }, []);
  const { y } = useWindowScroll();

  return (
    <div className={clsx('container', st.scroll)}>
      <button className={styles.btn} onClick={scrollNext} disabled={y > 100}>
        Scroll to explore <Icon name="long-arrow" ml={2} />
      </button>
    </div>
  );
};

export const Discover = () => {
  return (
    <>
      <img
        alt=""
        className={st.clouds1}
        loading="lazy"
        role="presentation"
        src={clouds1.src}
        srcSet={clouds1.srcSet}
        width="2200"
      />
      <ParallaxItem
        alt=""
        as="img"
        className={st.clouds2}
        loading="lazy"
        role="presentation"
        speedBoost={1.2}
        src={clouds2.src}
        srcSet={clouds2.srcSet}
        width="2644"
        yOffsetTo={-600}
      />
      <ParallaxItem
        alt=""
        as="img"
        className={st.clouds3}
        loading="lazy"
        role="presentation"
        speedBoost={1}
        src={clouds3.src}
        srcSet={clouds3.srcSet}
        width="1920"
        yOffsetTo={-300}
      />

      <div className={styles.screen}>
        <ParallaxItem yOffsetTo={-120} speedBoost={1}>
          <Typography as="h1" variant="h800" className={st.title}>
            Smart Forming Commerce
          </Typography>
        </ParallaxItem>
        <Typography as="h3" variant="sub300" className={st.text}>
          Knowledge marketplace for manufacturing community
        </Typography>
        <a href={`${process.env.NEXT_PUBLIC_APP_URL}/store/modules`} className={styles.btn}>
          <Icon name="small-arrow" mr={2} size={32} />
          Discover
        </a>
        <ScrollToExplore />
      </div>
    </>
  );
};
