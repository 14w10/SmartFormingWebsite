export const getSerializedValues = (
  formValues: any,
  tabSchema?: ISchemaItem | false,
  activeTabKey?: string,
) => {
  if (!tabSchema || !activeTabKey) return null;

  const formattedValues = Object.keys(formValues).reduce((acc, key) => {
    const item =
      (tabSchema as any).items?.properties?.[key] || (tabSchema as any).items?.properties?.cycle;

    if (item.type === 'array') {
      // FIXME: throwing errors
      const newValue = formValues[key].map((element: any) =>
        Object.keys(element).reduce((acc, arrayKey) => {
          return {
            ...acc,
            [arrayKey]: {
              ...item?.items?.properties[arrayKey],
              label: item?.items?.properties[arrayKey]?.description,
              value: element[arrayKey] || item?.items?.properties[arrayKey]?.default,
            },
          };
        }, {}),
      );

      return {
        [activeTabKey]: {
          type: 'cycle' as const,
          values: {
            items: newValue,
          },
        },
      };
    } else {
      const newValue = {
        ...item,
        label: item?.description,
        value: formValues[key] || item?.default,
      };

      return {
        ...acc,
        [activeTabKey]: {
          // TODO: fix typings
          ...(acc as any)[activeTabKey],
          [key]: newValue,
        },
      };
    }
  }, {});

  return formattedValues;
};

export const getFormattedFileValues = (files: any) =>
  files &&
  Object.keys(files).reduce((acc: any, item: any) => {
    const { description, fieldName, label, ...restFile } = files[item];
    const newFileItem = {
      file: restFile,
      fileType: 'computationRequestData',
      description,
      label,
      fieldName,
    };
    return [...acc, newFileItem];
  }, []);
