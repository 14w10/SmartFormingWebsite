import { useCallback, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import { redirect } from 'libs/redirect';
import { editModuleReq } from 'features/modules/api';
import { useCurrentUser } from 'features/user';

import { TemplateForm } from './template';

export const EditFunctionModuleForm = ({ moduleData }: { moduleData?: Module }) => {
  const [removeFiles, removeFilesSet] = useState<{ id: number; _destroy: number }[]>([]);
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const isUser = currentUser?.role === 'user';
  const { mutate: editModule, isLoading } = useMutation(editModuleReq, {
    onSuccess: () => {
      redirect(null, isUser ? `/my/modules/${query.moduleId}` : `/modules/${query.moduleId}`);
    },
  });

  const handleRemoveFile = useCallback(
    (id: number) => {
      const isExist = moduleData?.attachments.find(item => item.id === id);
      isExist && removeFilesSet(prevState => [...prevState, { id, _destroy: 1 }]);
    },
    [moduleData?.attachments],
  );

  const onSubmit = useCallback(
    async (values: any) => {
      const { attachModule, attachReport, cover, ...restValues } = values;
      const attachmentsAttributes = [];
      const parsedCover = { cover: cover ? JSON.parse(cover) : null };
      const { croppedUrl, url, ...restCover } = parsedCover as any;

      const parsedAttachModule: any = JSON.parse(attachModule);
      const parsedAttachReport: any = JSON.parse(attachReport);
      attachmentsAttributes.push(...removeFiles);
      parsedAttachModule !== '' &&
        typeof parsedAttachModule.id !== 'number' &&
        attachmentsAttributes.push({
          fileType: 'functionalModule',
          file: parsedAttachModule,
        });

      parsedAttachReport !== '' &&
        typeof parsedAttachReport.id !== 'number' &&
        attachmentsAttributes.push({
          fileType: 'verificationReport',
          file: parsedAttachReport,
        });
      await editModule({
        ...restValues,
        attachmentsAttributes,
        moduleId: query.moduleId,
        isUser,
        ...restCover,
      });
    },
    [editModule, isUser, query.moduleId, removeFiles],
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
            attachModule:
              moduleData.attachments &&
              (JSON.stringify(
                moduleData.attachments?.find(item => item.fileType === 'functionalModule'),
              ) as any),
            moduleType: moduleData.moduleType as string,
            categoryId: moduleData.categoryId as string,
            keywords: moduleData.keywords,
            cover: formattedCover,
          }}
          handleRemoveFile={handleRemoveFile}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
