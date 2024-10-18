import { FC, ReactNode } from 'react';

export const AuthWrapper: FC<{children: ReactNode}> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen py-3">
      <div className="mx-3 p-4 bg-white shadow-shadow3 rounded-large" style={{ width: 440 }}>
        {children}
      </div>
    </div>
  );
};
