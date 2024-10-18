import { useCallback } from 'react';
import { useMutation } from 'react-query';

import { redirect } from 'libs/redirect';
import { createModuleReq } from 'features/modules/api';
import { useCurrentUser } from 'features/user';

import { TemplateForm } from './template';
import { initialValues } from './validation-schema';

export const CreateFunctionModuleForm = () => {
  const { currentUser } = useCurrentUser();
  const { mutate: createModule, isLoading } = useMutation(createModuleReq, {
    onSuccess: () => {
      redirect(null, '/my/modules');
    },
  });

  const onSubmit = useCallback(
    async (values: any) => {
      const { attachModule, attachReport, moduleType, cover, ...newValues } = values;
      const attachmentsAttributes = [];
      const parsedCover = cover ? { cover: JSON.parse(cover) } : {};
      attachModule !== '' &&
        attachmentsAttributes.push({
          fileType: 'functionalModule',
          file: JSON.parse(attachModule),
        });

      attachReport !== '' &&
        attachmentsAttributes.push({
          fileType: 'verificationReport',
          file: JSON.parse(attachReport),
        });
      await createModule({
        ...newValues,
        authorId: currentUser?.id,
        moduleType: 'pre-fe',
        attachmentsAttributes,
        moduleContentType: 'functional_module',
        ...parsedCover,
      });
    },
    [createModule, currentUser?.id],
  );

  return (
    <TemplateForm initialValues={{ ...initialValues }} onSubmit={onSubmit} isLoading={isLoading} />
  );
};
