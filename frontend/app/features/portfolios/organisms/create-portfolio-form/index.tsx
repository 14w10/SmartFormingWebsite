import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button, Card, FormField, Input, MultiInput, TextAreaLimit } from '@smar/ui';

import { redirect } from 'libs/redirect';
import { setErrorsForForm } from 'libs/set-errors-for-form';
import { useAuthors } from 'features/author/hook/use-authors';
import { AuthorList } from 'features/author/organisms/author-list';
import { useCurrentUser } from 'features/user';

import { createPortfolioReq } from '../../api';
import { usePickModule } from '../../hooks/use-pick-module';
import { UploadCover } from '../../molecules/cover-upload';
import { PortfolioComposition } from '../../molecules/portfolio-composition';
import { SearchModules } from '../../molecules/search-modules';
import { validationSchema } from './validation-schema';

export const CreateModuleForm = () => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit } = methods;
  const { pickedModules } = usePickModule();
  const { currentUser } = useCurrentUser();
  const { mutate: createPortfolio, isLoading } = useMutation<any, APIError, any>(
    createPortfolioReq,
    {
      onSuccess: () => {
        redirect(null, '/portfolios');
      },
    },
  );
  const { authors } = useAuthors();

  const onSubmit = useCallback(
    async (values: any) => {
      const { cover, ...newValues } = values;
      const parsedCover = cover ? { cover: JSON.parse(cover) } : {};

      await createPortfolio(
        {
          portfolioModule: {
            ...newValues,
            authorId: currentUser?.id,
            coauthorsAttributes: authors,
            ...parsedCover,
            computationModules: {
              ['pre-fe']: pickedModules['pre-fe'].map(item => item.id.toString()),
              ['post-fe']: pickedModules['post-fe'].map(item => item.id.toString()),
            },
          },
        },
        {
          onError: ({ errors }) => {
            setErrorsForForm(errors.data.attributes, methods.setError);
          },
        },
      );
    },
    [authors, createPortfolio, currentUser?.id, methods.setError, pickedModules],
  );

  return (
    <Card>
      <FormProvider {...methods}>
        <form className="flex flex-col">
          <FormField name="cover" component={UploadCover} controlled />

          <FormField
            component={Input}
            className="mb-2 mt-2"
            label="Portfolio title *"
            name="title"
            placeholder="Enter portfolio title"
          />
          <FormField
            as="textarea"
            component={TextAreaLimit}
            className="mb-2"
            label="Portfolio description *"
            name="description"
            limit={100}
            placeholder="Use up to 100 words to describe the function, potential impact and added value of your intellectual product, e.g. enables the prediction of micro-structure evolution; saving R&D time by 6 Man - Month; R&D cost saving of £126,000;  Model - Errors less than 5% etc."
            controlled
            rows={4}
          />

          <SearchModules />
          <PortfolioComposition />
          <div className="mt-2">
            <AuthorList />
          </div>
          <FormField
            component={MultiInput}
            width={350}
            variant="default"
            withHelperText
            className="my-2"
            controlled
            name="keywords"
            label="Keywords"
            placeholder="Enter keywords that describe your module"
          />
          <div className="flex justify-end">
            <Button disabled={isLoading} onClick={handleSubmit(onSubmit as any)}>
              create portfolio
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};
