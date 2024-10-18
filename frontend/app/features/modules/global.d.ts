type ModuleType = keyof typeof import('./constants').MODULE_TYPES;

interface DatasetAttachment {
  id?: string;
  price?: string | null;
  paid: boolean;
  fileData: Omit<IAttachment, 'id'>;
}

interface Module {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  rejectReason: string;
  status: ModuleStatus;
  createdAt: string;
  keywords: string[];
  approvedAt: string | null;
  rejectedAt: string | null;
  publishedAt: string | null;
  reviewStartedAt: string | null;
  datasets: IAttachFile[];
  uid: string | null;
  author: IAuthor;
  categoryId?: string;
  computationFormId: number | null;
  attachments: IAttachFile[];
  moduleType: ModuleType;
  sortIndex?: number;
  cover: IAttachFile & { croppedUrl: string; url: string };
  onMainPage: boolean;
  moduleContentType: 'functional_module' | 'data_module';
}

type ComputationModulesDTO = APIListResponse<Module>;

type ComputationModuleDTO = APIResponse<Module>;

type ModuleStatus = 'approved' | 'under_review' | 'published' | 'rejected' | 'new';
