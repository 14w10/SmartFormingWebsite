import { FC, ReactNode } from 'react';
import { CSSProperties } from 'styled-components';

import { ModalCloseButton } from './modal-close-button';

export const ModalContent: FC<{
  title?: string;
  handleClose: () => void;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}> = ({ children, title, handleClose, style, className }) => {
  return (
    <div
      className={`bg-white max-w-full rounded-md shadow-shadow4 p-3 my-3 ${className ?? ''}`}
      style={{ width: 438, ...style }}
    >
      <div className="flex items-center justify-end">
        {title && <h3 className="text-secondaryDarkBlue900 v-text110">{title}</h3>}
        <ModalCloseButton onClick={handleClose} />
      </div>
      {children}
    </div>
  );
};
