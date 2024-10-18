import { FC } from 'react';
import { motion } from 'framer-motion';

import { Icon } from '@smar/ui';

import st from './styles.module.scss';

type FileAttachmentProps = {
  fileName?: string;
  /**
   * float value
   */
  uploadProgress: number;
  resetFile: () => void;
};

export const FileAttachment: FC<FileAttachmentProps> = ({
  fileName,
  uploadProgress,
  resetFile,
}) => {
  const fileUploaded = uploadProgress === 100;

  return (
    <div className={st.attachedFile}>
      <motion.div
        animate={{ width: `calc(${fileUploaded ? '100' : uploadProgress}% - 8px)` }}
        className={st.progress}
      />
      <div className={st.innerWrapper}>
        <div className={st.iconTextWrapper}>
          {fileUploaded ? (
            <div className={st.progressIcon}>
              <Icon name="attachment" iconFill="primaryBlue900" size={24} />
            </div>
          ) : (
            <motion.div
              className={st.progressIcon}
              animate={{ rotate: 360 }}
              transition={{ loop: Infinity, duration: 0.5 }}
            >
              <Icon name="small-spinner" iconFill="primaryBlue900" size={24} />
            </motion.div>
          )}

          <span className="v-text130 text-primaryBlue900 ml-1 truncate">{fileName}</span>
        </div>
        {fileUploaded && (
          <Icon
            className={st.deleteIcon}
            name="delete"
            iconFill="primaryBlue900"
            size={24}
            onClick={resetFile}
          />
        )}
      </div>
    </div>
  );
};
