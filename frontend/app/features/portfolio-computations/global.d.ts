type PortfolioRequestStatus = 'new' | 'declined' | 'approved';

interface PortfolioRequest {
  id: number;
  author: User;
  computationFormId: number;
  computationModuleId: number;
  title: string;
  description: string;
  status: PortfolioRequestStatus;
  declineReason: string | null;
  createdAt: string;
  finishedAt: string | null;
  processedAt: string | null;
  updatedAt: string | null;
  type: string;
  meta: IMeta;
  portfolioModule: {
    attachments: IAttachFile[];
    computationModulesArray: {
      'post-fe': number[];
      'pre-fe': number[];
    };
  };
  portfolioComputationRequests: Computation[];
}
