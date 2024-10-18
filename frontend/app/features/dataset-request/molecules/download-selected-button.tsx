import { useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import axios from 'axios';

import { Button, Icon } from '@smar/ui';

import { useDownloadProgress } from '../use-download-proggress';

export const DownloadSelectedButton = ({
  table,
  selectionCount,
}: {
  selectionCount: number;
  table: Table<IAttachFile>;
}) => {
  const { setDownloadProgresses } = useDownloadProgress();

  const downloadFiles = useCallback(
    (links: { url: string; fileName: string }[]) => {
      const promises = links.map(link => {
        const { url, fileName } = link;

        return axios({
          url,
          method: 'GET',
          responseType: 'blob',
          onDownloadProgress: progressEvent => {
            if (progressEvent.lengthComputable && progressEvent.total) {
              const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
              setDownloadProgresses(prevProgress => {
                const updatedProgress = prevProgress.map(item =>
                  item.fileName === fileName
                    ? { ...item, progress: percentComplete.toFixed(2) }
                    : item,
                );
                return updatedProgress;
              });
            }
          },
        })
          .then(response => {
            const blob = new Blob([response.data]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
          })
          .catch(error => {
            console.error(`Failed to download ${fileName}:`, error);
          });
      });

      Promise.all(promises)
        .then(() => {
          console.log('All files downloaded successfully.');
          setDownloadProgresses([]);
        })
        .catch(error => {
          console.error('Error occurred during file downloads:', error);
          setDownloadProgresses([]);
        });
    },
    [setDownloadProgresses],
  );

  const handleDownloadSelectedFree = useCallback(() => {
    const files = table.getSelectedRowModel().flatRows.map(item => ({
      id: item.original.fileData.id,
      url: item.original.fileUrl,
      fileName: item.original.fileData.metadata.filename,
    }));
    const initialProgress = files.map(file => ({
      ...file,
      progress: '0',
    }));

    setDownloadProgresses(initialProgress);
    downloadFiles(files);
  }, [downloadFiles, setDownloadProgresses, table]);

  return (
    <Button className="mt-4" onClick={handleDownloadSelectedFree}>
      <Icon name="download" size={24} /> download ({selectionCount})
    </Button>
  );
};
