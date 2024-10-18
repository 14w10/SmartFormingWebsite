import { FC } from 'react';
import { Controller } from 'react-hook-form';

import { FormField as FormFieldComponent, RangeSlider, Select } from '@smar/ui';

// TODO: fix typings
type FormFieldProps = {
  field: ISchemaItem;
  name: string;
  control: any;
};

export const FormField: FC<FormFieldProps> = ({ name, field, control }) => {
  if (field.enum) {
    return (
      <div className="w-full px-2 -mx-2">
        <div className="w-1/3 mb-4">
          <FormFieldComponent
            component={Select}
            caption={field.description}
            variant="light"
            name={name}
            rules={
              field.required
                ? {
                    required: { message: `${field.description} field is mandatory`, value: true },
                  }
                : {}
            }
            items={field.enum?.map(value => ({ value, label: value })) ?? []}
            controlled
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 px-2 -mx-2">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <RangeSlider
              className="mb-4"
              label={field.description as string}
              name={name}
              defaultValue={field.default as any}
              min={field.minLength}
              max={field.maxLength}
              withInput
              onChange={onChange}
              step={field?.stepValue}
              initialValue={value ?? field.default}
            />
          );
        }}
      />
    </div>
  );
};
