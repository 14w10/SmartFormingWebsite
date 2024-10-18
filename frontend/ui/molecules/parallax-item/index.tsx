import React, { FC, memo, useMemo, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';

import { useParallax } from './use-parallax';

type ParallaxItem = {
  as?: string;
  speedBoost?: number;
  yOffsetFrom?: number;
  yOffsetTo?: number;
} & Record<string, any>;

const ParallaxItemImpl: FC<ParallaxItem> = ({
  as = 'div',
  children,
  speedBoost = 1,
  yOffsetFrom = 0,
  yOffsetTo = 100,
  ...rest
}) => {
  const Comp = useMemo(() => (motion as any)[as], [as]);
  const ref = useRef<HTMLElement>(null);

  const { range, boostedY } = useParallax(ref, speedBoost);
  const x = useTransform(boostedY, range, [yOffsetFrom, yOffsetTo]);

  return (
    <Comp ref={ref as any} initial={{ x: 0 }} style={{ x }} {...rest}>
      {children}
    </Comp>
  );
};

export const ParallaxItem = memo(ParallaxItemImpl);

export * from './fade-in-scale';
export * from './use-parallax';
