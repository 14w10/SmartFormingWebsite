interface FileAttachment {
  metadata: {
    size: string;
    filename: string;
    mime_type: string;
  };
}

interface FileUploadResultDTO extends FileAttachment {
  id: ID;
  storage: string;
}
