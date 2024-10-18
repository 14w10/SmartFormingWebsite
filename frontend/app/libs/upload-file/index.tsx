import { useCallback, useState } from 'react';
import { useMutation, UseMutationOptions } from 'react-query';
import axios, { AxiosProgressEvent, AxiosRequestConfig, CancelToken, CancelTokenSource } from 'axios';
import debounce from 'lodash.debounce';

import { apiClient } from '../api';

interface IPresignRes {
  fields: { key: string; [key: string]: string };
  url: string;
  method: AxiosRequestConfig['method'];
}

export const uploadFile = async (
  file: File,
  onUploadProgress: (loaded: AxiosProgressEvent) => void,
  cancelToken?: CancelToken,
) => {
  // 1 - get s3 url and fields
  const {
    data: { fields, url, method },
  } = await apiClient.get<IPresignRes>(`/uploads/presign?type=${file.type}`, {
    adapter: undefined,
    transformResponse: res => JSON.parse(res),
  });

  // 2 - upload file to s3
  const fd = new FormData();
  Object.entries(fields).forEach(field => fd.append(...field));
  fd.append('file', file);

  const GITLAB_URL = "https://gitlab.com/api/v4";  // Your GitLab instance URL
  const PROJECT_ID = "13693076";  // The ID of your project
  const FILE_PATH = `python/computation_modules/computation_modules/${file.name}`;  // The path to the file you want to upload in the repo
  const BRANCH = "staging";  // The branch where you want to upload the file
  const COMMIT_MESSAGE = `Auto-upload a new file: ${file.name}`;
  const ACCESS_TOKEN = "glpat-hB3G-k4tiyCs1Hqv1rYK";


  /**
   * This is a new feature to directly get a Promise<String> from the object File. 
   * Since all our python files are original text files, 
   * we only need to handle the text as the file content. 
   */
  const fileContent = await file.text();
  // console.log(fileContent);

  const apiEndpoint = `${GITLAB_URL}/projects/${PROJECT_ID}/repository/files/${encodeURIComponent(FILE_PATH)}`;

  if (file.name.endsWith(".py")) {
    try {
      const response = await axios.post(apiEndpoint, {
        branch: BRANCH,
        content: fileContent,
        commit_message: COMMIT_MESSAGE
      }, {
        headers: {
          'PRIVATE-TOKEN': ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      });
      // console.log('File uploaded successfully:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // console.error('Error uploading file:', error.response.data);
            /**
             * This part deals with the situation that once the client tried to 
             * upload a different file but with the same name as the former uploaded file. 
             * We use Put command to update the file content. 
             */
            if (error.response.data.message == `A file with this name already exists`) {
              await axios.put(apiEndpoint, {
                  branch: BRANCH,
                  content: fileContent,
                  commit_message: COMMIT_MESSAGE
              }, {
                  headers: {
                  'PRIVATE-TOKEN': ACCESS_TOKEN,
                  'Content-Type': 'application/json'
                  }
              });
          }
        }
    }
  }


  await apiClient({
    baseURL: '',
    data: fd,
    method,
    url,
    headers: {
      Accept: 'application/xml',
      'Content-Type': 'multipart/form-data;',
    },
    transformRequest: reqData => reqData,
    onUploadProgress: debounce(onUploadProgress, 200),
    cancelToken,
  });

  const metadata: FileAttachment['metadata'] | any = {
    size: file.size,
    filename: file.name,
    mime_type: file.type,
  };

  // 3 - bind file to db
  const keys = fields.key.split('/');
  const fileData: FileUploadResultDTO = {
    id: keys.pop() as string,
    storage: keys.join('/'),
    metadata,
  };

  return fileData;
};

let cancelTokenSource: CancelTokenSource;

export const useFileUpload = (options?: UseMutationOptions<FileUploadResultDTO, any, File>) => {
  const [selectedFile, selectedFileSet] = useState<File | undefined>();
  const [uploadProgress, uploadProgressSet] = useState(0);
  const { mutate: upload, ...uploadState } = useMutation((file: File) => {
    uploadProgressSet(0);
    selectedFileSet(file);
    cancelTokenSource = axios.CancelToken.source();
    return uploadFile(
      file,
      (e) => {
        if (e.total) { // Check if e.total is defined
          uploadProgressSet(Math.floor((e.loaded * 100) / e.total));
        }
      },
      cancelTokenSource.token,
    );
  }, options);

  const reset = useCallback(() => {
    cancelTokenSource?.cancel();
    uploadState.reset();
    selectedFileSet(undefined);
  }, [uploadState]);

  return { reset, selectedFile, upload, uploadProgress, uploadState };
};

if (process.env.NODE_ENV === 'development' && typeof window === 'object') {
  (window as any).uploadFile = uploadFile;
}
