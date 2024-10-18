interface Portfolio {
  id: number;
  title: string;
  description: string;
  rejectReason: string;
  status: ModuleStatus;
  createdAt: string;
  keywords: string[];
  approvedAt: string | null;
  rejectedAt: string | null;
  publishedAt: string | null;
  reviewStartedAt: string | null;
  uid: string | null;
  author: IAuthor;
  computationFormId: number | null;
  attachments: IAttachFile[];
  // TODO: probably should be required
  moduleType: ModuleType;
  portfolioComputationModules: {
    sortIndex: number;
    computationModule: Module;
  }[];
  cover: IAttachFile & { croppedUrl: string; url: string };
}
