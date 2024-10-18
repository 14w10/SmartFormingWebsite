import { apiClient } from 'libs/api';
import React from "react";
import { useFirestoreDocumentData } from "@react-query-firebase/firestore";
import { doc, DocumentSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const useAllTests = ({ 
  ...params
}) => {
  // Reference to the document in Firestore
  const documentRef = doc(db, 'users', 'Demo User');

  // Firestore query using react-query-firebase
  const query = useFirestoreDocumentData(
    ['allTests'], // Unique key for react-query cache
    documentRef,
  );

  return query;
};
