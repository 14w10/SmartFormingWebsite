import { FC, useMemo } from 'react';
import MaskedInput from 'react-text-mask';
import { FastField, FieldProps, FormikErrors } from 'formik';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { TextField } from '../../atoms';
import { IField } from './use-dynamic-form';

const numberMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: false,
  allowDecimal: true,
  decimalLimit: 5,
  integerLimit: 9,
  allowNegative: true,
});

const NumberFormatCustom = (props: {
  inputRef: (ref: HTMLInputElement | null) => void;
  type: string;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { inputRef, type, ...rest } = props;

  return (
    <MaskedInput
      {...rest}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={numberMask}
    />
  );
};

interface IDynamicFieldProps extends IField {
  errors: FormikErrors<any>;
}

const components: { [key: string]: FC<any> } = {
  string: (p: any) => <TextField {...p} />,
  number: (p: any) => <TextField {...p} inputComponent={NumberFormatCustom} type="number" />,
};

export const DynamicField: FC<IDynamicFieldProps> = ({ errors, label, name, helperText, type }) => {
  const FieldComponent = useMemo(() => components[type] || components.string, [type]);
  return (
    <FastField
      name={name}
      render={({ field, form }: FieldProps) => (
        <FieldComponent
          error={errors[name] as string}
          field={field}
          form={form}
          label={label}
          helperText={errors[name] ? errors[name] : helperText}
        />
      )}
    />
  );
};
