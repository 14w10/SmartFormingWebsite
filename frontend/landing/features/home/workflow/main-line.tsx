import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';

import { useParallax } from '@smar/ui';

import st from './styles.module.scss';

export const MainLine = () => {
  const ref = useRef(null);
  const { range, boostedY } = useParallax(ref, 1.3, 0.74, 0);
  const pathLength = useTransform(boostedY, range, [0, 1]);

  return (
    <svg
      className={st.line}
      fill="none"
      height="248"
      preserveAspectRatio="none"
      ref={ref}
      viewBox="0 0 3715 248"
      width="3715"
    >
      <motion.path
        d="M2 73H515C657 73 619.5 119 755 119C890.5 119 846 60 988.5 60C1131 60 1130.5 177 1283 177C1457 177 1454.5 65 1660 65C1865.5 65 1896 184 2094.5 184C2293 184 2385 83.5 2438.5 47L2441.67 45C2498.78 7.83281 2542.56 2 2615.5 2C2708.5 2 2787.5 133 2962.5 133C3137.5 133 3109.5 246 3280 246C3450.5 246 3422 132 3713 132"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        stroke="var(--primaryBlue900)"
        initial={{ pathLength: 0 }}
        style={{ pathLength }}
      />
    </svg>
  );
};
