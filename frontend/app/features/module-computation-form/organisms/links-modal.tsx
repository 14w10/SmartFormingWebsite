import { FC } from 'react';

import { Button, Icon, Modal, Typography } from '@smar/ui';

export const LinksModal: FC<{
  links?: ComputationFormDTO['meta']['links'];
  isOpen: boolean;
  onClose: () => void;
}> = ({ links, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-3 rounded-large mt-4 mb-4 max-w-full" style={{ width: 633 }}>
        <Typography
          as="h1"
          className="flex items-center text-secondaryDarkBlue900"
          variant="text110"
        >
          Download macro
          <Button variant="icon" className="ml-auto" onClick={onClose}>
            <Icon size={24} name="close" />
          </Button>
        </Typography>

        {links?.map(link => (
          <div key={link.link} className="flex pt-4">
            <div className="pr-3 mr-auto">
              <Typography as="h3" variant="label140" className="text-secondaryDarkBlue900">
                {link.title}
              </Typography>
              <Typography variant="label140" className="text-secondaryDarkBlue910">
                {link.description}
              </Typography>
            </div>

            <Button as="a" variant="outlined" href={link.link}>
              <Icon size={24} name="download" />
              Download
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
};
