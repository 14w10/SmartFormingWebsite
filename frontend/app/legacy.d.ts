type DynamicObj = {
  [key: string]: any;
};

type UploadType = 'm' | 'py' | '';

interface IAttachment {
  id: string;
  metadata: {
    size: number;
    name?: string;
    filename: string;
    mime_type: string;
  };
}

interface IAPIResponse<T, M = {}> {
  payload: T;
}

interface IAPIListResponse<T, M = {}> {
  payload: T[];
  meta: M;
}

interface IUser {
  id: string | number;
  title: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: UserRole;
  signup: ISignupRequest;
}

interface IMeta {
  totalPages: number;
  totalCount: number;
}

interface ISignupsItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string;
  createdAt: string;
}

interface IUserItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  signup: ISignupRequest;
}

interface IAdminItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface IEditorItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface IModuleCreate {
  authorId: number | string | null;
  title: string;
  description: string;
}

interface IAuthor {
  id: string | number;
  title: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface IAttachFile {
  id: number;
  paid?: boolean;
  price?: number;
  attachableId: number;
  fileType: string;
  fileUrl: string;
  fileData: IAttachment;
  label: string;
  attachableType: string;
}

interface IModule {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  rejectReason: string;
  status: string;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  publishedAt: string | null;
  reviewStartedAt: string | null;
  author: IAuthor;
  computationFormId: number | null;
  attachments: IAttachFile[];
  moduleType?: 'pre-fe' | 'post-fe';
}

interface IModuleCard {
  id: number;
  title: string;
  status?: string;
  description?: string;
  createdAt?: string;
  computationFormId: number | null;
  storeCard?: boolean;
  isUser?: boolean | null;
}

interface ISubjectCard {
  id: number;
  name: string; 
  color: string;
  createdAt: string;
}

interface ICreateAdmin {
  firstName: string;
  lastName: string;
  email: string;
}

interface ICreateEditor {
  firstName: string;
  lastName: string;
  email: string;
}

interface ISignupRequest {
  id: number | string;
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  organizationName: string;
  organizationAddress: string;
  organizationPostcode: number | string;
  organizationCountry: string;
  position?: string;
  role?: string;
  organizationBusiness?: string;
  website?: string;
  linkedin?: string;
  researchGate?: string;
  otherLink?: string;
  status: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface ISignIn {
  email: string;
  password: string;
  remember: boolean;
}

interface ISignUp {
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  organizationName: string;
  organizationAddress: string;
  organizationPostcode: number | string;
  organizationCountry: string;
  position?: string;
  role?: string;
  organizationBusiness?: string;
  website?: string;
  linkedin?: string;
  researchGate?: string;
  otherLink?: string;
}

interface IForgetPassword {
  email: string;
}

interface IResetPassword {
  password: string;
  passwordConfirmation: string;
  resetPasswordToken: string;
}

interface IComputationRequest {
  id: number;
  author: IUser;
  computationFormId: number;
  computationModuleId: number;
  computationModuleTitle: string;
  computationModuleShortDescription: string;
  computationModuleDescription: string;
  status: string;
  declineReason: string | null;
  createdAt: string;
  finishedAt: string | null;
  processedAt: string | null;
  updatedAt: string | null;
  type: string;
  meta: IMeta;
  attachments: IAttachFile[];
  computationModuleType?: 'pre-fe' | 'post-fe';
}

interface IPortlofioRequest {
  id: number;
  author: IUser;
  computationFormId: number;
  computationModuleId: number;
  title: string;
  description: string;
  status: string;
  declineReason: string | null;
  createdAt: string;
  finishedAt: string | null;
  processedAt: string | null;
  updatedAt: string | null;
  type: string;
  meta: IMeta;
  portfolioModule: {
    attachments: IAttachFile[];
  };
}

interface IComputationRequestCard {
  status: string;
  createdAt: string;
  computationModuleTitle: string;
  title: string;
}
