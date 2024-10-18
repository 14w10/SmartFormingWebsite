export const setErrorsForForm = (errors: any, setError: (name: any, error: any) => void) => {
  const errorsKey = Object.keys(errors || {});
  errorsKey.forEach(fieldName => {
    setError(fieldName, { type: 'manual', message: errors[fieldName] });
  });
};
