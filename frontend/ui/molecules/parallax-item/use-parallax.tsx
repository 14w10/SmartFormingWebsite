import { RefObject, useEffect, useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';
import { useTransform, useViewportScroll } from 'framer-motion';

export const useParallax = (
  ref: RefObject<HTMLElement>,
  speedBoost = 1,
  startOffset = 0.1,
  endOffset = -0.1,
) => {
  const [rect, rectSet] = useState<DOMRect>({} as DOMRect);

  const { width } = useWindowSize();
  const { scrollY } = useViewportScroll();

  const range = useMemo(() => {
    const startOffsetPx = startOffset * width;
    const endOffsetPx = endOffset * width;

    const transformInitialValue = rect.left - startOffsetPx;
    const transformFinalValue = rect.left + rect.width + endOffsetPx;

    return [transformInitialValue, transformFinalValue];
  }, [rect, width, startOffset, endOffset]);

  useEffect(() => {
    setTimeout(() => {
      rectSet(ref.current?.getBoundingClientRect() || ({} as DOMRect));
    });
  }, [ref]);

  const boostedY = useTransform(scrollY, val => val * speedBoost);

  return { boostedY, range };
};
