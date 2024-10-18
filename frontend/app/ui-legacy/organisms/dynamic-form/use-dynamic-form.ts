import { useCallback, useMemo } from 'react';
import Ajv, { ErrorObject } from 'ajv';
import { assocPath, pathOr } from 'ramda';

import { compareFieldKeys } from 'libs/compare-field-keys';

export interface IField extends DynamicObj {
  name: string;
  label: string;
  minLength?: number;
  maxLength?: number;
  helperText?: string;
}

const errorObjectToYupErrors = (errors?: ErrorObject[] | null) => {
  if (!errors) return {};

  return errors.reduce((acc, err) => {
    const paths = err.dataPath.split('.').filter(item => item);
    const res = assocPath(
      paths,
      err.keyword === 'minLength' ? 'Should be filled' : err.message,
      acc,
    );

    return res;
  }, {});
};

export const useDynamicForm = (schema: any, initial: DynamicObj = {}) => {
  const properties = pathOr<DynamicObj>({}, ['properties'], schema);

  const { validator, initialValues, fields } = useMemo(() => {
    const data = Object.keys(properties)
      .sort(compareFieldKeys)
      .reduce<{
        initialValues: DynamicObj;
        fields: IField[];
      }>(
        (acc, name) => {
          const { type = 'string', description = '', ...restProps } = properties[name];
          const label = description ? description : name;

          acc.fields.push({
            label,
            name,
            minLength: restProps.minLength,
            maxLength: restProps.maxLength,
            helperText: restProps.default || '',
            type,
            default: restProps.default,
            ...restProps,
          });

          acc.initialValues[name] = '';

          return acc;
        },
        { initialValues: {}, fields: [] },
      );

    return {
      initialValues: { ...data.initialValues, ...initial } as DynamicObj,
      fields: data.fields,
      validator: new Ajv(),
    };
  }, [initial, properties]);

  if (process.browser) {
    (window as any).validator = validator;
  }

  const validate = useCallback(
    (    values: any) => {
      validator.validate(schema, values);
      return errorObjectToYupErrors(validator.errors);
    },
    [schema, validator],
  );

  return { validate, initialValues, fields };
};
