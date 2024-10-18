import clsx from 'clsx';

import { Icon, ParallaxItemFadeIn, Typography } from '@smar/ui';

import { MainLine } from './main-line';

import styles from '../styles.module.scss';
import st from './styles.module.scss';

export const WorkflowScreen1 = () => {
  return (
    <>
      <img
        alt=""
        className={styles.dots}
        loading="lazy"
        role="presentation"
        src={require('../assets/dots.svg')}
      />

      <MainLine />

      <div className={styles.screen}>
        <ParallaxItemFadeIn
          withScale={false}
          startOffset={0.8}
          endOffset={-0.88}
          className={st.point}
          style={{
            height: 'calc(14.8148vh + 104px)',
            left: 'calc(11vw - 13px)',
            top: 'calc(50% - 13px + 2.2vw)',
          }}
        >
          <div className={st.pointDot} />
          <ParallaxItemFadeIn startOffset={0.76} className={st.scaleWrapper}>
            <div className={st.pointLine} />
            <Typography className={st.pointContent} variant="label140">
              Manufacturing <br /> Professional
            </Typography>
          </ParallaxItemFadeIn>
        </ParallaxItemFadeIn>

        <ParallaxItemFadeIn
          className={st.point}
          endOffset={-0.741}
          startOffset={0.747}
          withScale={false}
          style={{
            bottom: 'calc(50% - 13px + 0.7vw)',
            height: 'calc(20vh + 56px)',
            left: 'calc(23vw - 13px)',
          }}
        >
          <ParallaxItemFadeIn
            className={st.pointExtraContent}
            startOffset={0.77}
            endOffset={-0.84}
            withScale={false}
          >
            <Typography as="h2" variant="h400">
              Knowledge marketplace
            </Typography>
            <Typography as="h3" variant="sub200" style={{ maxWidth: 320 }}>
              low-cost and efficient, uptake of frontier knowledge
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
          endOffset={-0.7737}
          startOffset={0.699}
          withScale={false}
          style={{
            height: 'calc(15.1852vh + 104px)',
            left: 'calc(39vw - 13px)',
            top: 'calc(50% - 13px + 5.2vw)',
          }}
        >
          <div className={st.pointDot} />
          <ParallaxItemFadeIn className={st.scaleWrapper}>
            <div className={st.pointLine} />
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`}
              className={clsx(styles.btn, st.pointContent)}
            >
              View sample <br /> SFeatures <Icon name="small-arrow" ml="10px" />
            </a>
          </ParallaxItemFadeIn>
        </ParallaxItemFadeIn>

        <ParallaxItemFadeIn
          className={st.point}
          startOffset={0.53}
          endOffset={-0.5}
          withScale={false}
          style={{
            height: 'calc(18vh + 56px)',
            left: 'calc(58vw - 13px)',
            bottom: 'calc(50% - 13px + 0.46vw)',
          }}
        >
          <ParallaxItemFadeIn
            className={st.pointExtraContent}
            startOffset={0.68}
            endOffset={-0.65}
            withScale={false}
          >
            <Typography as="h2" variant="h400">
              Order placement
            </Typography>
            <Typography as="h3" variant="sub200">
              the functional modules portfolios
            </Typography>
          </ParallaxItemFadeIn>

          <ParallaxItemFadeIn
            startOffset={0.6}
            endOffset={-0.35}
            className={st.scaleWrapper}
            style={{ transformOrigin: 'bottom left' }}
          >
            <div className={st.pointDotEnd} />
            <div className={st.pointLine} />
          </ParallaxItemFadeIn>

          <div className={st.pointDot} />
          <ParallaxItemFadeIn
            className={st.badge}
            withScale={false}
            speedBoost={1.1}
            startOffset={0.628}
            endOffset={-0.65}
          >
            Modules &amp; portfolios
          </ParallaxItemFadeIn>
        </ParallaxItemFadeIn>

        <ParallaxItemFadeIn
          className={st.point}
          startOffset={0.6}
          endOffset={-0.67}
          withScale={false}
          style={{
            height: 'calc(9.3519vh + 104px)',
            left: 'calc(82.0313vw - 13px)',
            top: 'calc(50% - 13px + 5.5vw)',
          }}
        >
          <ParallaxItemFadeIn
            className={st.badge}
            style={{ top: 'auto', bottom: 'calc(100% + 16px)' }}
            withScale={false}
            speedBoost={1.15}
            startOffset={0.3}
            endOffset={-0.1}
          >
            Result
            <div className={st.resultItem}>
              <img src={require('../assets/order-line-1.svg')} alt="" role="presentation" />
              <div className={st.icon}>
                <Icon name="bar" size={32} />
              </div>
            </div>
            <div className={st.resultItem}>
              <img src={require('../assets/order-line-2.svg')} alt="" role="presentation" />
              <div className={st.icon}>
                <Icon name="pie" size={32} />
              </div>
            </div>
            <div className={st.resultItem}>
              <img src={require('../assets/order-line-3.svg')} alt="" role="presentation" />
              <div className={st.icon}>
                <Icon name="scatter" size={32} />
              </div>
            </div>
          </ParallaxItemFadeIn>

          <div className={st.pointDot} />

          <ParallaxItemFadeIn
            className={st.scaleWrapper}
            speedBoost={1.18}
            startOffset={0.3}
            endOffset={-0.1}
          >
            <div className={st.pointLine} />
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/store/modules`}
              className={clsx(styles.btn, st.pointContent)}
              style={{ whiteSpace: 'nowrap' }}
            >
              Discover free modules <br /> and portfolios <Icon name="small-arrow" ml="10px" />
            </a>
          </ParallaxItemFadeIn>
        </ParallaxItemFadeIn>
      </div>
    </>
  );
};
