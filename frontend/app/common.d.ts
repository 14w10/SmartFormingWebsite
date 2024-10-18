type ID = string | number;

interface APIResponse<T, M = {}> {
  payload: T;
  meta?: M;
}

interface APIListResponse<T, M = {}> {
  payload: T[];
  meta: {
    totalPages: number;
    totalCount: number;
  } & M;
}

interface APIError {
  errors: Record<string, any>;
  message: string;
  statusCode: number;
}
