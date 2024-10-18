type Category = {
  id: string;
  name: string;
  icon: { url: string };
  publishedComputationModulesCount: number;
};

type UpdateCategoryInput = {
  id: string;
  name: string;
  icon?: any;
  computationModulesAttributes?: {
    id: any;
  }[];
};
