import React, { FC, ReactNode, useCallback, useRef } from 'react';
import FocusLock from 'react-focus-lock';
import { useKey } from 'react-use';

import { Portal } from '../../atoms';
import { useDisableWindowScroll } from './hook';

import st from './styles.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  const handleContentClick = useCallback((e: { stopPropagation: () => any; }) => e.stopPropagation(), []);

  useDisableWindowScroll(isOpen, containerRef);

  useKey('Escape', () => isOpen && onClose && onClose(), {}, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <Portal>
      <div className={`${className ?? ''} ${st.wrapper}`}>
        {isOpen && (
          <div
            className={st.contentContainer}
            onClick={handleClose}
            ref={containerRef}
            data-modal-container
          >
            <div className={st.content}>
              <div onClick={handleContentClick}>
                <FocusLock returnFocus>{children}</FocusLock>
              </div>
            </div>
          </div>
        )}
        {isOpen && <div className={st.underlay} />}
      </div>
    </Portal>
  );
};

Modal.defaultProps = {
  onClose: () => null,
};

export { ModalCloseButton } from './modal-close-button';
export * from './content';
