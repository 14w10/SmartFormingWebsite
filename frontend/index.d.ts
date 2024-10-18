declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';
declare module '*.ico';
declare module '*.woff';
declare module '*.woff2';
declare module '*.ttf';

declare namespace React {
  interface DOMAttributes<T> {
    css?: any;
  }
}

// TODO: get rid (all types should be in app) after migration
type ID = string | number;

type ISchemaItem = {
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

interface ISchema {
  $id: string;
  type: string;
  title: string;
  stepTitle: string;
  $schema: string;
  required: string[];
  properties: {
    [key: string]: {
      type: string;
      required?: string[];
      title: string;
      description?: string;
      minLength?: number;
      default?: string;
      items?: {
        [key: string]: any;
        type: string;
        properties: Record<string, ISchemaItem>;
      };
    };
  };
  description: string;
}

interface IFileField {
  label: string;
  description: string;
  fieldName: string;
}

interface IComputationForm {
  computationFormId: ID;
  computationModuleId: ID;
  files: IFileField[];
  filesBlockEnabled: boolean;
  steps: ISchema[];
}
