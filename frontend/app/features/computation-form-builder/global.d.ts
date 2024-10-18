interface ComputationFormBuilderDTO {
  payload: ComputationFormBuilder;
}

type SchemaItem = {
  default?: string;
  description?: string;
  enum?: string[];
  items?: { type: string; properties: Record<string, ISchemaItem> };
  maxLength?: number;
  minLength?: number;
  minItems?: number;
  maxItems?: number;
  stepValue?: number;
  required?: string[] | boolean;
  title: string;
  type: string;
};

type Schema = Omit<InitialSchema, 'properties'> & {
  properties: {
    [key: string]: {
      type: string;
      title: string;
      description?: string;
      minLength?: number;
      default?: string;
      items: {
        type: string;
        properties: any;
        [key: string]: any;
      };
    };
  };
};

interface ComputationFormBuilder {
  computationFormId: ID;
  computationModuleId: ID;
  files: IFileField[];
  filesBlockEnabled: boolean;
  steps: Schema[];
}
