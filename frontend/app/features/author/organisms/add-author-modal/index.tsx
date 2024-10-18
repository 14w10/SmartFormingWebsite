import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { nanoid } from 'nanoid';

import { Button, CheckboxField, FormField, Input, Modal, ModalContent, MultiInput } from '@smar/ui';

import { useAuthors } from '../../hook/use-authors';
import { validationSchema } from './validation-schema';

export const AddAuthorModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const methods = useForm({ resolver: yupResolver(validationSchema) });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const { addAuthors, authors, editedAuthorId, editAuthors } = useAuthors();

  useEffect(() => {
    const author = authors?.find(item => item.generatedId === editedAuthorId);
    author && Object.entries(author).map(([key, value]) => setValue(key as any, value));
  }, [authors, editedAuthorId, setValue]);

  const onSubmit = useCallback(
    (val: Author) => {
      const handleAuthors = editedAuthorId ? editAuthors : addAuthors;
      handleAuthors(val);
      handleClose();
    },
    [addAuthors, editAuthors, editedAuthorId, handleClose],
  );

  return (
    <Modal isOpen={Boolean(isOpen)} onClose={handleClose}>
      <ModalContent title="Add Current Authors" handleClose={handleClose} style={{ width: 715 }}>
        <div className="mt-2">
          <FormProvider {...methods}>
            <form>
              {/* <input type="hidden" value={nanoid()} name="generatedId" ref={methods.register} /> */}

              <FormField
                component={Input}
                className="mb-2"
                name="firstName"
                label="First Name"
                required
              />
              <FormField
                component={Input}
                className="mb-2"
                name="lastName"
                label="Last Name"
                required
              />
              <FormField
                component={Input}
                className="mb-2"
                name="degree"
                label="Academic Degree(s)"
              />
              <FormField
                component={Input}
                className="mb-2"
                name="institution"
                label="Institution"
              />
              <FormField component={Input} className="mb-2" name="region" label="Region" />
              <FormField component={Input} className="" name="orcid" label="ORCID" />
              <p className="text-secondaryDarkBlue920 v-p130 mb-1">
                The ORCID is a nonproprietary alphanumeric code to uniquely identify scientific and
                other academic authors and contributors.
              </p>
              <FormField
                component={Input}
                className="mb-2"
                name="email"
                type="email"
                label="Email Address"
                required
              />
              <FormField
                component={Input}
                className="mb-2"
                name="productContribution"
                label="Intellectual product contribution, %"
                required
              />
              <FormField
                component={MultiInput}
                width={350}
                variant="default"
                withHelperText
                controlled
                className="mb-2"
                name="researchAreas"
                label="Research Areas"
              />
              <div className="flex items-center justify-between">
                <FormField component={CheckboxField} name="main" text="Pick as a main author" />
                <div>
                  <Button variant="outlined" disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button className="ml-1" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </ModalContent>
    </Modal>
  );
};
