import { AxiosError, AxiosResponse } from 'axios';
import { pathOr } from 'ramda';

const errorNotifications = {
  byResponseStatus: {
    401: 'Unauthorize',
    403: 'Sorry, but you don’t have permission to access this area. Try another account or connect to the support team.',
    404: 'Sorry, we couldn’t find that page. Please try to use searching or connect to the support team.',
    413: 'Oops, something went wrong, please try again or connect to the support team.',
    422: 'Violation of business rules/data integrity took place.',
    429: 'Too many requests. Try again later.',
    fallback: 'Oops, something went wrong, please try again or connect to the support team.',
  },
  offline: 'It looks like you offline',
};

const errorByStatus: { [key: string]: string } = errorNotifications.byResponseStatus;

const getFallbackMsg = (status: any, errors?: Record<string, string>) => {
  if (typeof navigator === 'object' && !navigator.onLine) {
    return errorNotifications.offline;
  }

  // show first error from errors (if exists) instead of default messages
  if (errors && Object.keys(errors).length > 0) {
    return Object.values(errors)[0];
  }

  return errorByStatus[status] || errorByStatus.fallback;
};

export const handleRes = (res: AxiosResponse) => {
  if (process.env.NODE_ENV === 'development') {
    const method = (res.config.method || 'get').toUpperCase();
    const styles: any = {
      GET: 'color: #61affe',
      POST: 'color: #49cc90',
      PUT: 'color: #fca130',
      DELETE: 'color: #f93e3e',
    };

    if (process.browser) {
      console.log(`%c${method}`, styles[method], res.config.url, res.data);
    } else {
      console.log(method, res.config.url, res.data);
    }
  }

  return res;
};

export const handleError = (e: AxiosError) => {
  const status = pathOr<any>(undefined, ['response', 'status'], e);

  const errors = pathOr({}, ['response', 'data', 'errors'], e);
  const message = pathOr(getFallbackMsg(status), ['response', 'data', 'error'], e);

  const errorRes: APIError = {
    errors,
    message,
    statusCode: e.response?.status || 500,
  };

  return Promise.reject(errorRes);
};
