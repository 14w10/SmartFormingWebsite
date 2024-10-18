import { FC, useCallback } from 'react';

import { Button } from '@smar/ui';

import { useFileUpload } from 'libs/upload-file';

// TODO: atom?! refactor to @smar/ui
import { FileAttachment } from '../atoms/file-attachment';
import { useComputationForm } from '../hook';

type UploadFileProps = { name: string };

export const UploadFile: FC<UploadFileProps> = ({ name }) => {
  const {
    setComputationRequestFile,
    showFileErrorSet,
    computationRequestFile,
    showFileError,
  } = useComputationForm();

  const { upload, selectedFile, uploadState, uploadProgress } = useFileUpload({
    onSuccess: data => {
      setComputationRequestFile(data);
      showFileErrorSet(false);
    },
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        upload(files[0]);
      }
    },
    [upload],
  );

  const resetFile = useCallback(() => {
    setComputationRequestFile(undefined);
    uploadState.reset();
  }, [setComputationRequestFile, uploadState]);

  return (
    <div className="relative" id="simulationFile">
      <input
        type="file"
        name={name}
        id={name}
        className="hidden"
        disabled={uploadState.isLoading}
        onChange={handleFileChange}
      />

      {uploadState.isIdle && (
        <div className="relative">
          <Button as="label" for={name} size="md" style={{ minWidth: 236 }}>
            Upload file
          </Button>
          {!computationRequestFile && showFileError && (
            <p className="text-auxiliaryRed900 absolute text-sm">File is required</p>
          )}
        </div>
      )}

      {!uploadState.isIdle && (
        <FileAttachment
          fileName={selectedFile?.name}
          uploadProgress={uploadProgress}
          resetFile={resetFile}
        />
      )}
    </div>
  );
};
