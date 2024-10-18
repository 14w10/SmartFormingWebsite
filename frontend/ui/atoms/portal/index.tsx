/* eslint-disable react-hooks/rules-of-hooks */
import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Portal: FC<{
  children: ReactNode;
  containerSelector?: string;
}> = ({ children, containerSelector = '#portals' }) => {
  if (typeof window !== 'object') {
    return null;
  }

  const modalRoot = useRef<HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    const parentElem = document.querySelector(containerSelector);

    if (parentElem) {
      parentElem.appendChild(modalRoot.current);
    }

    const root = modalRoot.current;

    return () => root.remove();
  }, [containerSelector]);

  return createPortal(children, modalRoot.current);
};
