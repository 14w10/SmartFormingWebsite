import { useMemo } from 'react';

import { Card, Icon, Keywords } from '@smar/ui';

import { formatDate } from 'libs/format-date';
import { MODULE_TYPES } from 'features/modules';

export const ModuleInfo = ({ computationModule }: { computationModule: Module }) => {
  const verificationReport = useMemo(
    () => computationModule.attachments.find(item => item.fileType === 'verificationReport'),
    [computationModule.attachments],
  );

  return (
    <Card variant="sm">
      <div className="flex items-center">
        <img
          className="object-cover"
          style={{ width: 151, height: 72, borderRadius: '10px 10px 10px 0px' }}
          src={computationModule?.cover?.croppedUrl || '/default-module.png'}
          alt=""
        />
        <div className="ml-3">
          <p className="v-h170">{computationModule.title}</p>
          <p className="v-p130 text-secondaryDarkBlue900">
            <span className="text-secondaryDarkBlue920">Requested</span>{' '}
            {formatDate(computationModule?.createdAt)}
          </p>
          <p className="v-p130 text-secondaryDarkBlue900">
            <span className="text-secondaryDarkBlue920">by</span>{' '}
            {computationModule.author?.firstName} {computationModule.author?.lastName}
          </p>
        </div>
      </div>
      <div className="flex mb-3 mt-4">
        <div className="mr-3 w-1/3">
          <h3 className="v-text110 text-secondaryDarkBlue900 mb-1">
            portfolio verification report
          </h3>
          <a
            href={verificationReport?.fileUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="border-secondaryDarkBlue930 rounded-large py-12px flex items-center justify-between px-2 border"
          >
            <span className="v-text130 text-primaryBlue900 flex items-center">
              <Icon name="attachment" iconFill="primaryBlue900" size={24} mr={1} />
              {verificationReport?.fileData.metadata.filename || ''}
            </span>
            <Icon name="open-in-new" iconFill="primaryBlue900" size={24} />
          </a>
        </div>
        {computationModule.moduleType && (
          <div className="w-1/3">
            <h3 className="v-text110 text-secondaryDarkBlue900 mb-1">Module type</h3>
            <span className="v-text130 text-secondaryDarkBlue910 border-secondaryDarkBlue930 rounded-large py-12px flex px-2 border">
              {MODULE_TYPES[computationModule.moduleType]}
            </span>
          </div>
        )}
      </div>
      {computationModule.shortDescription && (
        <div>
          <h3 className="v-text110 text-secondaryDarkBlue900 mb-1">Short Description</h3>
          <p className="v-p130 text-secondaryDarkBlue900 mb-3">
            {computationModule.shortDescription}
          </p>
        </div>
      )}
      <div>
        <h3 className="v-text110 text-secondaryDarkBlue900 mb-1">Description</h3>
        <p className="v-p130 text-secondaryDarkBlue900 mb-3">{computationModule.description}</p>
      </div>
    </Card>
  );
};
