interface Computation {
  id: number;
  author: User;
  computationFormId: number;
  computationModuleId: number;
  computationResultId: number;
  computationModuleTitle: string;
  computationModuleShortDescription: string;
  computationModuleDescription: string;
  status: 'new' | 'processing' | 'declined' | 'finished';
  declineReason: string | null;
  createdAt: string;
  finishedAt: string | null;
  processedAt: string | null;
  updatedAt: string | null;
  type: string;
  meta: IMeta;
  attachment: IAttachFile;
  computationModuleType?: ModuleType;
}

type ComputationGraphicOptions = {
  id: number;
  parameters: any[];
  link: string;
  resultUrl: null | string;
  data: {
    elementIdx: string[];
    info: string[];
    majorStrain: string[];
    minorStrain: string[];
    nodeIdx1: string[];
    nodeIdx2: string[];
    nodeIdx3: string[];
    temperature2: string[];
    zones: string[];
  };
};
