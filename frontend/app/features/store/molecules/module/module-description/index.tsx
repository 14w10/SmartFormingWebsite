import { FC, useMemo } from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';

import { Card, Icon, Keywords, Typography } from '@smar/ui';

import { getCategoriesQueryKey } from 'features/store/api';

import st from './styles.module.scss';

type ModuleDescriptionType = {
  className?: string;
  computationModule: Module;
};

export const ModuleDescription: FC<ModuleDescriptionType> = ({ computationModule, className }) => {
  const verificationReport = useMemo(
    () => computationModule.attachments.find(item => item.fileType === 'verificationReport'),
    [computationModule.attachments],
  );
  const { data } = useQuery<APIListResponse<Category>>(getCategoriesQueryKey());

  const categoryName = useMemo(
    () => data?.payload.find(item => item.id === computationModule.categoryId)?.name,
    [computationModule.categoryId, data?.payload],
  );

  return (
    <div className={`${st.root} ${className && className}`}>
      <div>
        <Typography as="h2" variant="text110" mb={1} color="secondaryDarkBlue900">
          Description
        </Typography>
        <Card className={st.description} variant="sm">
          <div className="flex mb-3">
            <div className={st.featuresItem}>
              <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
                SFeatures
              </Typography>
              <div className="flex flex-col gap-2">
                {verificationReport && (
                  <a
                    href={verificationReport?.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={st.featuresAttachment}
                  >
                    <Typography
                      className={st.featuresIconText}
                      as="span"
                      variant="text130"
                      color="primaryBlue900"
                    >
                      <Icon name="attachment" iconFill="primaryBlue900" size={24} mr={1} />
                      {verificationReport?.fileData.metadata.filename || ''}
                    </Typography>
                    <Icon name="open-in-new" iconFill="primaryBlue900" size={24} />
                  </a>
                )}
              </div>
            </div>
            {computationModule.moduleType && (
              <div className={st.featuresItem}>
                <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
                  Category
                </Typography>
                <span className="v-text130 text-secondaryDarkBlue910 border-secondaryDarkBlue930 rounded-large py-12px flex px-2 border">
                  {categoryName}
                </span>
              </div>
            )}
          </div>
          <div className={st.description}>
            <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
              Description
            </Typography>
            <Typography variant="p130" color="secondaryDarkBlue" mb={3}>
              {computationModule.description}
            </Typography>
          </div>
          <div className={st.keywoards}>
            <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
              Keywords
            </Typography>
            <Keywords data={computationModule.keywords || []} />
          </div>
          {computationModule.uid && (
            <div className={st.description}>
              <Typography as="h3" variant="text110" mt={3} color="secondaryDarkBlue900">
                Id
              </Typography>
              <Typography variant="p130" color="secondaryDarkBlue" mb={1}>
                {computationModule.uid}
              </Typography>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
