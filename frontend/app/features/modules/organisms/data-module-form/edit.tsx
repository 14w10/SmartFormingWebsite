import { useCallback, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import { redirect } from 'libs/redirect';
import { editModuleReq } from 'features/modules/api';
import { useCurrentUser } from 'features/user';

import { TemplateForm } from './template';

export const EditDataModuleForm = ({ moduleData }: { moduleData?: Module }) => {
  const [removeFiles, removeFilesSet] = useState<
    { id: number | string; _destroy?: number; price?: string | null }[]
  >([]);
  const [removeAttachmentFiles, removeAttachmentFilesSet] = useState<
    { id: number | string; _destroy?: number; price?: string | null }[]
  >([]);
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const isUser = currentUser?.role === 'user';
  const { mutate: editModule, isLoading } = useMutation(editModuleReq, {
    onSuccess: () => {
      redirect(null, isUser ? `/my/modules/${query.moduleId}` : `/modules/${query.moduleId}`);
    },
  });

  const handleRemoveDatasetsFile = useCallback(
    (id: number) => {
      const isExist = moduleData?.datasets.find(item => item.id === id);
      isExist && removeFilesSet(prevState => [...prevState, { id, _destroy: 1 }]);
    },
    [moduleData?.datasets],
  );

  const handleRemoveFile = useCallback(
    (id: number) => {
      const isExist = moduleData?.attachments.find(item => item.id === id);
      isExist && removeAttachmentFilesSet(prevState => [...prevState, { id, _destroy: 1 }]);
    },
    [moduleData?.attachments],
  );

  const handleChangeFilePrice = useCallback(
    (id: number | string, paid: boolean) => {
      const isExist = moduleData?.datasets.find(item => item.id === id);
      isExist && removeFilesSet(prevState => [...prevState, { id, paid }]);
    },
    [moduleData?.datasets],
  );

  const onSubmit = useCallback(
    async (values: any) => {
      const { cover, attachmentsAttributes, attachReport, ...restValues } = values;
      const attachments = [];
      const parsedAttachReport: any = JSON.parse(attachReport);
      parsedAttachReport !== '' &&
        typeof parsedAttachReport.id !== 'number' &&
        attachments.push({
          fileType: 'verificationReport',
          file: parsedAttachReport,
        });

      const formattedAttachmentsAttributes = attachmentsAttributes
        .filter((item: any) => !item.attached)
        .map((item: any) => ({
          paid: item.paid,
          file: item.fileData,
        }));
      const parsedCover = { cover: cover ? JSON.parse(cover) : null };
      const { croppedUrl, url, ...restCover } = parsedCover as any;
      formattedAttachmentsAttributes.push(...removeFiles);
      attachments.push(...removeAttachmentFiles);

      await editModule({
        ...restValues,
        attachmentsAttributes: attachments,
        datasetsAttributes: formattedAttachmentsAttributes,
        moduleId: query.moduleId,
        isUser,
        moduleContentType: 'data_module',
        ...restCover,
      });
    },
    [editModule, isUser, query.moduleId, removeAttachmentFiles, removeFiles],
  );
  const formattedCover = useMemo(() => {
    if (moduleData && (moduleData?.cover as any)?.data) {
      const { derivatives, ...restData } = (moduleData?.cover as any)?.data;
      return JSON.stringify({
        croppedUrl: moduleData.cover.croppedUrl,
        url: moduleData.cover.url,
        ...restData,
      });
    }
  }, [moduleData]);

  return (
    <>
      {moduleData && (
        <TemplateForm
          initialValues={{
            title: moduleData.title,
            shortDescription: moduleData.shortDescription,
            description: moduleData.description,
            attachReport:
              moduleData.attachments &&
              (JSON.stringify(
                moduleData.attachments?.find(item => item.fileType === 'verificationReport'),
              ) as any),
            attachmentsAttributes: moduleData.datasets?.map(item => ({
              ...item,
              attached: true,
            })),
            moduleType: moduleData.moduleType as string,
            categoryId: moduleData.categoryId as string,
            keywords: moduleData.keywords,
            cover: formattedCover,
          }}
          handleRemoveDatasetsFile={handleRemoveDatasetsFile}
          handleRemoveFile={handleRemoveFile}
          handleChangeFilePrice={handleChangeFilePrice}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
