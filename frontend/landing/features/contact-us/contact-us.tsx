/* eslint-disable @typescript-eslint/no-var-requires */
import clsx from 'clsx';

import { ParallaxItem, Typography } from '@smar/ui';

import { Form } from './form';

import st from './styles.module.scss';

const clouds = require('./assets/clouds-2.png?min=768&max=1920&steps=7');

export const ContactUs = () => (
  <>
    <ParallaxItem
      alt=""
      as="img"
      className={st.clouds}
      role="presentation"
      speedBoost={1.1}
      src={clouds.src}
      srcSet={clouds.srcSet}
      width="1920"
      yOffsetFrom={150}
      yOffsetTo={0}
    />
    <div className={st.root} id="contact-us">
      <div className="container">
        <div className={st.flex}>
          <div className={clsx(st.flexItem, st.contentWrapper)}>
            <Typography as="h2" variant="h600">
              Contact us
            </Typography>
            <Typography variant="sub200" style={{ marginTop: '16px' }}>
              We take our commitment to our users seriously. If you need our help with your user
              account, have questions about how to use the platform or are experiencing technical
              difficulties, please don’t hesitate to contact us.
            </Typography>

            <ParallaxItem
              yOffsetFrom={50}
              yOffsetTo={0}
              speedBoost={1.2}
              style={{ marginTop: 'auto' }}
            >
              <Typography variant="sub200">Contact email</Typography>
            </ParallaxItem>

            <ParallaxItem yOffsetFrom={100} yOffsetTo={0} speedBoost={1.2}>
              <Typography as="a" href="mailto:support@smartforming.com" variant="h300">
                support@smartforming.com
              </Typography>
            </ParallaxItem>
          </div>
          <ParallaxItem yOffsetFrom={400} yOffsetTo={0} speedBoost={1.3} className={st.flexItem}>
            <Form />
          </ParallaxItem>
        </div>
      </div>
    </div>
  </>
);
