import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';

import { ParallaxItemFadeIn, Typography, useParallax } from '@smar/ui';

import styles from '../styles.module.scss';
import st from './styles.module.scss';

export const WorkflowScreen2 = () => {
  const formingRef = useRef(null);
  const { range, boostedY } = useParallax(formingRef, 1, 0.9, -0.04);
  const y = useTransform(boostedY, range, ['-30%', '5%']);

  const opacityPara = useParallax(formingRef, 1, 0.9, -0.9);
  const opacity = useTransform(opacityPara.boostedY, opacityPara.range, [0.2, 1]);

  return (
    <>
      <motion.img
        alt=""
        className={st.forming}
        initial={{ y: '-30%', opacity: 0.2 }}
        loading="lazy"
        ref={formingRef}
        role="presentation"
        src={require('../assets/forming.svg')}
        style={{ y, opacity }}
        width="350"
      />

      <img
        alt=""
        className={st.dots}
        loading="lazy"
        role="presentation"
        src={require('../assets/dots.svg')}
      />

      <div className={styles.screen}>
        <ParallaxItemFadeIn
          className={st.point}
          startOffset={0.51}
          endOffset={-0.505}
          withScale={false}
          style={{
            bottom: 'calc(50% - 13px + 3.6vw)',
            height: 'calc(15vh + 56px)',
            left: 'calc(7.5vw - 13px)',
          }}
        >
          <ParallaxItemFadeIn
            className={st.pointExtraContent}
            startOffset={0.5}
            endOffset={-0.5}
            withScale={false}
          >
            <Typography as="h2" variant="h400">
              Meta data analytics
            </Typography>
            <Typography as="h3" variant="sub200">
              Digital characteristics of your technology
            </Typography>
          </ParallaxItemFadeIn>

          <ParallaxItemFadeIn
            startOffset={0.44}
            endOffset={-0.1}
            className={st.scaleWrapper}
            style={{ transformOrigin: 'bottom left' }}
          >
            <div className={st.pointDotEnd} />
            <div className={st.pointLine} />
          </ParallaxItemFadeIn>
          <div className={st.pointDot} />
        </ParallaxItemFadeIn>

        <ParallaxItemFadeIn
          className={st.point}
          startOffset={0.51}
          endOffset={-0.55}
          withScale={false}
          style={{
            height: 'calc(14.8148vh + 104px)',
            left: 'calc(26.8229vw - 13px)',
            top: 'calc(50% - 13px + 3.2vw)',
          }}
        >
          <ParallaxItemFadeIn
            startOffset={0.5}
            endOffset={-0.5}
            className={st.badge}
            style={{ top: 'auto', bottom: 'calc(100% + 16px)' }}
            withScale={false}
          >
            data-guided R&amp;D
          </ParallaxItemFadeIn>
          <div className={st.pointDot} />

          <ParallaxItemFadeIn className={st.scaleWrapper} startOffset={0.5} endOffset={-0.5}>
            <div className={st.pointLine} />
            <Typography className={st.pointContent} variant="h160" style={{ maxWidth: 270 }}>
              Free sample:{' '}
              <span style={{ color: 'var(--secondaryDarkBlue920)' }}>
                Explore the digital characteristics of a metal processing technology
              </span>
            </Typography>
          </ParallaxItemFadeIn>
        </ParallaxItemFadeIn>

        <ParallaxItemFadeIn
          className={st.point}
          startOffset={0.44}
          endOffset={-0.405}
          withScale={false}
          style={{
            bottom: 'calc(50% - 13px - 8.6vw)',
            height: 'calc(28.9815vh + 56px)',
            left: 'calc(42.8646vw - 13px)',
          }}
        >
          <ParallaxItemFadeIn
            className={st.pointExtraContent}
            startOffset={0.44}
            endOffset={-0.48}
            withScale={false}
          >
            <Typography as="h2" variant="h400">
              Giving Back
            </Typography>
            <Typography as="h3" variant="sub200">
              Knowledge sharing <br />
              is rewarding
            </Typography>
          </ParallaxItemFadeIn>
          <ParallaxItemFadeIn
            className={st.scaleWrapper}
            style={{ transformOrigin: 'bottom left' }}
          >
            <div className={st.pointDotEnd} />
            <div className={st.pointLine} />
          </ParallaxItemFadeIn>
          <div className={st.pointDot} />
        </ParallaxItemFadeIn>

        <ParallaxItemFadeIn
          className={st.point}
          startOffset={0.4}
          endOffset={-0.344}
          withScale={false}
          style={{
            left: 'calc(63vw - 13px)',
            top: 'calc((50% - 13px) + 3vw)',
          }}
        >
          <ParallaxItemFadeIn className={st.pointExtraContent} speedBoost={1.1} withScale={false}>
            <Typography as="h2" variant="h400">
              Smartforming store
            </Typography>
            <Typography as="h3" variant="sub200">
              Sign up to unlock the power of knowledge
            </Typography>
          </ParallaxItemFadeIn>
          <div className={st.pointDot} />
        </ParallaxItemFadeIn>
      </div>
    </>
  );
};
