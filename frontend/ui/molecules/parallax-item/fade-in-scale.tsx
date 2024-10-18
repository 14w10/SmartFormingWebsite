import React, { FC, memo, useMemo, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';

import { useParallax } from './use-parallax';

type ParallaxItem = {
  as?: string;
  speedBoost?: number;
  startOffset?: number;
  endOffset?: number;
} & Record<string, any>;

const ParallaxItemFadeInImpl: FC<ParallaxItem> = ({
  as = 'div',
  children,
  speedBoost = 1,
  style,
  withScale = true,
  startOffset = 1.1,
  endOffset = -0.6,
  ...rest
}) => {
  const Comp = useMemo(() => (motion as any)[as], [as]);
  const ref = useRef<HTMLElement>(null);

  const { range, boostedY } = useParallax(ref, speedBoost, startOffset, endOffset);
  const scale = useTransform(boostedY, range, [0, 1]);

  if (process.env.NODE_ENV === 'development' && rest.log) {
    console.log('ParallaxItemFadeInImpl', range);
  }

  return (
    <Comp
      ref={ref as any}
      initial={{ transformOrigin: 'top left', opacity: 0, ...style }}
      style={{ opacity: scale, scale: withScale ? scale : 1 }}
      {...rest}
    >
      {children}
    </Comp>
  );
};

export const ParallaxItemFadeIn = memo(ParallaxItemFadeInImpl);
