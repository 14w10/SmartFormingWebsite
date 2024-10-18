import { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Icon, Typography } from '@smar/ui';

type AccordionProps = {
  children: any;
  className?: string;
  title: string;
  subtitle?: string;
  subtitleDescription?: string;
  defaultState?: string;
};

export const Accordion: FC<AccordionProps> = ({
  children,
  className,
  title,
  subtitle,
  subtitleDescription,
  defaultState = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const transition = { duration: 0.3, ease: 'easeInOut' };
  const contentVariants = {
    open: { opacity: 1, height: 'auto' },
    collapsed: { opacity: 0, height: 0 },
  };

  return (
    <div className={className}>
      <div className="flex cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center mr-2">
          <Icon
            name="arrow-drop-up"
            iconFill="darkBlue900"
            size={24}
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
          />
        </div>
        <div>
          <Typography variant="h200" color="secondaryDarkBlue900">
            {title}
          </Typography>
          <Typography variant="text150" color="secondaryDarkBlue900">
            <Typography as="span" variant="text150" color="primaryBlue900">
              {subtitle}
            </Typography>{' '}
            {subtitleDescription && <>- {subtitleDescription}</>}
          </Typography>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={contentVariants}
            transition={transition}
          >
            <div className="pt-3 pl-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
