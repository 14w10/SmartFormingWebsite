import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, CropImageModal, Icon, UploadButton } from '@smar/ui';

import { getImageDimensions } from 'libs/get-image-dimensions';
import { useFileUpload } from 'libs/upload-file';

export const UploadCover = ({
  onChange,
  value,
}: {
  value?: string;
  onChange?: (data?: string) => void;
}) => {
  const [isError, isErrorSet] = useState(false);
  const parsedValue = useMemo(() => value && JSON.parse(value), [value]);
  const [image, imageSet] = useState<
    (File & { preview?: string; croppedPreview?: string }) | undefined
  >(
    parsedValue
      ? { ...parsedValue, preview: parsedValue?.url, croppedPreview: parsedValue?.croppedUrl }
      : undefined,
  );
  const [modalIsOpen, modalIsOpenSet] = useState(false);
  const { selectedFile, uploadState, reset, upload } = useFileUpload({
    onSuccess: value => {
      onChange?.(JSON.stringify(value));
    },
  });

  const onDrop = useCallback(
    async (file: File) => {
      const { width, height } = await getImageDimensions(file);

      isErrorSet(false);
      if (width > 512 && width < 5000 && height > 512 && height < 5000) {
        upload(file);
        imageSet(file);
      } else {
        imageSet(undefined);
        isErrorSet(true);
      }
    },
    [upload],
  );

  useEffect(() => {
    if (!selectedFile) return;
    imageSet(
      Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
      }),
    );
    modalIsOpenSet(true);
  }, [modalIsOpenSet, selectedFile]);

  const setCropPreview = useCallback((croppedPreview: string) => {
    imageSet(prevState => prevState && { ...prevState, croppedPreview });
  }, []);

  const resetFile = useCallback(() => {
    reset();
    imageSet(undefined);
    onChange?.();
  }, [onChange, reset]);

  return (
    <>
      <div className="flex">
        <div
          className="shadow-shadow4 text-primaryBlue910 flex items-center justify-center mr-2 bg-white rounded-2xl overflow-hidden"
          style={{ width: 105, height: 140 }}
        >
          {!image ? (
            <Icon name="24px-image" size={24} />
          ) : (
            <img
              src={image?.croppedPreview || image?.preview}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col">
          <p className="v-h150">Module cover</p>
          <div className="flex flex-col justify-between mt-2 h-full">
            {!image ? (
              <UploadButton onDrop={onDrop} />
            ) : (
              <Button variant="outlined" onClick={() => modalIsOpenSet(true)}>
                Edit cover
              </Button>
            )}
            {image && (
              <Button variant="outlined" onClick={resetFile} className="mt-2">
                Remove
              </Button>
            )}
          </div>
        </div>
        <div className="v-p130 ml-2 mt-3">
          <p>JPEG or PNG, max size of 5MB.</p>
          <p>Resolution: min 512x512, max 5000x5000</p>
          {isError && <p className="text-auxiliaryRed900 text-xs">Image is not valid</p>}
        </div>
      </div>
      <CropImageModal
        isOpen={Boolean(modalIsOpen && image)}
        handleClose={() => modalIsOpenSet(false)}
        image={image}
        setCropPreview={setCropPreview}
        isLoading={uploadState.isLoading}
        uploadedCover={value}
        onChangeCover={onChange}
        onDrop={onDrop}
        aspect={0.75}
      />
    </>
  );
};
