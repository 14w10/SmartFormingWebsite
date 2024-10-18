export const getInitialSchema = ($id: string) => ({
  $id,
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: '',
  description: '',
  stepTitle: '',
  required: [],
  properties: {} as any,
});
