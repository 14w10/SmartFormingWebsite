import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button, Card, FormField, Input, MultiInput, Select, TextAreaLimit } from '@smar/ui';

import { AuthorList } from 'features/author/organisms/author-list';
import { getCategoriesQueryKey } from 'features/store/api';
import { UploadFile } from 'features/upload-file';

import { UploadCover } from '../../molecules/cover-upload';
import { ModuleFormType, validationSchema } from './validation-schema';
import { acceptTypeUploadFile } from '../data-module-form/template';
import { Accept } from 'react-dropzone';

const acceptTypeUploadFileModule: Accept = {
  'text/x-m': ['.m'],   // Common MIME type for .m files (MATLAB)
  'text/x-python': ['.py'] // Common MIME type for .py files (Python)
};

export const TemplateForm = ({
  initialValues,
  isLoading,
  onSubmit,
  handleRemoveFile,
}: {
  initialValues: ModuleFormType;
  handleRemoveFile?: (id: number) => void;
  onSubmit: (values: any, actions: any) => any;
  isLoading: boolean;
}) => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { ...initialValues, moduleType: initialValues?.moduleType || 'pre-fe' },
  });
  const { data } = useQuery<APIListResponse<Category>>(getCategoriesQueryKey());

  const typeOptions = useMemo(
    () => (data?.payload || []).map(item => ({ label: item.name, value: item.id })),
    [data?.payload],
  );

  const { handleSubmit } = methods;

  return (
    <div className="grid grid-cols-4">
      <Card className="col-span-3">
        <FormProvider {...methods}>
          <form className="flex flex-col">
            <FormField name="cover" component={UploadCover} controlled />
            <FormField
              component={Input}
              className="mb-2"
              label="Module title *"
              name="title"
              placeholder="Enter module title"
            />
            <FormField
              as="textarea"
              component={TextAreaLimit}
              className="mb-2"
              label="Short description *"
              name="shortDescription"
              limit={150}
              placeholder="Describe your module shortly"
              controlled
            />
            <FormField
              as="textarea"
              component={Input}
              className="mb-2"
              label="Module description *"
              name="description"
              rows={7}
              placeholder="A few word about your module"
            />
            <AuthorList />
            <div className="flex items-center mt-2">
              <FormField
                component={Select}
                className="w-29 mb-2"
                name="categoryId"
                label="Module category *"
                items={typeOptions}
                controlled
              />
              <p className="v-p130 ml-2">
                Module type affects the format of files we ask you to upload.
              </p>
            </div>
            <div className="flex items-center">
              <FormField
                component={UploadFile}
                className="w-29 mb-2"
                controlled
                name="attachModule"
                label="Verified module *"
                accept={acceptTypeUploadFileModule}
                buttonVariant="outlined"
                handleRemoveFile={handleRemoveFile}
              />
              <p className="v-p130 ml-2">
                Upload your verified module file here. Before make sure that it exported in MATLAB
                or Python format.
              </p>
            </div>
            <div className="flex items-center">
              <FormField
                component={UploadFile}
                className="w-29 mb-2"
                controlled
                name="attachReport"
                label="Module Verification Report *"
                accept={acceptTypeUploadFile}
                buttonVariant="outlined"
                handleRemoveFile={handleRemoveFile}
              />
              <p className="v-p130 ml-2">
                Upload your verified module file here. Make sure that it exported in PDF or Word
                format.
              </p>
            </div>
            <FormField
              component={MultiInput}
              className="mb-2"
              controlled
              name="keywords"
              label="Keywords"
              withHelperText
              variant="default"
            />
            <div className="flex mt-2">
              <Link href="/modules" passHref>
                <Button as="a" variant="outlined" type="button">
                  Cancel
                </Button>
              </Link>
              <Button className="ml-2" disabled={isLoading} onClick={handleSubmit(onSubmit as any)}>
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};
