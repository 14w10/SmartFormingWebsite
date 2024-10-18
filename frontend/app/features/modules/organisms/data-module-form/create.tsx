import { useCallback } from 'react';
import { useMutation } from 'react-query';

import { redirect } from 'libs/redirect';
import { createModuleReq } from 'features/modules/api';
import { useCurrentUser } from 'features/user';

import { TemplateForm } from './template';
import { initialValues } from './validation-schema';

export const CreateDataModuleForm = () => {
  const { currentUser } = useCurrentUser();
  const { mutate: createModule, isLoading } = useMutation(createModuleReq, {
    onSuccess: () => {
      redirect(null, '/my/modules');
    },
  });

  const onSubmit = useCallback(
    async (values: any) => {
      const { cover, attachmentsAttributes, attachReport, ...newValues } = values;
      const parsedCover = cover ? { cover: JSON.parse(cover) } : {};

      const attachments = [];
      const parsedAttachReport: any = JSON.parse(attachReport);
      parsedAttachReport !== '' &&
        typeof parsedAttachReport.id !== 'number' &&
        attachments.push({
          fileType: 'verificationReport',
          file: parsedAttachReport,
        });

      const formattedAttachmentsAttributes = attachmentsAttributes.map((item: any) => ({
        paid: item.paid,
        file: item.fileData,
      }));

      await createModule({
        ...newValues,
        authorId: currentUser?.id,
        moduleType: 'pre-fe',
        attachmentsAttributes: attachments,
        datasetsAttributes: formattedAttachmentsAttributes,
        moduleContentType: 'data_module',
        ...parsedCover,
      });
    },
    [createModule, currentUser?.id],
  );

  return (
    <TemplateForm initialValues={{ ...initialValues }} onSubmit={onSubmit} isLoading={isLoading} />
  );
};
