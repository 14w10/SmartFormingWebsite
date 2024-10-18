import React from 'react';
import { Controller, get, RegisterOptions, useFormContext } from 'react-hook-form';
import cl from 'clsx';

type GetComponentProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P>
  ? P
  : never;

export type FieldsetProps<T = React.FunctionComponent> = {
  name: string;
  className?: string;
  label?: string;
  required?: boolean;
  component: T;
  rules?: RegisterOptions;
  controlled?: boolean;
} & GetComponentProps<T>;

export function FormField<T = React.FunctionComponent>(props: FieldsetProps<T>) {
  const {
    name,
    label,
    component: Component,
    className,
    controlled,
    rules,
    placeholder,
    required,
    ...defaultProps
  } = props as any;
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cl('relative pb-2', className)}>
      {label && (
        <div className="mb-1">
          <p className="v-h150">
            {label} {required && <span className="text-auxiliaryRed900">*</span>}
          </p>
        </div>
      )}
      {controlled ? (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (
            <Component
              className="w-full"
              label={label}
              placeholder={placeholder}
              error={Boolean(get(errors, name)?.message)}
              {...defaultProps}
              {...field}
            />
          )}
        />
      ) : (
        <Component
          className="w-full"
          placeholder={placeholder || label}
          error={Boolean(get(errors, name)?.message)}
          {...defaultProps}
          {...register(name, rules)}
        />
      )}
      {errors && (
        <p className="text-auxiliaryRed900 absolute pl-2 text-xs">
          {get(errors, name)?.message}
        </p>
      )}
    </div>
  );
}
