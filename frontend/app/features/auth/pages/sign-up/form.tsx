import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button, Typography } from '@smar/ui';

import { setErrorsForForm } from 'libs/set-errors-for-form';
import { Head } from 'features/layout';

import { signUpReq } from '../../api';
import * as Yup from 'yup';
import { FirstStep, SecondStep } from './steps';
import { userInitialValues, userValidationSchema, orgInitialValues, orgValidationSchema, SignUpFields, UserFields } from './validation-schema';

export const Form = () => {
  const [step, setStep] = useState(1);
  const getValidationSchema = (step: number): Yup.ObjectSchema<SignUpFields> => {
    switch (step) {
      case 1:
        return userValidationSchema as Yup.ObjectSchema<SignUpFields>;
      case 2:
        return orgValidationSchema as Yup.ObjectSchema<SignUpFields>;
      default:
        return userValidationSchema as Yup.ObjectSchema<SignUpFields>;
    }
  };

  const methods = useForm<SignUpFields>({
    resolver: yupResolver(getValidationSchema(step)),
  });
  const {
    handleSubmit, 
    setError,
    formState: {isSubmitting}
  } = methods;
  const [confirmForm, setConfirmForm] = useState(false);
  const { mutate: signUp } = useMutation<any, APIError, any>(signUpReq, {
      onError: ({ errors }) => {
        setErrorsForForm(errors.data.attributes, setError);
        return undefined;
      },
    });
  const onSubmit = useCallback(
    (data: SignUpFields) => {
      try {
        console.log("data:", data);
        signUp(
          { signup: data, step },
          {
            onSuccess: () => {
              console.log('step:', step);
              if (step < 2) {
                setStep((prev) => (prev + 1));
              } else {
                setConfirmForm(true);
              }
            },
          },
        );
      } catch(error) {
        console.log(error);
      }
    },
    [signUp, step],
  );
  const backStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, [methods]);

  return (
    <>
      <Head title="Sign up" />
      {confirmForm ? (
        <div>
          <Typography variant="p130">
            Thank you! Your sign-up request is under review. We'll email you shortly
          </Typography>
          <Link href="/sign-in" passHref>
            <Typography as="a" variant="label140" fontWeight="bold" color="secondaryDarkBlue900">
              Sign in
            </Typography>
          </Link>
        </div>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {step === 1 && (
              <>
                <FirstStep />
                <Button type="submit" className="mt-3" onClick={() => {
                    console.log('step:', step);
                    console.log("confimForm:", confirmForm);
                  } }>
                    Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <SecondStep/>
                <Button type="submit" className="mt-3" disabled={isSubmitting}>
                   Create Account
                 </Button>
                 <Button type="button" className="mt-3" onClick={backStep} variant="outlined">
                   Back
                 </Button>                
              </>
            )}
          </form>
        </FormProvider>
      )}
    </>
  );

  // const [formValues, formValuesSet] = useState(initialValues);
  // const [step, setStep] = useState(0);
  // const methods = useForm({
  //   resolver: yupResolver(validationSchema[step] as any),
  //   defaultValues: formValues,
  // });
  // const {
  //   setValue, 
  //   handleSubmit,
  //   formState: { isSubmitting },
  // } = methods;
  // const [confirmForm, setConfirmForm] = useState(false);
  // 
  // const StepComponent = useMemo(() => steps[step], [step]);

  // const onSubmit = useCallback(
  //   (values: any) => {
  //     try {
  //       console.log('Submitting values:', values);
  //       const newValues = { ...formValues, ...values };
  //       signUp(
  //         { signup: newValues, step },
  //         {
  //           onSuccess: () => {
  //             console.log('step:', step);
  //             formValuesSet(prevState => ({ ...prevState, ...newValues }));
  //             if (step === 0) {
  //               setStep(1);
  //             } else {
  //               setConfirmForm(true);
  //             }
  //           },
  //         },
  //       );
  //     } catch(error) {
  //       console.log(error);
  //     }
  //   },
  //   [formValues, signUp, step],
  // );
  

  // const backStep = useCallback(() => {
  //   setStep(prevStep => prevStep - 1);
  //   formValuesSet(prevState => ({ ...prevState, ...methods.getValues() }));
  // }, [methods]);

  // useEffect(() => {
  //   const keyFields = Object.keys(formValues);
  //   keyFields.map(key => {
  //     setValue(key as any, formValues[key as keyof typeof formValues]);
  //   });
  // }, [formValues, setValue, step]);

  // return (
  //   <>
  //     <Head title="Sign up" />
  //     {confirmForm ? (
  //       <div>
  //         <Typography variant="p130">
  //           Thank you! Your sign-up request is under review. We'll email you shortly
  //         </Typography>
  //         <Link href="/sign-in" passHref>
  //           <Typography as="a" variant="label140" fontWeight="bold" color="secondaryDarkBlue900">
  //             Sign in
  //           </Typography>
  //         </Link>
  //       </div>
  //     ) : (
  //       <FormProvider {...methods}>
  //         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
  //           <StepComponent />
  //           {/* {step !== steps.length - 1 && (
  //             <Button type="submit" className="mt-3">
  //               Next
  //             </Button>
  //           )}
  //           {step !== 0 && (
  //             <>
  //               <Button type="submit" className="mt-3" disabled={methods.formState.isSubmitting}>
  //                 Create Account
  //               </Button>
  //               <Button type="button" className="mt-3" onClick={backStep} variant="outlined">
  //                 Back
  //               </Button>
  //             </>
  //           )} */}
  //           {step === steps.length - 1 ? (
  //             <>
  //               <Button type="submit" className="mt-3" disabled={isSubmitting}>
  //                 Create Account
  //               </Button>
  //               <Button type="button" className="mt-3" onClick={backStep} variant="outlined">
  //                 Back
  //               </Button>
  //             </>
  //           ) : (
  //             <Button type="submit" className="mt-3" onClick={() => {
  //               console.log('step:', step);
  //               console.log('\n');
  //               console.log('formValues:', formValues);
  //               }}>
  //               Next
  //             </Button>
  //           )}
  //         </form>
  //       </FormProvider>
  //     )}
  //   </>
  // );
};
