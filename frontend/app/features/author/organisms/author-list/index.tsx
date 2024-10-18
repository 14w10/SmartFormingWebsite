import { useCallback, useState } from 'react';

import { Button, Icon, InfoPopover, Keywords } from '@smar/ui';

import { useAuthors } from '../../hook/use-authors';
import { AddAuthorModal } from '../add-author-modal';

const Author = ({
  item,
  handleOpenModal,
  i,
}: {
  item: Author;
  i: number;
  handleOpenModal: () => void;
}) => {
  const [expanded, expandedSet] = useState(false);
  const { authors, deleteAuthors, editedAuthorIdSet } = useAuthors();

  return (
    <div
      key={item.generatedId}
      className={`border-secondaryDarkBlue930   pb-2 ${
        i === authors.length - 1 ? '' : 'border-b mb-2 '
      } `}
    >
      <div className="grid grid-cols-2">
        <div>
          <p className="text-secondaryDarkBlue920 v-text130">
            {item.main ? 'Main author' : 'Co-author'}
          </p>
          <p className="v-h170">
            {item.firstName} {item.lastName}
          </p>
          {item.institution && (
            <div className="v-text130 flex">
              <p className="text-secondaryDarkBlue920 mr-1">Institution</p>
              <p className="text-secondaryDarkBlue900">{item.institution}</p>
            </div>
          )}
          <div>
            <div>
              <Button
                variant="icon"
                className="text-primaryBlue900"
                onClick={() => expandedSet(prev => !prev)}
              >
                expand more details
                <Icon name={expanded ? 'expand-less' : 'expand-more'} size={24} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="v-text130 flex items-center">
            {item.region && (
              <div>
                <p className="text-secondaryDarkBlue920 mr-1">Region</p>
                <p className="text-secondaryDarkBlue900">{item.region}</p>
              </div>
            )}
          </div>
          <div className="flex items-start">
            <Button
              variant="icon"
              className="text-primaryBlue900"
              onClick={() => {
                handleOpenModal();
                editedAuthorIdSet(item.generatedId);
              }}
            >
              <Icon name="24px-edit" size={24} />
            </Button>
            <Button
              variant="icon"
              className="text-primaryBlue900 ml-1"
              onClick={() => deleteAuthors(item.generatedId)}
            >
              <Icon name="delete" size={24} />
            </Button>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="grid grid-cols-2">
          {item.degree && (
            <div className="v-text130 flex mt-2">
              <p className="text-secondaryDarkBlue920 mr-1">Academic Degree(s)</p>
              <p className="text-secondaryDarkBlue900">{item.degree}</p>
            </div>
          )}
          {item.orcid && (
            <div className="v-text130 flex mt-2">
              <p className="text-secondaryDarkBlue920 mr-1">ORCID</p>
              <p className="text-secondaryDarkBlue900">{item.orcid}</p>
            </div>
          )}
          {item.email && (
            <div className="v-text130 flex mt-2">
              <p className="text-secondaryDarkBlue920 mr-1">Email</p>
              <p className="text-secondaryDarkBlue900">{item.email}</p>
            </div>
          )}
          {item.productContribution && (
            <div className="v-text130 flex mt-2">
              <p className="text-secondaryDarkBlue920 mr-1">Intellectual product contribution, %</p>
              <p className="text-secondaryDarkBlue900">{item.productContribution}</p>
            </div>
          )}
          {item.researchAreas && (
            <div className="v-text130 flex mt-2">
              <p className="text-secondaryDarkBlue920 mr-1">Research Areas</p>
              <p className="text-secondaryDarkBlue900">
                <Keywords data={item.researchAreas} />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AuthorList = () => {
  const { authors, editedAuthorIdSet } = useAuthors();
  const [isOpenModal, isOpenModalSet] = useState(false);

  const handleClose = useCallback(() => {
    isOpenModalSet(false);
    editedAuthorIdSet(null);
  }, [editedAuthorIdSet]);

  const handleOpen = useCallback(() => isOpenModalSet(true), []);

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="v-h150">Current Authors List</h2>
            <InfoPopover>
              If you have co-authors you can add them. Co-author will receive an email with
              invitation to join the platform and be asked to provide consent to the publication of
              this intellectual product
            </InfoPopover>
          </div>
          <Button variant="icon" className="text-primaryBlue900" onClick={handleOpen}>
            <Icon name="24px-add" size={24} />
            <span className="ml-1">Add Authors</span>
          </Button>
        </div>
        <div className="rounded-large border-secondaryDarkBlue930 mt-1 p-3 border">
          {authors?.length > 0 ? (
            authors.map((item, i) => (
              <Author key={item.generatedId} item={item} handleOpenModal={handleOpen} i={i} />
            ))
          ) : (
            <div className="text-secondaryDarkBlue920 v-text130 text-center">
              Authors didn’t added yet
            </div>
          )}
        </div>
      </div>
      <AddAuthorModal isOpen={isOpenModal} handleClose={handleClose} />
    </>
  );
};
