import { getInitialSchema } from './schema';

type InitialSchema = ReturnType<typeof getInitialSchema>;

export type SchemaItem = {
  [key: string]: {
    type: string;
    required?: string[];
    title: string;
    description?: string;
    minLength?: number;
    default?: string;
    items?: {};
  };
};

export type SchemaType = Omit<InitialSchema, 'properties'> & {
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

export interface ActionsState {
  schema: SchemaType[];
  isOpen: null | 'field' | 'tab' | 'cycle' | 'cycleField';
  currentStep: number;
  currentTab?: string;
  initialFieldValues: {};
  files: IFileField[];
  filesBlockEnabled: boolean;
}
