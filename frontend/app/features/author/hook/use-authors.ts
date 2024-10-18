import { useCallback, useState } from 'react';
import constate from 'constate';

const useAuthorsBase = () => {
  const [authors, authorsSet] = useState<Author[]>([]);
  const [editedAuthorId, editedAuthorIdSet] = useState<string | null>();

  const addAuthors = useCallback((value: Author) => {
    authorsSet(prev => [...prev, value]);
  }, []);

  const editAuthors = useCallback((value: Author) => {
    authorsSet(prev => prev.map(item => (item.generatedId === value.generatedId ? value : item)));
  }, []);

  const deleteAuthors = useCallback((id: string) => {
    authorsSet(prev => prev.filter(item => item.generatedId !== id));
  }, []);

  return { addAuthors, authors, deleteAuthors, editedAuthorId, editedAuthorIdSet, editAuthors };
};

export const [AuthorsProvider, useAuthors] = constate(useAuthorsBase);
