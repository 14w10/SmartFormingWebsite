import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';

import { Button, Spinner } from '../../atoms';
import { UploadButton } from '../../molecules';
import { Modal, ModalContent } from '../../organisms';
import { getCroppedImg } from './crop-image';

export const CropImageModal = ({
  image,
  isOpen,
  handleClose,
  setCropPreview,
  isLoading,
  onChangeCover,
  uploadedCover,
  onDrop,
  aspect,
}: {
  image?: File & { preview?: string };
  isOpen: boolean;
  handleClose: () => void;
  isLoading: boolean;
  setCropPreview: (imageUrl: string) => void;
  uploadedCover?: string;
  onChangeCover?: (data?: string) => void;
  onDrop: (file: File) => void;
  aspect: number;
}) => {
  //  disallow close modal hack for click on underlay while crop changing
  const [cropChanging, cropChangingSet] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    cropChangingSet(false);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const cropImage = useCallback(async () => {
    const croppedImage =
      croppedAreaPixels &&
      (await getCroppedImg(image?.preview as string, croppedAreaPixels, image?.type as string));
    croppedImage && setCropPreview(croppedImage);
    const parsedValue =
      uploadedCover && typeof uploadedCover === 'string'
        ? JSON.parse(uploadedCover)
        : uploadedCover;
    const newCoverValue = {
      ...parsedValue,
      metadata: { ...parsedValue.metadata, crop: croppedAreaPixels },
    };
    uploadedCover && onChangeCover?.(JSON.stringify(newCoverValue));
    handleClose();
  }, [
    croppedAreaPixels,
    handleClose,
    image?.preview,
    image?.type,
    onChangeCover,
    setCropPreview,
    uploadedCover,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent
        title="Crop the image"
        style={{ width: 638, zIndex: 2 }}
        handleClose={handleClose}
      >
        <div
          className="relative mt-3 w-full"
          style={{ height: 600 }}
          onMouseDown={() => cropChangingSet(true)}
        >
          <Cropper
            image={image?.preview}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <UploadButton onDrop={onDrop} />
          <div className="flex items-center">
            {isLoading && (
              <div className="mr-2">
                <Spinner />
              </div>
            )}
            <Button className="mr-2" variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={cropImage} disabled={isLoading}>
              Save
            </Button>
          </div>
        </div>
      </ModalContent>
      <div
        style={
          cropChanging
            ? { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }
            : { zIndex: 1 }
        }
      />
    </Modal>
  );
};
