import { useState } from 'react';
import { useThrottle } from 'react-use';
import constate from 'constate';

type DownloadProgress = {
  fileName: string;
  progress: string;
  id: string;
};

const useDownloadProgressBase = () => {
  const [downloadProgresses, setDownloadProgresses] = useState<DownloadProgress[]>([]);
  const throttledValue = useThrottle(downloadProgresses, 200);

  return { downloadProgresses: throttledValue, setDownloadProgresses };
};

export const [DownloadProgressProvider, useDownloadProgress] = constate(useDownloadProgressBase);
